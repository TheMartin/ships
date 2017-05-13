import { NetworkComponent } from "../network/networkComponent";

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

export class Controlled implements NetworkComponent
{
  constructor(public player : Player) {}

  equal(other : Controlled) : boolean
  {
    return this.player.id === other.player.id;
  }

  clone() : Controlled
  {
    return new Controlled(this.player);
  }

  serialize() : any[]
  {
    return [ this.player.type, this.player.id ];
  }

  static deserialize(data : any[]) : Controlled
  {
    return new Controlled(new Player(data[0] as PlayerType, data[1] as number));
  }

  static readonly t : string = "Controlled";
};