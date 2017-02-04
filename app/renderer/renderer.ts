import { Vec2 } from "../vec2/vec2";

export class Renderer
{
  constructor(private canvas : HTMLCanvasElement)
  {
    this.ctx = this.canvas.getContext("2d");
  }

  drawBox(pos : Vec2, size : Vec2)
  {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(pos.x, pos.y, size.x, size.y);
  }

  clear()
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private ctx : CanvasRenderingContext2D;
};