import { World } from "../ecs/entities";
import { Position, Rotation } from "../systems/spatial";
import { Vec2, lerp } from "../vec2/vec2";

export class SpatialCache
{
  update(world : World) : void
  {
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

  interpolatePosition(pos : Position, id : number, interp : number) : Vec2
  {
    let position = pos.pos;
    let cachedPos = this.positions.get(id);
    if (cachedPos)
      position = Vec2.lerp(cachedPos.pos, position, interp);

    return position;
  }

  interpolateRotation(rot : Rotation, id : number, interp : number) : number
  {
    let angle = rot.angle;
    let cachedRot = this.rotations.get(id);
    if (cachedRot)
      angle = lerp(cachedRot.angle, angle, interp);

    return angle;
  }

  private positions : Map<number, Position> = new Map<number, Position>();
  private rotations : Map<number, Rotation> = new Map<number, Rotation>();
};