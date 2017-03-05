import { Vec2 } from "../vec2/vec2";
import { Shape } from "./shape";

export class Renderer
{
  constructor(private canvas : HTMLCanvasElement)
  {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
  }

  drawShape(shape : Shape, pos : Vec2, rot : number, scale : number)
  {
    const xx = scale * Math.cos(rot);
    const xy = scale * Math.sin(rot);
    this.ctx.setTransform(xx, xy,
      -xy, xx,
      pos.x, pos.y
      );

    this.ctx.fillStyle = shape.fillColor;
    this.ctx.strokeStyle = shape.lineColor;
    this.ctx.lineWidth = shape.lineWidth;

    this.ctx.beginPath();
    this.ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
    for (let i = 1; i < shape.vertices.length; i++)
    {
      this.ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
    }
    this.ctx.closePath();

    this.ctx.fill();
    this.ctx.stroke();
  }

  drawRect(a : Vec2, b : Vec2, color : string, stroke? : string, lineWidth? : number)
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = color;
    if (stroke)
    {
      this.ctx.strokeStyle = stroke;
      if (lineWidth)
      {
        this.ctx.lineWidth = lineWidth;
      }
    }

    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x);
    const h = Math.abs(b.y - a.y);
    this.ctx.fillRect(x, y, w, h);
    if (stroke)
    {
      this.ctx.strokeRect(x, y, w, h);
    }
  }

  clear()
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private ctx : CanvasRenderingContext2D;
};