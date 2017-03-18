import { EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer } from "../renderer/renderer";
import { Shape } from "../renderer/shape";
import { Position, Rotation } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { Vec2, lerp } from "../vec2/vec2";

export class RenderShape
{
  constructor(public shape : Shape) {}
  static readonly t : string = "RenderShape";
};

export class ShapeRenderer implements RenderSystem
{
  constructor(private entities : EntityContainer, private renderer : Renderer) {}

  update(dt : number, interp : number) : void
  {
    for (let id in this.entities.entities)
    {
      let e = this.entities.entities[id];
      let shape = e.components[RenderShape.t] as RenderShape;
      let position = e.components[Position.t] as Position;
      if (!shape || !position)
        continue;

      let pos = position.pos;
      let cachedPos = e.components[Cached.t + Position.t] as Cached<Position>;
      if (cachedPos && cachedPos.value)
        pos = Vec2.lerp(cachedPos.value.pos, pos, interp);

      let angle = 0;
      let rotation = e.components[Rotation.t] as Rotation;
      if (rotation)
        angle = rotation.angle;

      let cachedRot = e.components[Cached.t + Rotation.t] as Cached<Rotation>;
      if (cachedRot && cachedRot.value)
        angle = lerp(cachedRot.value.angle, angle, interp);

      this.renderer.drawShape(shape.shape, pos, angle, 1);
    }
  }
};