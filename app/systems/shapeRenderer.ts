import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer } from "../renderer/renderer";
import { Shape } from "../renderer/shape";
import { Position } from "../systems/position";
import { Cached } from "../systems/cached";
import { Vec2, lerp } from "../vec2/vec2";

export class RenderShape
{
  constructor(public shape : Shape) {}
  static readonly t : string = "RenderShape";
};

export class ShapeRenderer implements RenderSystem
{
  constructor(private renderer : Renderer) {}

  update(dt : number, interp : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let shape = e.components[RenderShape.t] as RenderShape;
      let position = e.components[Position.t] as Position;
      if (!shape || !position)
        continue;

      let cachedPos = e.components[Cached.t + Position.t] as Cached<Position>;
      if (cachedPos && cachedPos.value)
      {
        this.renderer.drawShape(shape.shape, lerp(cachedPos.value.pos, position.pos, interp), 0, 2);
      }
      else
      {
        this.renderer.drawShape(shape.shape, position.pos, 0, 2);
      }
    }
  }
};