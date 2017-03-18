import { RenderProps } from "./renderer";
import { Vec2 } from "../vec2/vec2";

export class Shape
{
  constructor(
    public props : RenderProps,
    public vertices : Vec2[]
    )
  {
  }
};