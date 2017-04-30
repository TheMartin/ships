import { Entity } from "../ecs/entities";

export class Targetable
{
  static readonly t : string = "Targetable";
};

export class AttackTarget
{
  target : number = null;
  setTarget(e : Entity) : boolean
  {
    if (e.components[Targetable.t])
    {
      this.target = e.id;
      return true;
    }

    return false;
  }
  static readonly t : string = "AttackTarget";
};