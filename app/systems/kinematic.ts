import { NetworkComponent } from "../network/networkComponent";
import { Vec2 } from "../vec2/vec2";

export class Velocity implements NetworkComponent
{
  constructor(public vel : Vec2) { }

  equal(other : Velocity) : boolean
  {
    return this.vel.equal(other.vel);
  }

  clone() : Velocity
  {
    return new Velocity(this.vel.clone());
  }

  serialize() : any[]
  {
    return [ this.vel.x, this.vel.y ];
  }

  static deserialize(data : any[]) : Velocity
  {
    return new Velocity(new Vec2(data[0] as number, data[1] as number));
  }
};

export class AngularVelocity implements NetworkComponent
{
  constructor(public vel : number) { }

  equal(other : AngularVelocity) : boolean
  {
    return this.vel === other.vel;
  }

  clone() : AngularVelocity
  {
    return new AngularVelocity(this.vel);
  }

  serialize() : any[]
  {
    return [ this.vel ];
  }

  static deserialize(data : any[]) : AngularVelocity
  {
    return new AngularVelocity(data[0] as number);
  }
};