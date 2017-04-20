import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { Vec2 } from "../vec2/vec2";

export class MoveKinematic implements System
{
  constructor(private entities : EntityContainer) {}

  update(dt : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Position.t, Velocity.t], (e : Entity, components : any[]) =>
    {
      let [position, velocity] = components as [Position, Velocity];
      position.pos.add(velocity.vel.clone().multiply(dt));
    });

    this.entities.forEachEntity([Rotation.t, AngularVelocity.t], (e : Entity, components : any[]) =>
    {
      let [rotation, velocity] = components as [Rotation, AngularVelocity];
      rotation.angle += velocity.vel * dt;
    });
  }
};