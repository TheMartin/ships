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
    return this.target === other.target && this.delegate === other.delegate;
  }

  clone() : AttackTarget
  {
    return AttackTarget.Make(this.target, this.delegate);
  }

  serialize() : any[]
  {
    return [ this.target, this.delegate ];
  }

  static deserialize(data : any[]) : AttackTarget
  {
    return AttackTarget.Make(data[0] as number, data[1] as number);
  }

  private static Make(target : number, delegate : number) : AttackTarget
  {
    let tgt = new AttackTarget();
    tgt.target = target;
    tgt.delegate = delegate;
    return tgt;
  }

  target : number = null;
  delegate : number = null;
  static readonly t : string = "AttackTarget";
};