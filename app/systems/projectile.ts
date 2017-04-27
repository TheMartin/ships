import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Velocity } from "../systems/kinematic";
import { Targetable, AttackTarget } from "../systems/attackTarget";
import { Damageable } from "../systems/damageable";
import { Vec2, distance } from "../vec2/vec2";
import { angleDiff } from "../util/angle";
import { interceptVector } from "../util/intercept";

export class Projectile
{
  constructor(target : Entity, range : number, public speed : number, public damage : number)
  {
    if (target.components[Targetable.t])
      this.target = target;

    this.lifetime = range / speed;
  }
  public target : Entity = null;
  public lifetime : number = 0;
  static readonly t : string = "Projectile";
};

export class MoveProjectiles implements System
{
  constructor(private entities : EntityContainer) {}

  update(dt : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Position.t, Rotation.t, Velocity.t, Projectile.t], (e : Entity, components : any[]) =>
    {
      let [position, rotation, velocity, projectile] = components as [Position, Rotation, Velocity, Projectile];
      if (projectile.lifetime < 0)
      {
        deferred.push(() => { this.entities.removeEntity(e); });
        return;
      }

      projectile.lifetime -= dt;

      if (!this.entities.containsEntity(projectile.target))
      {
        projectile.target = null;
        return;
      }

      let [targetPos, targetVel] = projectile.target.getComponents([Position.t, Velocity.t]) as [Position, Velocity];
      let [damageable] = projectile.target.getOptionalComponents([Damageable.t]) as [Damageable];
      if (distance(targetPos.pos, position.pos) < 5)
      {
        if (damageable)
          damageable.hitpoints -= projectile.damage;

        deferred.push(() => { this.entities.removeEntity(e); });
        return;
      }

      const intercept = interceptVector(targetPos.pos, targetVel.vel, position.pos, projectile.speed);
      if (intercept)
      {
        velocity.vel = intercept;
        rotation.angle = intercept.angle();
      }
    });
  }
};