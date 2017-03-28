import { Entity, EntityContainer } from "../ecs/entities";
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
    this.entities.forEachEntity([RenderShape.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [shape, position] = components as [RenderShape, Position];
      let [rotation, cachedPos, cachedRot] = e.getOptionalComponents([Rotation.t, Cached.t + Position.t, Cached.t + Rotation.t]) as [Rotation, Cached<Position>, Cached<Rotation>];
      let pos = position.pos;
      if (cachedPos && cachedPos.value)
        pos = Vec2.lerp(cachedPos.value.pos, pos, interp);

      let angle = 0;
      if (rotation)
        angle = rotation.angle;

      if (cachedRot && cachedRot.value)
        angle = lerp(cachedRot.value.angle, angle, interp);

      this.renderer.drawShape(shape.shape, pos, angle, 1);
    });
  }
};