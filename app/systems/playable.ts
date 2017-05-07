export enum PlayerType
{
  Local,
  Ai,
  Remote
};

export class Player
{
  constructor(public type : PlayerType, public id : number) {}
};

export class Controlled
{
  constructor(public player : Player) {}

  static readonly t : string = "Controlled";
};