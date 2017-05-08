import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";
import { UserEvent, UserInputQueue } from "../ui/userInputQueue";

import { Position } from "../systems/spatial";
import { Controlled, Player } from "../systems/playable";
import { SpatialCache } from "../systems/spatialCache";

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

export class SelectSingle implements UserEvent
{
  constructor(public entity : number) {}
  name : string = "SelectSingle";
};

export class SelectBox implements UserEvent
{
  constructor(public box : Box) {}
  name : string = "SelectBox";
};

export class Unselect implements UserEvent
{
  name : string = "Unselect";
};

export class SelectionSystem implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private spatialCache : SpatialCache, player : Player, private ui : UiManager, private renderer : Renderer, private viewport : Viewport)
  {
    inputQueue.setHandler("SelectSingle", (evt : SelectSingle, interp : number, entities : EntityContainer) =>
    {
      entities.forEachEntity([Selectable.t, Controlled.t], (e : Entity, components : any[]) =>
      {
        let [selectable, controlled] = components as [Selectable, Controlled];
        if (controlled.player.id !== player.id)
          return;

        let [selected] = e.getOptionalComponents([Selected.t]) as [Selected];

        if (!selected && e.id === evt.entity)
        {
          e.addComponent(Selected.t, new Selected());
        }
        else if (selected && e.id !== evt.entity)
        {
          e.removeComponent(Selected.t);
        }
      });
    });

    inputQueue.setHandler("Unselect", (evt : Unselect, interp : number, entities : EntityContainer) =>
    {
      entities.forEachEntity([], (e : Entity, components : any[]) =>
      {
        e.removeComponent(Selected.t);
      });
    });

    inputQueue.setHandler("SelectBox", (evt : SelectBox, interp : number, entities : EntityContainer) =>
    {
      entities.forEachEntity([Position.t, Selectable.t, Controlled.t], (e : Entity, components : any[]) =>
      {
        let [position, , controlled] = components as [Position, Selectable, Controlled];
        if (controlled.player.id !== player.id)
          return;

        let [selected] = e.getOptionalComponents([Selected.t]) as [Selected];
        const within = isWithin(this.viewport.transform(this.spatialCache.interpolatePosition(position, e, interp)), evt.box);
        if (!selected && within)
        {
          e.addComponent(Selected.t, new Selected());
        }
        else if (selected && !within)
        {
          e.removeComponent(Selected.t);
        }
      });
    });

    ui.addEventListener("dragstart", (e : Events.MouseDragStart) =>
    {
      if (e.button === MouseButton.Left)
        this.dragStart = this.viewport.inverseTransform(e.pos);
    });

    ui.addEventListener("dragend", (e : Events.MouseDragEnd) =>
    {
      if (e.button === MouseButton.Left)
      {
        inputQueue.enqueue(new SelectBox(new Box(this.viewport.transform(this.dragStart), this.dragCurrent)));
        this.dragStart = null;
        this.dragCurrent = null;
      }
    });

    ui.addEventListener("click", (e : Events.MouseClick) =>
    {
      if (e.button === MouseButton.Left)
        inputQueue.enqueue(new Unselect());
    });

    ui.addEventListener("entityclick", (e : Events.EntityClick) =>
    {
      if (e.button === MouseButton.Left)
        inputQueue.enqueue(new SelectSingle(e.entities[0].id));
    });
  }

  update(dt : number, interp : number, entities : EntityContainer, deferred : Deferred) : void
  {
    if (this.dragStart)
    {
      const mousePos = this.ui.mousePosition();
      if (mousePos)
        this.dragCurrent = this.ui.mousePosition().clone();

      if (this.dragCurrent)
        this.renderer.drawRect(this.viewport.transform(this.dragStart), this.dragCurrent, SelectionSystem.props);
    }
  }

  private dragStart : Vec2;
  private dragCurrent : Vec2;
  private static readonly props : RenderProps =
    {
      stroke : "rgb(0, 255, 0)",
      lineWidth : 1,
      fillColor : "rgba(0, 255, 0, 0.2)"
    };
};

export class DrawSelectedBox implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, entities : EntityContainer, deferred : Deferred) : void
  {
    entities.forEachEntity([Selected.t, Position.t], (e : Entity, components : any[]) =>
    {
      let [, position] = <[Selected, Position]>(components);
      let pos = this.viewport.transform(this.spatialCache.interpolatePosition(position, e, interp));
      const size = new Vec2(10, 10).multiply(this.viewport.scale);
      this.renderer.drawRect(pos.clone().subtract(size), pos.clone().add(size), DrawSelectedBox.props);
    });
  }

  private static readonly props : RenderProps = { stroke : "rgb(0, 255, 0)", lineWidth: 3 };
};