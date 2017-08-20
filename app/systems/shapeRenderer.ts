import { World, Entity } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, Viewport } from "../renderer/renderer";
import { Shape } from "../renderer/shape";
import { NetworkComponent } from "../network/networkComponent";
import { Position, Rotation } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2, lerp } from "../vec2/vec2";

import { Static } from "../data/static";

export class RenderShape implements NetworkComponent
{
  constructor(public shape : Shape) {}

  equal(other : RenderShape) : boolean
  {
    return this.shape === other.shape;
  }

  clone() : RenderShape
  {
    return new RenderShape(this.shape);
  }

  serialize() : any[]
  {
    return [ this.shape === Static.Ship ? "Ship" : "NeutralShip" ];
  }

  static deserialize(data : any[]) : RenderShape
  {
    return new RenderShape(Static[data[0] as string]);
  }
};

export class ShapeRenderer implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    world.forEachEntity([RenderShape, Position], (id : Entity, components : any[]) =>
    {
      let [shape, position] = components as [RenderShape, Position];
      let rotation = world.getComponent(id, Rotation) as Rotation;

      this.renderer.drawShape(shape.shape,
        this.spatialCache.interpolatePosition(position, id, now),
        rotation ? this.spatialCache.interpolateRotation(rotation, id, now) : 0,
        1,
        this.viewport
      );
    });
  }
};