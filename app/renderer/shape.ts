import { Vec2 } from "../vec2/vec2";

export class Shape
{
  constructor(
    public lineColor : string,
    public lineWidth : number,
    public fillColor : string,
    public vertices : Vec2[]
    )
  {
  }
};