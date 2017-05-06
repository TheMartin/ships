import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";

export class SineMovement implements System
{
  constructor(private entities : EntityContainer, private xMin : number, private xMax : number, private y0 : number)
  {
  }

  update(dt : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Position.t], (e : Entity, components : any[]) =>
    {
      let [position] = components as [Position];
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
    });
  }

  private xSpeed : number = 50;
  private ySpeed : number = 50;
  private wavelength : number = 250;
  private amplitude : number = 100;
  private rotationSpeed : number = Math.PI;
};