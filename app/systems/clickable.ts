import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { Position } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { interpolatePosition } from "../systems/cacheSpatial";
import { Vec2 } from "../vec2/vec2";

export class Clickable
{
  pos : Vec2;
  static readonly t : string = "Clickable";
};

export class UpdateClickable implements RenderSystem
{
  constructor(private entities : EntityContainer, private viewport : Viewport) {}

  update(dt : number, interp : number) : void
  {
    this.entities.forEachEntity([Clickable.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [clickable, position] = components as [Clickable, Position];
      let [cachedPos] = e.getOptionalComponents([Cached.t + Position.t]) as [Cached<Position>];

      clickable.pos = this.viewport.transform(interpolatePosition(position, cachedPos, interp));
    });
  }
};