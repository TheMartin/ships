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

class NetworkFn
{
  private static table : { [key : string] : {
    equal : (lhs : any, rhs : any) => boolean;
    clone : (component : any) => any;
    serialize : (component : any) => any[];
    deserialize : (data : any[]) => any;
  } } = {
    [Position.t] : {
      equal : (lhs : Position, rhs : Position) => lhs.pos.equal(rhs.pos),
      clone : (pos : Position) => new Position(pos.pos.clone()),
      serialize : (pos : Position) => [ pos.pos.x, pos.pos.y ],
      deserialize : data => new Position(new Vec2(data[0], data[1]))
    },

    [Rotation.t] : {
      equal : (lhs : Rotation, rhs : Rotation) => lhs.angle === rhs. angle,
      clone : (rot : Rotation) => new Rotation(rot.angle),
      serialize : (rot : Rotation) => [ rot.angle ],
      deserialize : data => new Rotation(data[0])
    },

    [Velocity.t] : {
      equal : (lhs : Velocity, rhs : Velocity) => lhs.vel.equal(rhs.vel),
      clone : (vel : Velocity) => new Velocity(vel.vel.clone()),
      serialize : (vel : Velocity) => [ vel.vel.x, vel.vel.y ],
      deserialize : data => new Velocity(new Vec2(data[0], data[1]))
    },

    [AngularVelocity.t] : {
      equal : (lhs : AngularVelocity, rhs : AngularVelocity) => lhs.vel === rhs.vel,
      clone : (vel : AngularVelocity) => new AngularVelocity(vel.vel),
      serialize : (vel : AngularVelocity) => [ vel.vel ],
      deserialize : data => new AngularVelocity(data[0])
    },

    [Damageable.t] : {
      equal : (lhs : Damageable, rhs : Damageable) => lhs.hitpoints === rhs.hitpoints && lhs.maxHitpoints === rhs.maxHitpoints,
      clone : (dmg : Damageable) => damaged(dmg.maxHitpoints, dmg.hitpoints),
      serialize : (dmg : Damageable) => [ dmg.maxHitpoints, dmg.hitpoints ],
      deserialize : data => { return damaged(data[0], data[1]); }
    },

    [RenderShape.t] : {
      equal : (lhs : RenderShape, rhs : RenderShape) => lhs.shape === rhs.shape,
      clone : (shp : RenderShape) => new RenderShape(shp.shape),
      serialize : (shape : RenderShape) => [ shape.shape == Static.Ship ? "Ship" : "NeutralShip" ],
      deserialize : data => new RenderShape(Static[data[0]])
    },

    [TracerEffect.t] : {
      equal : (lhs : TracerEffect, rhs : TracerEffect) => true,
      clone : () => new TracerEffect(),
      serialize : () => null,
      deserialize : data => new TracerEffect()
    }
  };

  static isNetworkedComponent(key : string) : boolean
  {
    return key in NetworkFn.table;
  }

  static equal(key : string, lhs : any, rhs : any) : boolean
  {
    return NetworkFn.isNetworkedComponent(key) ? NetworkFn.table[key].equal(lhs, rhs) : true;
  }

  static clone(key : string, component : any) : any
  {
    return NetworkFn.isNetworkedComponent(key) ? NetworkFn.table[key].clone(component) : null;
  }

  static serialize(key : string, component : any) : any[]
  {
    return NetworkFn.isNetworkedComponent(key) ? NetworkFn.table[key].serialize(component) : null;
  }

  static deserialize(key : string, data : any[]) : any
  {
    return NetworkFn.isNetworkedComponent(key) ? NetworkFn.table[key].deserialize(data) : null;
  }
};

export function serialize(entities : EntityCollection) : any
{
  let result : any = {};
  for (let id in entities)
  {
    let entity = entities[id];
    if (entity.components === null)
    {
      result[id] = null;
    }
    else
    {
      let serializedEntity = {};
      for (let key in entity.components)
      {
        let component = entity.components[key];
        let serializedComponent = NetworkFn.serialize(key, component);
        serializedEntity[key] = serializedComponent;
      }
      result[id] = serializedEntity;
    }
  }
  return result;
}

function damaged(max : number, hp : number) : Damageable
{
  let component = new Damageable(max);
  component.hitpoints = hp;
  return component;
}

export function deserialize(data : any) : EntityCollection
{
  let result : EntityCollection = {};
  for (let id in data)
  {
    if (data[id] === null)
    {
      let e = new Entity(parseInt(id), null);
      result[e.id] = e;
    }
    else
    {
      let components = {};
      for (let key in data[id])
      {
        let component = data[id][key];
        let deserializedComponent = NetworkFn.deserialize(key, component);

        if (deserializedComponent)
          components[key] = deserializedComponent;
      }
      let e = new Entity(parseInt(id), components);
      result[e.id] = e;
    }
  }
  return result;
}

export function clone(collection : EntityCollection) : EntityCollection
{
  let result : EntityCollection = {};
  for (let id in collection)
  {
    let entity = collection[id];
    let components = {};
    for (let key in entity.components)
    {
      if (NetworkFn.isNetworkedComponent(key))
        components[key] = NetworkFn.clone(key, entity.components[key]);
    }
    result[id] = new Entity(parseInt(id), components);
  }
  return result;
}

export function delta(oldCollection : EntityCollection, newCollection : EntityCollection) : EntityCollection
{
  let result : EntityCollection = {};
  for (let id in oldCollection)
  {
    let oldEntity = oldCollection[id];
    let newEntity = newCollection[id];
    if (!newEntity)
    {
      result[id] = new Entity(parseInt(id), null);
    }
    else
    {
      let components = {};
      for (let key in oldEntity.components)
      {
        if (!NetworkFn.isNetworkedComponent(key))
          continue;

        if (key in newEntity.components)
        {
          if (!NetworkFn.equal(key, oldEntity.components[key], newEntity.components[key]))
            components[key] = NetworkFn.clone(key, newEntity.components[key]);
        }
        else
        {
          components[key] = null;
        }
      }
      result[id] = new Entity(parseInt(id), components);
    }
  }
  for (let id in newCollection)
  {
    if (!(id in oldCollection))
    {
      let entity = newCollection[id];
      let components = {};
      for (let key in entity.components)
      {
        if (NetworkFn.isNetworkedComponent(key))
          components[key] = NetworkFn.clone(key, entity.components[key]);
      }
      result[id] = new Entity(parseInt(id), components);
    }
  }
  return result;
}

export function applyDelta(oldCollection : EntityCollection, delta : EntityCollection) : void
{
  for (let id in delta)
  {
    let entityDelta = delta[id];
    let entity = oldCollection[id];
    if (entity)
    {
      if (entityDelta.components === null)
      {
        delete oldCollection[id];
      }
      else
      {
        for (let key in entityDelta.components)
        {
          if (entityDelta.components[key] === null)
          {
            delete entity.components[key];
          }
          else
          {
            entity.components[key] = entityDelta.components[key];
          }
        }
      }
    }
    else if (entityDelta.components)
    {
      oldCollection[id] = entityDelta;
    }
  }
}