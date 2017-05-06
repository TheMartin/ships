import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { Position } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2 } from "../vec2/vec2";

export class Clickable
{
  constructor(public radius : number) {}
  pos : Vec2;
  static readonly t : string = "Clickable";
};

export class UpdateClickable implements RenderSystem
{
  constructor(private entities : EntityContainer, private spatialCache : SpatialCache, private viewport : Viewport) {}

  update(dt : number, interp : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Clickable.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [clickable, position] = components as [Clickable, Position];
      clickable.pos = this.viewport.transform(this.spatialCache.interpolatePosition(position, e, interp));
    });
  }
};