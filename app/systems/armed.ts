import { World, Entity } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Velocity } from "../systems/kinematic";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { TracerEffect } from "../systems/tracerEffect";
import { Projectile } from "../systems/projectile";
import { Vec2, norm } from "../vec2/vec2";
import { interceptVector } from "../util/intercept";

export class Armed
{
  constructor(public cooldown : number, public range : number, public projectileSpeed : number, public damage : number) {}
  public cooldownRemaining : number = 0;
};

export class Shooting implements System
{
  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([Position, AttackTarget, Armed], (id : Entity, components : any[]) =>
    {
      let [position, target, armed] = components as [Position, AttackTarget, Armed];
      armed.cooldownRemaining = armed.cooldownRemaining - dt;
      let delta = 0;
      if (armed.cooldownRemaining < 0)
      {
        delta = -armed.cooldownRemaining;
        armed.cooldownRemaining = 0;
      }
      else if (armed.cooldownRemaining > 0)
        return;

      while (!world.containsEntity(target.target) && world.containsEntity(target.delegate))
      {
        target.target = null;
        target = world.getComponent(target.delegate, AttackTarget) as AttackTarget;
      }

      if (!world.containsEntity(target.target))
      {
        target.target = null;
        return;
      }

      let targetId = target.target;
      let targetPos = world.getComponent(targetId, Position) as Position;
      let toTarget = targetPos.pos.clone().subtract(position.pos);
      if (norm(toTarget) > armed.range)
        return;

      let targetVel = world.getComponent(targetId, Velocity) as Velocity;

      armed.cooldownRemaining = Math.max(armed.cooldown - delta, 0);
      deferred.push((world : World, entityCreator : () => Entity) =>
      {
        let intercept = interceptVector(targetPos.pos, targetVel ? targetVel.vel : Vec2.zero, position.pos, armed.projectileSpeed);
        let initialVelocity = intercept ? intercept : toTarget.normalized().multiply(armed.projectileSpeed);

        let projectile = [
          new Position(position.pos.clone()),
          new Rotation(initialVelocity.angle()),
          new Velocity(initialVelocity),
          new TracerEffect(),
          new Projectile(targetId, armed.range, armed.projectileSpeed, armed.damage)
        ];

        world.addEntity(entityCreator(), projectile);
      });
    });
  }
};