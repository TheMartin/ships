import { EntityCollection } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer } from "../renderer/renderer";
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
        this.renderer.drawBox( lerp(interpBox.prev.pos, box.pos, interp), lerp(interpBox.prev.size, box.size, interp) );
      }
      else
      {
        this.renderer.drawBox(box.pos, box.size);
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