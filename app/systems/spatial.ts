import { Vec2 } from "../vec2/vec2";

export class Position
{
  constructor(public pos : Vec2) {}
  static readonly t : string = "Position";
};

export class Rotation
{
  constructor(public angle : number) {}
  static readonly t : string = "Rotation";
};