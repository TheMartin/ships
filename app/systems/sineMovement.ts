import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position } from "../systems/position";
import { Cached } from "../systems/cached";

export class SineMovement implements System
{
  update(dt : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let position = e.components[Position.t] as Position;
      if (!position)
        continue;

      let pos = position.pos;
      pos.x += 50 * dt;
      pos.y = 50 + 50 * Math.cos((pos.x - 50) / 50);
      while (pos.x > 550)
      {
        pos.x -= 500;
      }
    }
  }
};