import { World, Entity } from "../ecs/entities";
import { Component } from "../ecs/component";
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

function spatialInformation(position : Position, rotation : Rotation, spatialCache : SpatialCache, id : Entity, now : number, velocity : Velocity) : string
{
  let msgParts : string[] = [];
  if (position)
    msgParts.push(positionToString(spatialCache.interpolatePosition(position, id, now)));

  if (rotation)
    msgParts.push((180 * wrapAngle(spatialCache.interpolateRotation(rotation, id, now)) / Math.PI).toFixed() + "°");

  if (velocity)
    msgParts.push(norm(velocity.vel).toFixed());

  return msgParts.join(" | ");
};

function entityName(world : World, id : Entity) : string
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

function renderShip(id : Entity, world : World, spatialCache : SpatialCache, now : number) : VdomElement
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
      ? VdomElement.create("span", {"class" : "pos"}, spatialInformation(position, rotation, spatialCache, id, now, velocity))
      : null,

    renderMoveTarget(moveTarget),

    renderAttackTarget(attackTarget, world)
  );
};

function renderSquadron(id : Entity, world : World, spatialCache : SpatialCache, now : number) : VdomElement
{
  let [name, squadron, moveTarget, attackTarget] = world.getOptionalComponents(id, [Named, Squadron, MoveToTarget, AttackTarget]) as [Named, Squadron, MoveToTarget, AttackTarget];
  const squadronId = id;
  const flagship = squadron.flagship;
  const squadronMembers = world.findEntities([SquadronMember], (id : Entity, components : Component[]) =>
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

    VdomElement.create("div", {"class" : "members"}, ...squadronMembers.map(id => renderShip(id, world, spatialCache, now)) )
  );
};

export class StatusWindow implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private ui : UiManager)
  {
    this.elem = VdomElement.create("div", {"class" : "window"});
    this.$elem = createElement(this.elem) as HTMLElement;
  }

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    let elem = VdomElement.create("div", {"class" : "window"});
    world.forEachEntity([Selected], (id : Entity, components : Component[]) =>
    {
      elem.children.push(
        world.getComponent(id, Squadron)
        ? renderSquadron(id, world, this.spatialCache, now)
        : renderShip(id, world, this.spatialCache, now)
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