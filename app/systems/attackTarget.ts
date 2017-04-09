export class Targetable
{
  static readonly t : string = "Targetable";
};

export class AttackTarget
{
  target : Targetable = null;
  static readonly t : string = "AttackTarget";
};