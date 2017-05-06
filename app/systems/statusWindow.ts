import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager } from "../ui/uiManager";
import { Selected } from "../systems/selection";
import { Position, Rotation } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Velocity } from "../systems/kinematic";
import { MoveToTarget } from "../systems/moveTo";
import { Named } from "../systems/named";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Damageable } from "../systems/damageable";

import { VdomNode, VdomElement, createElement, updateElementChildren } from "../vdom/vdom";

import { Vec2, lerp, norm } from "../vec2/vec2";
import { wrapAngle } from "../util/angle";

function positionToString(pos : Vec2) : string
{
  return pos.x.toFixed() + " : " + pos.y.toFixed();
};

function spatialInformation(position : Position, rotation : Rotation, spatialCache : SpatialCache, e : Entity, interp : number, velocity : Velocity) : string
{
  let msgParts : string[] = [];
  if (position)
    msgParts.push(positionToString(spatialCache.interpolatePosition(position, e, interp)));

  if (rotation)
    msgParts.push((180 * wrapAngle(spatialCache.interpolateRotation(rotation, e, interp)) / Math.PI).toFixed() + "°");

  if (velocity)
    msgParts.push(norm(velocity.vel).toFixed());

  return msgParts.join(" | ");
};

function entityName(e : Entity) : string
{
  let [name] = e.getOptionalComponents([Named.t]) as [Named];
  return name ? name.name : null;
};

export class StatusWindow implements RenderSystem
{
  constructor(private entities : EntityContainer, private spatialCache : SpatialCache, private ui : UiManager)
  {
    this.elem = VdomElement.create("div", {"class" : "window"});
    this.$elem = createElement(this.elem) as HTMLElement;
  }

  update(dt : number, interp : number, deferred : Deferred) : void
  {
    let elem = VdomElement.create("div", {"class" : "window"});
    this.entities.forEachEntity([Selected.t], (e : Entity, components : any[]) =>
    {
      let [name, position, rotation, velocity, moveTarget, attackTarget, damageable] = e.getOptionalComponents(
        [Named.t, Position.t, Rotation.t, Velocity.t, MoveToTarget.t, AttackTarget.t, Damageable.t]
        ) as [Named, Position, Rotation, Velocity, MoveToTarget, AttackTarget, Damageable];

      elem.children.push(
        VdomElement.create("div", { "class" : "ship" },

          name
            ? VdomElement.create("span", {"class" : "name"}, name.name)
            : null,

          damageable
            ? VdomElement.create("span", {"class" : "hp"}, damageable.hitpoints.toFixed() + "/" + damageable.maxHitpoints.toFixed())
            : null,

          position || rotation || velocity
            ? VdomElement.create("span", {"class" : "pos"}, spatialInformation(position, rotation, this.spatialCache, e, interp, velocity))
            : null,

          moveTarget && moveTarget.target
            ? VdomElement.create("span", {"class" : "tgt"}, positionToString(moveTarget.target))
            : null,

          attackTarget && this.entities.getEntity(attackTarget.target)
            ? VdomElement.create("span", {"class" : "atk"}, entityName(this.entities.getEntity(attackTarget.target)))
            : null
        )
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