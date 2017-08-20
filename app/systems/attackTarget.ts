import { Entity } from "../ecs/entities";
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
    return AttackTarget.Make(data[0] as Entity, data[1] as Entity);
  }

  private static Make(target : Entity, delegate : Entity) : AttackTarget
  {
    let tgt = new AttackTarget();
    tgt.target = target;
    tgt.delegate = delegate;
    return tgt;
  }

  target : Entity = null;
  delegate : Entity = null;
};