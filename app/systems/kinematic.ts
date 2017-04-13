import { Vec2 } from "../vec2/vec2";

export class Velocity
{
  constructor(public vel : Vec2) { }
  static readonly t : string = "Velocity";
};

export class AngularVelocity
{
  constructor(public vel : number) { }
  static readonly t : string = "AngularVelocity";
};