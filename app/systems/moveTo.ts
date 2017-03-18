import { EntityContainer } from "../ecs/entities";
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
    for (let id in this.entities.entities)
    {
      let e = this.entities.entities[id];
      let position = e.components[Position.t] as Position;
      let rotation = e.components[Rotation.t] as Rotation;
      let target = e.components[MoveToTarget.t] as MoveToTarget;
      if (!position || !rotation || !target || !target.target)
        continue;

      const toTarget = target.target.clone().subtract(position.pos);
      if (norm2(toTarget) > 5)
      {
        rotation.angle = toTarget.angle();
        position.pos.add(toTarget.normalized().multiply( Math.min(norm(toTarget), this.speed * dt) ));
      }
      else
      {
        target.target = null;
      }
    }
  }
};