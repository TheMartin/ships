import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { NetworkComponent } from "../network/networkComponent";
import { Position } from "../systems/spatial";
import { Velocity } from "../systems/kinematic";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2 } from "../vec2/vec2";

export class TracerEffect implements NetworkComponent
{
  equal(other : TracerEffect) : boolean
  {
    return true;
  }

  clone() : TracerEffect
  {
    return new TracerEffect();
  }

  serialize() : any[]
  {
    return [];
  }

  static deserialize(data : any[]) : TracerEffect
  {
    return new TracerEffect();
  }

  static readonly t : string = "TracerEffect";
};

export class RenderTracer implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    world.forEachEntity([Position.t, Velocity.t, TracerEffect.t], (id : number, components : any[]) =>
    {
      let [position, velocity,] = components as [Position, Velocity, TracerEffect];

      const pos = this.spatialCache.interpolatePosition(position, id, interp);
      const end = pos.clone().add(velocity.vel.clone().multiply(1/60));
      this.renderer.drawLine(pos, end, RenderTracer.tracerProps, this.viewport);
    });
  }

  private static readonly tracerProps : RenderProps = { stroke : "rgb(245, 245, 220)", lineWidth : 2.5 };
};