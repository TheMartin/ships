import { Shape } from "../renderer/shape";
import { Vec2 } from "../vec2/vec2";

export class Static
{
  static Box : Shape = new Shape(
    "black", 5,
    "gray",
    [ new Vec2(-35, -35), new Vec2(-25, 25), new Vec2(25, 25), new Vec2(25, -25) ]
  );

  static Ship : Shape = new Shape(
    "hsla(207, 100%, 60%, 1)", 3,
    "hsla(207, 100%, 30%, 0.8)",
    [ new Vec2(0, -15), new Vec2(-12, 15), new Vec2(0, 10.5), new Vec2(12, 15) ]
  );
};