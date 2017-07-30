import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { Selected } from "../systems/selection";
import { Position, Rotation } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Velocity } from "../systems/kinematic";
import { MoveToTarget } from "../systems/moveTo";
import { Named } from "../systems/named";
import { Squadron, SquadronMember } from "../systems/squadron";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Damageable } from "../systems/damageable";

import { VdomNode, VdomElement, createElement, updateElementChildren } from "../vdom/vdom";

import { Vec2, lerp, norm } from "../vec2/vec2";
import { wrapAngle } from "../util/angle";

function positionToString(pos : Vec2) : string
{
  return pos.x.toFixed() + " : " + pos.y.toFixed();
};

function spatialInformation(position : Position, rotation : Rotation, spatialCache : SpatialCache, id : number, interp : number, velocity : Velocity) : string
{
  let msgParts : string[] = [];
  if (position)
    msgParts.push(positionToString(spatialCache.interpolatePosition(position, id, interp)));

  if (rotation)
    msgParts.push((180 * wrapAngle(spatialCache.interpolateRotation(rotation, id, interp)) / Math.PI).toFixed() + "°");

  if (velocity)
    msgParts.push(norm(velocity.vel).toFixed());

  return msgParts.join(" | ");
};

function entityName(world : World, id : number) : string
{
  if (!world.containsEntity(id))
    return null;

  let name = world.getComponent(id, Named) as Named;
  return name ? name.name : null;
};

function renderMoveTarget(moveTarget : MoveToTarget) : VdomElement
{
  return moveTarget && moveTarget.order.kind === "MoveTo"
    ? VdomElement.create("span", {"class" : "tgt"}, positionToString(moveTarget.order.target))
    : null;
}

function renderAttackTarget(attackTarget : AttackTarget, world : World) : VdomElement
{
  return attackTarget && attackTarget.target
    ? VdomElement.create("span", {"class" : "atk"}, entityName(world, attackTarget.target))
    : null;
}

function renderShip(id : number, world : World, spatialCache : SpatialCache, interp : number) : VdomElement
{
  let [name, position, rotation, velocity, moveTarget, attackTarget, damageable] = world.getOptionalComponents(id,
    [Named, Position, Rotation, Velocity, MoveToTarget, AttackTarget, Damageable]
    ) as [Named, Position, Rotation, Velocity, MoveToTarget, AttackTarget, Damageable];

  return VdomElement.create("div", { "class" : "ship" },

    name
      ? VdomElement.create("span", {"class" : "name"}, name.name)
      : null,

    damageable
      ? VdomElement.create("span", {"class" : "hp"}, damageable.hitpoints.toFixed() + "/" + damageable.maxHitpoints.toFixed())
      : null,

    position || rotation || velocity
      ? VdomElement.create("span", {"class" : "pos"}, spatialInformation(position, rotation, spatialCache, id, interp, velocity))
      : null,

    renderMoveTarget(moveTarget),

    renderAttackTarget(attackTarget, world)
  );
};

function renderSquadron(id : number, world : World, spatialCache : SpatialCache, interp : number) : VdomElement
{
  let [name, squadron, moveTarget, attackTarget] = world.getOptionalComponents(id, [Named, Squadron, MoveToTarget, AttackTarget]) as [Named, Squadron, MoveToTarget, AttackTarget];
  const squadronId = id;
  const flagship = squadron.flagship;
  const squadronMembers = world.findEntities([SquadronMember], (id : number, components : any[]) =>
  {
    let [member] = components as [SquadronMember];
    return member.squadron === squadronId;
  });

  return VdomElement.create("div", { "class" : "squadron" },

    name
      ? VdomElement.create("span", {"class" : "name"}, name.name)
      : null,

    renderMoveTarget(moveTarget),

    renderAttackTarget(attackTarget, world),

    VdomElement.create("div", {"class" : "members"}, ...squadronMembers.map(id => renderShip(id, world, spatialCache, interp)) )
  );
};

export class StatusWindow implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private ui : UiManager)
  {
    this.elem = VdomElement.create("div", {"class" : "window"});
    this.$elem = createElement(this.elem) as HTMLElement;
  }

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    let elem = VdomElement.create("div", {"class" : "window"});
    world.forEachEntity([Selected], (id : number, components : any[]) =>
    {
      elem.children.push(
        world.getComponent(id, Squadron)
        ? renderSquadron(id, world, this.spatialCache, interp)
        : renderShip(id, world, this.spatialCache, interp)
      );
    });

    updateElementChildren(this.$elem, elem, this.elem);
    this.elem = elem;

    if (this.elem.children.length == 0)
    {
      if (this.$elem.parentNode)
        this.ui.removeElement(this.$elem);
    }
    else
    {
      if (!this.$elem.parentNode)
        this.ui.addElement(this.$elem);
    }
  }

  private $elem : HTMLElement;
  private elem : VdomElement;
};