import { NetworkComponent } from "../network/networkComponent";
import { Vec2 } from "../vec2/vec2";

export class Position implements NetworkComponent
{
  constructor(public pos : Vec2) {}

  equal(other : Position) : boolean
  {
    return this.pos.equal(other.pos);
  }

  clone() : Position
  {
    return new Position(this.pos.clone());
  }

  serialize() : any[]
  {
    return [ this.pos.x, this.pos.y ];
  }

  static deserialize(data : any[]) : Position
  {
    return new Position(new Vec2(data[0] as number, data[1] as number));
  }
};

export class Rotation implements NetworkComponent
{
  constructor(public angle : number) {}

  equal(other : Rotation) : boolean
  {
    return this.angle === other.angle;
  }

  clone() : Rotation
  {
    return new Rotation(this.angle);
  }

  serialize() : any[]
  {
    return [ this.angle ];
  }

  static deserialize(data : any[]) : Rotation
  {
    return new Rotation(data[0] as number);
  }
};