import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { Vec2 } from "../vec2/vec2";

export class CachePosition implements System
{
  constructor(private entities : EntityContainer) {}

  update(dt : number) : void
  {
    this.entities.forEachEntity([Position.t, Cached.t + Position.t], (e : Entity, components : any[]) =>
    {
      let [position, cachedPosition] = components as [Position, Cached<Position>];
      cachedPosition.value = new Position(position.pos.clone());
    });
  }
};

export class CacheRotation implements System
{
  constructor(private entities : EntityContainer) {}

  update(dt : number) : void
  {
    this.entities.forEachEntity([Rotation.t, Cached.t + Rotation.t], (e : Entity, components : any[]) =>
    {
      let [rotation, cachedRotation] = components as [Rotation, Cached<Rotation>];
      cachedRotation.value = new Rotation(rotation.angle);
    });
  }
};