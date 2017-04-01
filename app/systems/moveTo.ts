import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Vec2, norm, norm2 } from "../vec2/vec2";

export class MoveToTarget
{
  target : Vec2;
  static readonly t : string = "MoveToTarget";
};

export class MoveTo implements System
{
  constructor(private entities : EntityContainer, private speed : number) {}

  update(dt : number) : void
  {
    this.entities.forEachEntity([Position.t, Rotation.t, MoveToTarget.t], (e : Entity, components : any[]) =>
    {
      let [position, rotation, target] = components as [Position, Rotation, MoveToTarget];
      if (!target.target)
        return;

      const toTarget = target.target.clone().subtract(position.pos);
      if (norm2(toTarget) > 0.5)
      {
        rotation.angle = toTarget.angle();
        position.pos.add(toTarget.normalized().multiply( Math.min(norm(toTarget), this.speed * dt) ));
      }
      else
      {
        target.target = null;
      }
    });
  }
};