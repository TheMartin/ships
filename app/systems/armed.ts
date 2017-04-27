import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Cached } from "../systems/cached";
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
  static readonly t : string = "Armed";
};

export class Shooting implements System
{
  constructor(private entities : EntityContainer) {}

  update(dt : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Position.t, AttackTarget.t, Armed.t], (e : Entity, components : any[]) =>
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

      if (!this.entities.containsEntity(target.target))
      {
        target.target = null;
        return;
      }

      let targetPos = target.target.components[Position.t] as Position;
      let toTarget = targetPos.pos.clone().subtract(position.pos);
      if (norm(toTarget) > armed.range)
        return;

      let [targetVel] = target.target.getOptionalComponents([Velocity.t]) as [Velocity];

      armed.cooldownRemaining = Math.max(armed.cooldown - delta, 0);
      deferred.push(() =>
      {
        let intercept = interceptVector(targetPos.pos, targetVel ? targetVel.vel : Vec2.zero, position.pos, armed.projectileSpeed);
        let initialVelocity = intercept ? intercept : toTarget.normalized().multiply(armed.projectileSpeed);

        let projectile = new Entity(
        {
          [Position.t] : new Position(position.pos.clone()),
          [Cached.t + Position.t] : new Cached<Position>(),
          [Rotation.t] : new Rotation(initialVelocity.angle()),
          [Cached.t + Rotation.t] : new Cached<Rotation>(),
          [Velocity.t] : new Velocity(initialVelocity),
          [TracerEffect.t] : new TracerEffect(),
          [Projectile.t] : new Projectile(target.target, armed.range, armed.projectileSpeed, armed.damage)
        });

        this.entities.addEntity(projectile);
      });
    });
  }
};