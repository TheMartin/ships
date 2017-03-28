import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { MoveToTarget } from "../systems/moveTo";
import { Vec2 } from "../vec2/vec2";

export class ChooseRandomTarget implements System
{
  constructor(private entities : EntityContainer, private min : Vec2, max : Vec2)
  {
    this.size = max.clone().subtract(min);
  }

  update(dt : number) : void
  {
    this.entities.forEachEntity([MoveToTarget.t], (e : Entity, components : any[]) =>
    {
      let [target] = components as [MoveToTarget];
      if (!target.target)
        target.target = this.min.clone().add(new Vec2(Math.random(), Math.random()).elementMultiply(this.size));
    });
  }

  private size : Vec2;
};