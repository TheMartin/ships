import { Entity, EntityContainer } from "../ecs/entities";
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
  constructor(private entities : EntityContainer, ui : UiManager, private renderer : Renderer)
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

  update(dt : number, interp : number) : void
  {
    if (this.selection)
    {
      if (isSelect(this.selection))
      {
        this.entities.forEachEntity([Position.t, Selectable.t], (e : Entity, components : any[]) =>
        {
          let [position, ] = components as [Position, Selectable];
          let [cachedPos, selected] = e.getOptionalComponents([Cached.t + Position.t, Selected.t]) as [Cached<Position>, Selected];
          let pos = position.pos;
          if (cachedPos && cachedPos.value)
          {
            pos = Vec2.lerp(cachedPos.value.pos, pos, interp);
          }
          const within = isWithin(pos, (<Select>this.selection).box);
          if (!selected && within)
          {
            e.addComponent(Selected.t, new Selected());
          }
          else if (selected && !within)
          {
            e.removeComponent(Selected.t);
          }
        });
      }
      else
      {
        this.entities.forEachEntity([], (e : Entity, components : any[]) =>
        {
          e.removeComponent(Selected.t);
        });
      }

      this.selection = null;
    }

    this.entities.forEachEntity([Selected.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [, position] = <[Selected, Position]>(components);
      let pos = position.pos;
      let cachedPos = e.components[Cached.t + Position.t] as Cached<Position>;
      if (cachedPos && cachedPos.value)
      {
        pos = Vec2.lerp(cachedPos.value.pos, pos, interp);
      }

      const size = new Vec2(10, 10);
      this.renderer.drawRect(pos.clone().subtract(size), pos.clone().add(size), SelectionSystem.selectedBoxProps);
    });

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