import { Entity } from "../ecs/entities";

export class Targetable
{
  static readonly t : string = "Targetable";
};

export class AttackTarget
{
  target : Entity = null;
  setTarget(e : Entity) : boolean
  {
    if (e.components[Targetable.t])
    {
      this.target = e;
      return true;
    }

    return false;
  }
  static readonly t : string = "AttackTarget";
};