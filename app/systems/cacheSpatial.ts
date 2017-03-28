import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { Vec2, lerp } from "../vec2/vec2";

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

export function interpolatePosition(pos : Position, cachedPos : Cached<Position>, interp : number) : Vec2
{
  let position = pos.pos;
  if (cachedPos && cachedPos.value)
    position = Vec2.lerp(cachedPos.value.pos, position, interp);

  return position;
}

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

export function interpolateRotation(rot : Rotation, cachedRot : Cached<Rotation>, interp : number) : number
{
  let angle = rot.angle;
  if (cachedRot && cachedRot.value)
    angle = lerp(cachedRot.value.angle, angle, interp);

  return angle;
}