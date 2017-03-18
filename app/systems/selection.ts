import { EntityCollection } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer } from "../renderer/renderer";
import { UiManager } from "../ui/uiManager";

import { Cached } from "../systems/cached";
import { Position } from "../systems/spatial";

import { RenderProps } from "../renderer/renderer";

import { Vec2, lerp } from "../vec2/vec2";

export class Selectable
{
  static readonly t : string = "Selectable";
};

export class Selected
{
  static readonly t : string = "Selected";
};

class Box
{
  constructor(a : Vec2, b : Vec2)
  {
    this.min = new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    this.max = new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }

  min : Vec2;
  max : Vec2;
};

function isWithin(v : Vec2, box : Box) : boolean
{
  return v.x >= box.min.x
    && v.x <= box.max.x
    && v.y >= box.min.y
    && v.y <= box.max.y;
};

class Select
{
  constructor(public box : Box) {}
};

class Unselect {};

type Selection = Select | Unselect;

function isSelect(selection : Selection): selection is Select
{
  return (<Select>selection).box !== undefined;
};

export class SelectionSystem implements RenderSystem
{
  constructor(ui : UiManager, private renderer : Renderer)
  {
    ui.addEventListener("mousedown", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if (mouseEvent.button == 0)
      {
        this.dragStart = new Vec2(mouseEvent.clientX, mouseEvent.clientY);        
      }
    });

    ui.addEventListener("mousemove", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if ((mouseEvent.buttons & 1) != 0)
      {
        this.dragCurrent = new Vec2(mouseEvent.clientX, mouseEvent.clientY);        
      }
    });

    ui.addEventListener("mouseup", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if (mouseEvent.button == 0)
      {
        if (this.dragCurrent)
        {
          this.selection = new Select(new Box(this.dragStart, this.dragCurrent));
        }
        else
        {
          this.selection = new Unselect();
        }

        this.dragStart = null;
        this.dragCurrent = null;
      }
    });
  }

  update(dt : number, interp : number, entities : EntityCollection) : void
  {
    if (this.selection)
    {
      if (isSelect(this.selection))
      {
        for (let id in entities)
        {
          let e = entities[id];
          let position = e.components[Position.t] as Position;
          let selectable = e.components[Selectable.t] as Selectable;
          if (!position || !selectable)
            continue;

          let pos = position.pos;
          let cachedPos = e.components[Cached.t + Position.t] as Cached<Position>;
          if (cachedPos && cachedPos.value)
          {
            pos = Vec2.lerp(cachedPos.value.pos, pos, interp);
          }
          let selected = e.components[Selected.t] as Selected;
          const within = isWithin(pos, this.selection.box);
          if (!selected && within)
          {
            e.addComponent(Selected.t, new Selected());
          }
          else if (selected && !within)
          {
            e.removeComponent(Selected.t);
          }
        }        
      }
      else
      {
        for (let id in entities)
        {
          let e = entities[id];
          e.removeComponent(Selected.t);
        }
      }

      this.selection = null;
    }

    for (let id in entities)
    {
      let e = entities[id];
      let selected = e.components[Selected.t] as Selected;
      if (!selected)
        continue;

      let position = e.components[Position.t] as Position;
      if (!position)
        continue;

      let pos = position.pos;
      let cachedPos = e.components[Cached.t + Position.t] as Cached<Position>;
      if (cachedPos && cachedPos.value)
      {
        pos = Vec2.lerp(cachedPos.value.pos, pos, interp);
      }

      const size = new Vec2(10, 10);
      this.renderer.drawRect(pos.clone().subtract(size), pos.clone().add(size), SelectionSystem.selectedBoxProps);
    }

    if (this.dragStart && this.dragCurrent)
    {
      this.renderer.drawRect(this.dragStart, this.dragCurrent, SelectionSystem.selectionBoxProps);
    }
  }

  private dragStart : Vec2;
  private dragCurrent : Vec2;
  private selection : Select | Unselect;
  private static readonly selectedBoxProps : RenderProps = { stroke : "rgb(0, 255, 0)" };
  private static readonly selectionBoxProps : RenderProps =
    {
      stroke : "rgb(0, 255, 0)",
      lineWidth : 1,
      fillColor : "rgba(0, 255, 0, 0.2)"
    };
};