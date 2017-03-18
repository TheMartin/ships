import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { MoveToTarget } from "../systems/moveTo";
import { Vec2 } from "../vec2/vec2";

export class ChooseRandomTarget implements System
{
  constructor(private min : Vec2, max : Vec2)
  {
    this.size = max.clone().subtract(min);
  }

  update(dt : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let target = e.components[MoveToTarget.t] as MoveToTarget;
      if (!target)
        continue;

      if (!target.target)
      {
        target.target = this.min.clone().add(new Vec2(Math.random(), Math.random()).elementMultiply(this.size));
      }
    }
  }

  private size : Vec2;
};