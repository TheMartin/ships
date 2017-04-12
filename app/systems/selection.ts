import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";

import { Cached } from "../systems/cached";
import { Position } from "../systems/spatial";
import { Controlled, Player } from "../systems/playable";
import { interpolatePosition } from "../systems/cacheSpatial";

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
  constructor(private entities : EntityContainer, private player : Player, private ui : UiManager, private renderer : Renderer, private viewport : Viewport)
  {
    ui.addEventListener("dragstart", (e : Events.MouseDragStart) =>
    {
      if (e.button === MouseButton.Left)
        this.dragStart = this.viewport.inverseTransform(e.pos);
    });

    ui.addEventListener("dragend", (e : Events.MouseDragEnd) =>
    {
      if (e.button === MouseButton.Left)
      {
        this.selection = new Select(new Box(this.viewport.transform(this.dragStart), this.dragCurrent));
        this.dragStart = null;
        this.dragCurrent = null;
      }
    });

    ui.addEventListener("click", (e : Events.MouseClick) =>
    {
      if (e.button === MouseButton.Left)
        this.selection = new Unselect();
    });

    ui.addEventListener("entityclick", (evt : Events.EntityClick) =>
    {
      if (evt.button === MouseButton.Left)
      {
        this.entities.forEachEntity([Selectable.t, Controlled.t], (e : Entity, components : any[]) =>
        {
          let [selectable, controlled] = components as [Selectable, Controlled];
          if (controlled.player !== this.player)
            return;

          let [selected] = e.getOptionalComponents([Selected.t]) as [Selected];

          if (!selected && e === evt.entities[0])
          {
            e.addComponent(Selected.t, new Selected());
          }
          else if (selected && e !== evt.entities[0])
          {
            e.removeComponent(Selected.t);
          }
        });
      }
    });
  }

  update(dt : number, interp : number) : void
  {
    if (this.selection)
    {
      if (isSelect(this.selection))
      {
        this.entities.forEachEntity([Position.t, Selectable.t, Controlled.t], (e : Entity, components : any[]) =>
        {
          let [position, , controlled] = components as [Position, Selectable, Controlled];
          if (controlled.player !== this.player)
            return;

          let [cachedPos, selected] = e.getOptionalComponents([Cached.t + Position.t, Selected.t]) as [Cached<Position>, Selected];
          const within = isWithin(this.viewport.transform(interpolatePosition(position, cachedPos, interp)), (<Select>this.selection).box);
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
      let pos = this.viewport.transform(interpolatePosition(position, e.components[Cached.t + Position.t] as Cached<Position>, interp));
      const size = new Vec2(10, 10).multiply(this.viewport.scale);
      this.renderer.drawRect(pos.clone().subtract(size), pos.clone().add(size), SelectionSystem.selectedBoxProps);
    });

    if (this.dragStart)
    {
      const mousePos = this.ui.mousePosition();
      if (mousePos)
        this.dragCurrent = this.ui.mousePosition().clone();

      if (this.dragCurrent)
        this.renderer.drawRect(this.viewport.transform(this.dragStart), this.dragCurrent, SelectionSystem.selectionBoxProps);
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