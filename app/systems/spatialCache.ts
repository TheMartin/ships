import { World } from "../ecs/entities";
import { Position, Rotation } from "../systems/spatial";
import { Vec2, lerp } from "../vec2/vec2";

export class SpatialCache
{
  update(world : World, now : number, interval : number) : void
  {
    this.last = now;
    this.interval = interval;
    this.positions.clear();
    this.rotations.clear();
    world.forEachEntity([Position], (id : number, components : any[]) =>
    {
      let [position] = components as [Position];
      this.positions.set(id, new Position(position.pos.clone()));
    });
    world.forEachEntity([Rotation], (id : number, components : any[]) =>
    {
      let [rotation] = components as [Rotation];
      this.rotations.set(id, new Rotation(rotation.angle));
    });
  }

  interpolatePosition(pos : Position, id : number, now : number) : Vec2
  {
    let position = pos.pos;
    let cachedPos = this.positions.get(id);
    if (cachedPos)
      position = Vec2.lerp(cachedPos.pos, position, this.interp(now));

    return position;
  }

  interpolateRotation(rot : Rotation, id : number, now : number) : number
  {
    let angle = rot.angle;
    let cachedRot = this.rotations.get(id);
    if (cachedRot)
      angle = lerp(cachedRot.angle, angle, this.interp(now));

    return angle;
  }

  lastUpdate() : number
  {
    return this.last;
  }

  private interp(now : number) : number
  {
    return this.interval ? (now - this.last) / this.interval : 0;
  }

  private positions : Map<number, Position> = new Map<number, Position>();
  private rotations : Map<number, Rotation> = new Map<number, Rotation>();
  private last : number = performance.now();
  private interval : number = null;
};