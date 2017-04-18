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
  constructor(private entities : EntityContainer, private speed : number, private angularSpeed : number) {}

  update(dt : number) : void
  {
    this.entities.forEachEntity([Position.t, Rotation.t, Velocity.t, AngularVelocity.t, MoveToTarget.t], (e : Entity, components : any[]) =>
    {
      let [position, rotation, velocity, angularVelocity, target] = components as [Position, Rotation, Velocity, AngularVelocity, MoveToTarget];
      if (target.target)
      {
        const toTarget = target.target.clone().subtract(position.pos);
        if (norm(toTarget) > 0.25)
        {
          velocity.vel = toTarget.normalized().multiply(this.speed);
          angularVelocity.vel = Math.sign(angleDiff(rotation.angle, toTarget.angle())) * this.angularSpeed;
        }
        else
        {
          target.target = null;
        }
      }
      else
      {
        velocity.vel = Vec2.zero.clone();
        angularVelocity.vel = 0;
      }
    });
  }
};