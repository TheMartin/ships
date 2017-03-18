import { Vec2 } from "../vec2/vec2";
import { Shape } from "./shape";

export interface RenderProps
{
  fillColor? : string;
  stroke? : string;
  lineWidth? : number;
};

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

    this.setProps(shape.props);

    this.ctx.beginPath();
    this.ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
    for (let i = 1; i < shape.vertices.length; i++)
    {
      this.ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
    }
    this.ctx.closePath();

    this.render(shape.props);
  }

  drawLine(a : Vec2, b : Vec2, props : RenderProps = {}, lineDash? : number[])
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.setProps(props);
    let oldDash : number[] = [];
    if (lineDash)
    {
      oldDash = this.ctx.getLineDash();
      this.ctx.setLineDash(lineDash);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.lineTo(b.x, b.y);

    this.render(props);

    if (lineDash)
    {
      this.ctx.setLineDash(oldDash);
    }
  }

  drawRect(a : Vec2, b : Vec2, props : RenderProps = {})
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.setProps(props);

    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x);
    const h = Math.abs(b.y - a.y);
    if (props.fillColor)
    {
      this.ctx.fillRect(x, y, w, h);
    }
    if (props.stroke)
    {
      this.ctx.strokeRect(x, y, w, h);
    }
  }

  drawCircle(center : Vec2, radius : number, props : RenderProps = {})
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.setProps(props);

    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.ctx.closePath();

    this.render(props);
  }

  clear()
  {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private setProps(props : RenderProps)
  {
    if (props.fillColor)
    {
      this.ctx.fillStyle = props.fillColor;
    }
    if (props.stroke)
    {
      this.ctx.strokeStyle = props.stroke;
      if (props.lineWidth)
      {
        this.ctx.lineWidth = props.lineWidth;
      }
    }
  }

  private render(props : RenderProps)
  {
    if (props.fillColor)
    {
      this.ctx.fill();
    }
    if (props.stroke)
    {
      this.ctx.stroke();
    }
  }

  private ctx : CanvasRenderingContext2D;
};