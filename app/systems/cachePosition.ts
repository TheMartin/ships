import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position } from "../systems/position";
import { Cached } from "../systems/cached";
import { Vec2 } from "../vec2/vec2";

export class CachePosition implements System
{
  update(dt : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let position = e.components[Position.t] as Position;
      let cachedPosition = e.components[Cached.t + Position.t] as Cached<Position>;
      if (!position || !cachedPosition)
        continue;

      cachedPosition.value = new Position(position.pos.clone())
    }
  }
};