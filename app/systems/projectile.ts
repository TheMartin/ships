import { World } from "../ecs/entities";
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
  constructor(public target : number, range : number, public speed : number, public damage : number)
  {
    this.lifetime = range / speed;
  }
  public lifetime : number = 0;
  static readonly t : string = "Projectile";
};

export class MoveProjectiles implements System
{
  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([Position.t, Rotation.t, Velocity.t, Projectile.t], (id : number, components : any[]) =>
    {
      let [position, rotation, velocity, projectile] = components as [Position, Rotation, Velocity, Projectile];
      if (projectile.lifetime < 0)
      {
        deferred.push((world : World) => { world.removeEntity(id); });
        return;
      }

      projectile.lifetime -= dt;

      if (!world.containsEntity(projectile.target))
      {
        projectile.target = null;
        return;
      }

      let [targetPos, targetVel] = world.getComponents(projectile.target, [Position.t, Velocity.t]) as [Position, Velocity];
      let [damageable] = world.getOptionalComponents(projectile.target, [Damageable.t]) as [Damageable];
      if (distance(targetPos.pos, position.pos) < 5)
      {
        if (damageable)
          damageable.hitpoints -= projectile.damage;

        deferred.push((world : World) => { world.removeEntity(id); });
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