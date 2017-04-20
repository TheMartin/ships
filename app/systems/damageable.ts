import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";

export class Damageable
{
  constructor(public maxHitpoints : number)
  {
    this.hitpoints = maxHitpoints;
  }
  hitpoints : number;
  static readonly t : string = "Damageable";
};

export class CheckDestroyed implements System
{
  constructor(private entities : EntityContainer) {}

  update(dt : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Damageable.t], (e : Entity, components : any[]) =>
    {
      let [damageable] = components as [Damageable];
      if (damageable.hitpoints < 0)
      {
        deferred.push(() => { this.entities.removeEntity(e); });
      }
    });
  }
};