import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Cached } from "../systems/cached";

export class SineMovement implements System
{
  constructor(private xMin : number, private xMax : number, private y0 : number)
  {
  }

  update(dt : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let position = e.components[Position.t] as Position;
      if (!position)
        continue;

      let pos = position.pos;
      pos.x += this.xSpeed * dt;
      pos.y = this.y0 + this.amplitude * (0.5 * Math.cos(2 * Math.PI * (pos.x - this.xMin) / this.wavelength) + 0.5);
      while (pos.x > this.xMax)
      {
        pos.x -= (this.xMax - this.xMin);
      }

      let rotation = e.components[Rotation.t] as Rotation;
      if (rotation)
      {
        rotation.angle += this.rotationSpeed * dt;
      }
    }
  }

  private xSpeed : number = 50;
  private ySpeed : number = 50;
  private wavelength : number = 250;
  private amplitude : number = 100;
  private rotationSpeed : number = Math.PI;
};