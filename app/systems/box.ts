import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer } from "../renderer/renderer";
import { Shape } from "../renderer/shape";
import { Vec2, lerp } from "../vec2/vec2";

export class Box
{
  constructor(public pos : Vec2, public size : Vec2) {}
  static readonly t : string = "Box";
};

export class InterpolatedBox
{
  prev : Box;
  static readonly t : string = "InterpolatedBox";
};

export class BoxRenderer implements RenderSystem
{
  constructor(private renderer : Renderer) {}

  static box : Shape = new Shape(
    "black", 3,
    "gray",
    [ new Vec2(-10, -10), new Vec2(-10, 10), new Vec2(10, 10), new Vec2(10, -10) ]
    );

  update(dt : number, interp : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let box = e.components[Box.t] as Box;
      if (!box)
        continue;

      let interpBox = e.components[InterpolatedBox.t] as InterpolatedBox;
      if (interpBox && interpBox.prev)
      {
        this.renderer.drawShape(BoxRenderer.box, lerp(interpBox.prev.pos, box.pos, interp), 0, 2);
      }
      else
      {
        this.renderer.drawShape(BoxRenderer.box, box.pos, 0, 1);
      }
    }
  }
};

export class BoxUpdater implements System
{
  update(dt : number, entities : EntityCollection) : void
  {
    for (let id in entities)
    {
      let e = entities[id];
      let box = e.components[Box.t] as Box;
      if (!box)
        continue;

      let oldBox = new Box(box.pos, box.size);
      box.pos.x += 50 * dt;
      box.pos.y = 50 + 50 * Math.cos((box.pos.x - 50) / 50);
      while (box.pos.x > 550)
      {
        box.pos.x -= 500;
      }

      let interpBox = e.components[InterpolatedBox.t] as InterpolatedBox;
      if (interpBox)
      {
        interpBox.prev = oldBox;
      }
    }
  }
};