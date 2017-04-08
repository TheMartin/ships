export enum PlayerType
{
  Local,
  Ai,
  Remote
};

export class Player
{
  constructor(public type : PlayerType) {}
};

export class Controlled
{
  constructor(public player : Player) {}

  static readonly t : string = "Controlled";
};