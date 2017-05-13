import { NetworkComponent } from "../network/networkComponent";

export class Targetable implements NetworkComponent
{
  equal(other : Targetable) : boolean
  {
    return true;
  }

  clone() : Targetable
  {
    return new Targetable();
  }

  serialize() : any[]
  {
    return [];
  }

  static deserialize(data : any[]) : Targetable
  {
    return new Targetable();
  }

  static readonly t : string = "Targetable";
};

export class AttackTarget implements NetworkComponent
{
  equal(other : AttackTarget) : boolean
  {
    return this.target === other.target;
  }

  clone() : AttackTarget
  {
    return AttackTarget.Make(this.target);
  }

  serialize() : any[]
  {
    return [ this.target ];
  }

  static deserialize(data : any[]) : AttackTarget
  {
    return AttackTarget.Make(data[0] as number);
  }

  private static Make(target : number) : AttackTarget
  {
    let tgt = new AttackTarget();
    tgt.target = target;
    return tgt;
  }

  target : number = null;
  static readonly t : string = "AttackTarget";
};