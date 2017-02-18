import { Shape } from "../renderer/shape";
import { Vec2 } from "../vec2/vec2";

export class Static
{
  static Box : Shape = new Shape(
    "black", 3,
    "gray",
    [ new Vec2(-10, -10), new Vec2(-10, 10), new Vec2(10, 10), new Vec2(10, -10) ]
  );
};