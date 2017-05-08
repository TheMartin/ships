import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, Viewport } from "../renderer/renderer";
import { Shape } from "../renderer/shape";
import { Position, Rotation } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2, lerp } from "../vec2/vec2";

export class RenderShape
{
  constructor(public shape : Shape) {}
  static readonly t : string = "RenderShape";
};

export class ShapeRenderer implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, entities : EntityContainer, deferred : Deferred) : void
  {
    entities.forEachEntity([RenderShape.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [shape, position] = components as [RenderShape, Position];
      let [rotation] = e.getOptionalComponents([Rotation.t]) as [Rotation];

      this.renderer.drawShape(shape.shape,
        this.spatialCache.interpolatePosition(position, e, interp),
        rotation ? this.spatialCache.interpolateRotation(rotation, e, interp) : 0,
        1,
        this.viewport
      );
    });
  }
};