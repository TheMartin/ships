import { World, Entity } from "../ecs/entities";
import { Component } from "../ecs/component";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { NetworkComponent } from "../network/networkComponent";

export class Damageable implements NetworkComponent
{
  constructor(public maxHitpoints : number)
  {
    this.hitpoints = maxHitpoints;
  }

  equal(other : Damageable) : boolean
  {
    return this.hitpoints === other.hitpoints && this.maxHitpoints === other.maxHitpoints;
  }

  clone() : Damageable
  {
    return Damageable.Make(this.maxHitpoints, this.hitpoints);
  }

  serialize() : any[]
  {
    return [ this.maxHitpoints, this.hitpoints ];
  }

  static deserialize(data : any[]) : Damageable
  {
    return Damageable.Make(data[0], data[1]);
  }

  private static Make(maxHitpoints : number, hitpoints : number)
  {
    let dmg = new Damageable(maxHitpoints);
    dmg.hitpoints = hitpoints;
    return dmg;
  }

  hitpoints : number;
};

export class CheckDestroyed implements System
{
  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([Damageable], (id : Entity, components : Component[]) =>
    {
      let [damageable] = components as [Damageable];
      if (damageable.hitpoints < 0)
      {
        deferred.push(() => { world.removeEntity(id); });
      }
    });
  }
};