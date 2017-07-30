import { NetworkComponent } from "../network/networkComponent";

export class Named implements NetworkComponent
{
  constructor(public name : string) {}

  equal(other : Named) : boolean
  {
    return this.name === other.name;
  }

  clone() : Named
  {
    return new Named(this.name);
  }

  serialize() : any[]
  {
    return [ this.name ];
  }

  static deserialize(data : any[]) : Named
  {
    return new Named(data[0] as string);
  }
};