import { Entity, EntityContainer, EntityCollection } from "../ecs/entities";

import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { Cached } from "../systems/cached";
import { MoveToTarget } from "../systems/moveTo";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Clickable } from "../systems/clickable";
import { Selectable, Selected } from "../systems/selection";
import { Controlled } from "../systems/playable";
import { Named } from "../systems/named";
import { Armed } from "../systems/armed";
import { Projectile } from "../systems/projectile";
import { Damageable } from "../systems/damageable";
import { RenderShape } from "../systems/shapeRenderer";
import { TracerEffect } from "../systems/tracerEffect";

import { Static } from "../data/static";

import { Vec2 } from "../vec2/vec2";

export function serialize(entityContainer : EntityContainer) : any
{
  const serializations : { [key : string] : (component : any) => any } = {
    [Position.t] : (pos : Position) => { return { x : pos.pos.x, y : pos.pos.y }; },
    [Rotation.t] : (rot : Rotation) => { return { a : rot.angle }; },
    [Velocity.t] : (vel : Velocity) => { return { x : vel.vel.x, y : vel.vel.y }; },
    [AngularVelocity.t] : (vel : AngularVelocity) => { return { a : vel.vel }; },
    [Cached.t + Position.t] : () => null,
    [Cached.t + Rotation.t] : () => null,
    [MoveToTarget.t] : () => null,
    [AttackTarget.t] : () => null,
    [Targetable.t] : () => null,
    [Clickable.t] : () => null,
    [Selectable.t] : () => null,
    [Selected.t] : () => null,
    [Controlled.t] : () => null,
    [Named.t] : () => null,
    [Armed.t] : () => null,
    [Projectile.t] : () => null,
    [Damageable.t] : (dmg : Damageable) => { return { hp : dmg.hitpoints, max : dmg.maxHitpoints }; },
    [RenderShape.t] : (shape : RenderShape) => { return { shape : shape.shape == Static.Ship ? "Ship" : "NeutralShip" }; },
    [TracerEffect.t] : () => null
  };
  let result : any = {};
  for (let id in entityContainer.entities)
  {
    let entity = entityContainer.entities[id];
    let serializedEntity = {};
    for (let key in entity.components)
    {
      let component = entity.components[key];
      let serializedComponent = serializations[key](component);
      serializedEntity[key] = serializedComponent;
    }
    result[id] = serializedEntity;
  }
  return result;
}

function damaged(max : number, hp : number) : Damageable
{
  let component = new Damageable(max);
  component.hitpoints = hp;
  return component;
}

export function deserialize(data : any, entityContainer : EntityContainer) : void
{
  const deserializations : { [key : string] : (data : any) => any } = {
    [Position.t] : data => new Position(new Vec2(data.x, data.y)),
    [Rotation.t] : data => new Rotation(data.a),
    [Velocity.t] : data => new Velocity(new Vec2(data.x, data.y)),
    [AngularVelocity.t] : data => new AngularVelocity(data.a),
    [Cached.t + Position.t] : () => null,
    [Cached.t + Rotation.t] : () => null,
    [MoveToTarget.t] : () => null,
    [AttackTarget.t] : () => null,
    [Targetable.t] : () => null,
    [Clickable.t] : () => null,
    [Selectable.t] : () => null,
    [Selected.t] : () => null,
    [Controlled.t] : () => null,
    [Named.t] : () => null,
    [Armed.t] : () => null,
    [Projectile.t] : () => null,
    [Damageable.t] : data => { return damaged(data.max, data.hp); },
    [RenderShape.t] : data => new RenderShape(Static[data.shape]),
    [TracerEffect.t] : data => new TracerEffect()
  };

  let result : EntityCollection = {};
  for (let id in data)
  {
    let components = {};
    for (let key in data[id])
    {
      let component = data[id][key];
      let deserializedComponent = deserializations[key](component);

      if (deserializedComponent)
        components[key] = deserializedComponent;
    }
    let e = new Entity(components);
    e.id = parseInt(id);
    result[parseInt(id)] = e;
  }
  entityContainer.entities = result;
}