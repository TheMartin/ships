import { Entity, EntityContainer } from "../ecs/entities";
import { Position, Rotation } from "../systems/spatial";
import { Vec2, lerp } from "../vec2/vec2";

export class SpatialCache
{
  update(entities : EntityContainer) : void
  {
    this.positions = {};
    this.rotations = {};
    entities.forEachEntity([Position.t], (e : Entity, components : any[]) =>
    {
      let [position] = components as [Position];
      this.positions[e.id] = new Position(position.pos.clone());
    });
    entities.forEachEntity([Rotation.t], (e : Entity, components : any[]) =>
    {
      let [rotation] = components as [Rotation];
      this.rotations[e.id] = new Rotation(rotation.angle);
    });
  }

  interpolatePosition(pos : Position, e : Entity, interp : number) : Vec2
  {
    let position = pos.pos;
    if (e.id in this.positions)
      position = Vec2.lerp(this.positions[e.id].pos, position, interp);

    return position;
  }

  interpolateRotation(rot : Rotation, e : Entity, interp : number) : number
  {
    let angle = rot.angle;
    if (e.id in this.rotations)
      angle = lerp(this.rotations[e.id].angle, angle, interp);

    return angle;
  }

  private positions : { [id : number] : Position } = {};
  private rotations : { [id : number] : Rotation } = {};
};