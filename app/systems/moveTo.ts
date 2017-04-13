import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { Vec2, dot, norm, norm2 } from "../vec2/vec2";
import { angleDiff } from "../util/angle";
import { clamp } from "../util/clamp";

export class MoveToTarget
{
  target : Vec2;
  static readonly t : string = "MoveToTarget";
};

export class MoveTo implements System
{
  constructor(private entities : EntityContainer, private speed : number, private angularSpeed : number, private acceleration : number) {}

  update(dt : number) : void
  {
    this.entities.forEachEntity([Position.t, Rotation.t, Velocity.t, AngularVelocity.t, MoveToTarget.t], (e : Entity, components : any[]) =>
    {
      let [position, rotation, velocity, angularVelocity, target] = components as [Position, Rotation, Velocity, AngularVelocity, MoveToTarget];
      const speed = norm(velocity.vel);

      if (!target.target)
      {
        if (speed > 0)
        {
          velocity.vel.subtract(velocity.vel.normalized().multiply( Math.min(speed, this.acceleration * dt)) );
        }
        angularVelocity.vel = 0;
        return;
      }

      const toTarget = target.target.clone().subtract(position.pos);
      const distanceToTarget = norm(toTarget);
      if (distanceToTarget > 0.25)
      {
        const toTargetAngle = angleDiff(rotation.angle, toTarget.angle());
        const safeSpeed = Math.sqrt(2 * distanceToTarget * this.acceleration);
        const maxSpeed = Math.max(0, this.speed * Math.cos( toTargetAngle ));
        const targetSpeed = Math.min(safeSpeed, maxSpeed);
        const dV = this.acceleration * dt;

        velocity.vel = Vec2.fromAngle(rotation.angle).multiply(clamp(targetSpeed, speed - dV, speed + dV));
        angularVelocity.vel = Math.sign(toTargetAngle) * this.angularSpeed;
      }
      else
      {
        target.target = null;
      }
    });
  }
};