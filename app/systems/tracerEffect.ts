import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { Position } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { Velocity } from "../systems/kinematic";
import { interpolatePosition } from "../systems/cacheSpatial";
import { Vec2 } from "../vec2/vec2";

export class TracerEffect
{
  static readonly t : string = "TracerEffect";
};

export class RenderTracer implements RenderSystem
{
  constructor(private entities : EntityContainer, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Position.t, Velocity.t, TracerEffect.t], (e : Entity, components : any[]) =>
    {
      let [position, velocity,] = components as [Position, Velocity, TracerEffect];
      let [cachedPos] = e.getOptionalComponents([Cached.t + Position.t]) as [Cached<Position>];

      const pos = interpolatePosition(position, cachedPos, interp);
      const end = pos.clone().add(velocity.vel.clone().multiply(1/60));
      this.renderer.drawLine(pos, end, RenderTracer.tracerProps, this.viewport);
    });
  }

  private static readonly tracerProps : RenderProps = { stroke : "rgb(245, 245, 220)", lineWidth : 2.5 };
};