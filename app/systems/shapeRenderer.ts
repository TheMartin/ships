import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, Viewport } from "../renderer/renderer";
import { Shape } from "../renderer/shape";
import { Position, Rotation } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { interpolatePosition, interpolateRotation } from "../systems/cacheSpatial";
import { Vec2, lerp } from "../vec2/vec2";

export class RenderShape
{
  constructor(public shape : Shape) {}
  static readonly t : string = "RenderShape";
};

export class ShapeRenderer implements RenderSystem
{
  constructor(private entities : EntityContainer, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number) : void
  {
    this.entities.forEachEntity([RenderShape.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [shape, position] = components as [RenderShape, Position];
      let [rotation, cachedPos, cachedRot] = e.getOptionalComponents([Rotation.t, Cached.t + Position.t, Cached.t + Rotation.t]) as [Rotation, Cached<Position>, Cached<Rotation>];

      this.renderer.drawShape(shape.shape, interpolatePosition(position, cachedPos, interp), rotation ? interpolateRotation(rotation, cachedRot, interp) : 0, 1, this.viewport);
    });
  }
};