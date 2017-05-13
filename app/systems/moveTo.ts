import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { NetworkComponent } from "../network/networkComponent";
import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { Vec2, dot, norm, norm2 } from "../vec2/vec2";
import { angleDiff } from "../util/angle";
import { clamp } from "../util/clamp";

export class MoveToTarget implements NetworkComponent
{
  equal(other : MoveToTarget) : boolean
  {
    return (this.target !== null && other.target !== null && this.target.equal(other.target)) || (this.target === null && other.target === null);
  }

  clone() : MoveToTarget
  {
    return MoveToTarget.Make(this.target);
  }

  serialize() : any[]
  {
    return this.target ? [ this.target.x, this.target.y ] : [ null ];
  }

  static deserialize(data : any[]) : MoveToTarget
  {
    return MoveToTarget.Make( data[0] !== null
      ? new Vec2(data[0] as number, data[1] as number)
      : null
    );
  }

  private static Make(target : Vec2) : MoveToTarget
  {
    let tgt = new MoveToTarget();
    tgt.target = target;
    return tgt;
  }

  target : Vec2 = null;
  static readonly t : string = "MoveToTarget";
};

export class MoveTo implements System
{
  constructor(private speed : number, private angularSpeed : number) {}

  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([Position.t, Rotation.t, Velocity.t, AngularVelocity.t, MoveToTarget.t], (id : number, components : any[]) =>
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