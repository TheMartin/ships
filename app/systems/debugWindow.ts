import { World, Entity, getClientId, getEntityId } from "../ecs/entities";
import { Component } from "../ecs/component";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { Selectable, Selected } from "../systems/selection";
import { Position, Rotation } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { MoveToTarget } from "../systems/moveTo";
import { Named } from "../systems/named";
import { Squadron, SquadronMember } from "../systems/squadron";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Damageable } from "../systems/damageable";
import { Armed } from "../systems/armed";
import { Controlled } from "../systems/playable";
import { Projectile } from "../systems/projectile";
import { RenderShape } from "../systems/shapeRenderer";
import { TracerEffect } from "../systems/tracerEffect";

import { VdomNode, VdomElement, createElement, updateElementChildren } from "../vdom/vdom";

import { Vec2, lerp, norm } from "../vec2/vec2";

function printEntity(e : Entity) : string
{
  return Number(getClientId(e)).toFixed(0) + "-" + Number(getEntityId(e)).toFixed(0);
}

function printNumber(x : Number) : string
{
  return Number(x).toFixed(2);
}

function printVec2(v : Vec2) : string
{
  return "[ " + printNumber(v.x) + ", " + printNumber(v.y) + " ]";
}

type ComponentClass = new (...args : any[]) => Component;

interface Def
{
  type : ComponentClass,
  render : (c : Component) => VdomNode
}

let def : Def[] = [
  {
    type : Position,
    render : (position : Position) => printVec2(position.pos)
  },
  {
    type : Rotation,
    render : (rotation : Rotation) => printNumber(rotation.angle)
  },
  {
    type : Velocity,
    render : (velocity : Velocity) => printVec2(velocity.vel)
  },
  {
    type : AngularVelocity,
    render : (velocity : AngularVelocity) => printNumber(velocity.vel)
  },
  {
    type : Named,
    render : (named : Named) => named.name
  },
  {
    type : MoveToTarget,
    render : (target : MoveToTarget) => {
      switch (target.order.kind)
      {
        case "MoveTo":
          return "Move to " + printVec2(target.order.target)
        case "Join":
          return "Join " + printEntity(target.order.squadron)
        case "Stop":
          return "Stop";
      }
    }
  },
  {
    type : AttackTarget,
    render : (target : AttackTarget) => "Target : " + (target.target !== null ? printEntity(target.target) : "none") + (target.delegate !== null ? ", delegate : " + printEntity(target.delegate) : "")
  },
  {
    type : Damageable,
    render : (damageable : Damageable) => printNumber(damageable.hitpoints) + " / " + printNumber(damageable.maxHitpoints)
  },
  {
    type : Targetable,
    render : (targetable : Targetable) : VdomNode => null
  },
  {
    type : Controlled,
    render : (controlled : Controlled) => "Player " + controlled.player.id
  },
  {
    type : Armed,
    render : (armed : Armed) => "Damage : " + printNumber(armed.damage) + ", range : " + printNumber(armed.range) + ", speed : " + printNumber(armed.projectileSpeed) + ", cooldown : " + printNumber(armed.cooldownRemaining) + " / " + printNumber(armed.cooldown)
  },
  {
    type : Squadron,
    render : (squadron : Squadron) => "Flagship : " + printEntity(squadron.flagship)
  },
  {
    type : SquadronMember,
    render : (member : SquadronMember) => "Squadron : " + printEntity(member.squadron) + (member.offset !== null ? ", offset : " + printVec2(member.offset) : "")
  },
  {
    type : Projectile,
    render : (projectile : Projectile) => "Target : " + printEntity(projectile.target)
      + ", damage : " + printNumber(projectile.damage)
      + ", speed : " + printNumber(projectile.speed)
      + ", lifetime : " + printNumber(projectile.lifetime)
  },
  {
    type : RenderShape,
    render : (shape : RenderShape) : VdomNode => null
  },
  {
    type : TracerEffect,
    render : (effect : TracerEffect) : VdomNode => null
  },
  {
    type : Selectable,
    render : (selectable : Selectable) => selectable.target !== null ? printEntity(selectable.target) : null
  },
  {
    type : Selected,
    render : (selected : Selected) : VdomNode => null
  }
];

function renderComponent(id : number, item : Def, world : World) : VdomNode
{
  let component = world.getComponent(id, item.type);
  return VdomElement.create("td", { "class" : component ? "present" : "not-present" }, component ? item.render(component) : null);
}

function renderWorld(world : World) : VdomElement
{
  return VdomElement.create("div", {"class" : "debugTable"},
    VdomElement.create("table", {},
      VdomElement.create("thead", {},
        VdomElement.create("tr", {},
          VdomElement.create("th", {}, "Entity"),
          ...def.map(item => VdomElement.create("th", {}, item.type.name))
        )
      ),
      VdomElement.create("tbody", {},
        ...world.getAllEntities().map(id => VdomElement.create("tr", {},
          VdomElement.create("td", {}, printEntity(id)),
          ...def.map(item => renderComponent(id, item, world))
        ))
      )
    )
  );
}

export class DebugWindow implements RenderSystem
{
  constructor(private ui : UiManager)
  {
    this.elem = VdomElement.create("div", {"class" : "window debug"});
    this.$elem = createElement(this.elem) as HTMLElement;
    this.ui.addElement(this.$elem);
  }

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    let elem = VdomElement.create("div", {"class" : "window debug"},
      VdomElement.create("button",
        {
          "class" : "debugSwitch",
          "onClick" : () => this.display = !this.display
        },
        "Toggle debug"),
      this.display ? renderWorld(world) : null
    );

    updateElementChildren(this.$elem, elem, this.elem);
    this.elem = elem;
  }

  private display : boolean = false;
  private $elem : HTMLElement;
  private elem : VdomElement;
};