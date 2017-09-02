import { World, Entity } from "../ecs/entities";
import { Component } from "../ecs/component";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";
import { UserEvent, UserInputQueue } from "../ui/userInputQueue";

import { NetworkComponent } from "../network/networkComponent";
import { Position } from "../systems/spatial";
import { Squadron, SquadronMember } from "../systems/squadron";
import { Controlled, Player } from "../systems/playable";
import { SpatialCache } from "../systems/spatialCache";

import { RenderProps } from "../renderer/renderer";

import { Vec2, lerp } from "../vec2/vec2";

export class Selectable implements NetworkComponent
{
  constructor(public target : Entity) {}

  equal(other : Selectable) : boolean
  {
    return this.target === other.target;
  }

  clone() : Selectable
  {
    return new Selectable(this.target);
  }

  serialize() : any[]
  {
    return [ this.target ];
  }

  static deserialize(data : any[]) : Selectable
  {
    return new Selectable(data[0] as Entity);
  }
};

export class Selected implements Component
{
  clone() : Selected { return new Selected(); }
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

export class SelectionChange implements UserEvent
{
  constructor(public entities : Entity[]) {}
};

export class SelectionSystem implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private spatialCache : SpatialCache, player : Player, private ui : UiManager, private renderer : Renderer, private viewport : Viewport)
  {
    inputQueue.setHandler(SelectionChange, (evt : SelectionChange, now : number, world : World) =>
    {
      world.forEachEntity([Selected], (id : Entity, components : Component[]) =>
      {
        world.removeComponent(id, Selected);
      });

      for (let entity of evt.entities)
      {
        let components = world.getComponents(entity, [Selectable, Controlled]);
        if (!components)
          return;

        let [selectable, controlled] = components as [Selectable, Controlled];
        if (controlled.player.id === player.id)
        {
          world.addComponent(selectable.target, new Selected());
        }
      }
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
        this.box = new Box(this.viewport.transform(this.dragStart), this.dragCurrent);
        this.dragStart = null;
        this.dragCurrent = null;
      }
    });

    ui.addEventListener("click", (e : Events.MouseClick) =>
    {
      if (e.button === MouseButton.Left)
        inputQueue.enqueue(new SelectionChange([]));
    });

    ui.addEventListener("entityclick", (e : Events.EntityClick) =>
    {
      if (e.button === MouseButton.Left)
        inputQueue.enqueue(new SelectionChange([e.entities[0]]));
    });
  }

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    if (this.dragStart)
    {
      const mousePos = this.ui.mousePosition();
      if (mousePos)
        this.dragCurrent = this.ui.mousePosition().clone();

      if (this.dragCurrent)
        this.renderer.drawRect(this.viewport.transform(this.dragStart), this.dragCurrent, SelectionSystem.props);
    }

    if (this.box)
    {
      let entities = world.findEntities([Position, Selectable, Controlled], (id : Entity, components : Component[]) =>
      {
        let [position, ,] = components as [Position, Selectable, Controlled];
        return isWithin(this.viewport.transform(this.spatialCache.interpolatePosition(position, id, now)), this.box);
      });
      inputQueue.enqueue(new SelectionChange(entities));
      this.box = null;
    }
  }

  private dragStart : Vec2;
  private dragCurrent : Vec2;
  private box : Box = null;
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

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    let selected = world.findEntities([Selected]);
    let selectedSquadrons = selected.filter(id => world.getComponent(id, Squadron) !== null);
    let selectBoxes = selected.filter(id => world.getComponent(id, Squadron) === null);
    let selectedShips = world.findEntities([SquadronMember], (id : Entity, components : any[]) =>
    {
      let [squadronMember] = components as [SquadronMember];
      return selectedSquadrons.find(id => id === squadronMember.squadron) !== undefined;
    });
    let boxPositions = selectBoxes.concat(selectedShips)
      .map((id) : [number, Position] => [id, world.getComponent(id, Position) as Position])
      .filter(([id, position]) => position !== null)
      .map(([id, position]) => this.spatialCache.interpolatePosition(position, id, now));

    const size = new Vec2(10, 10).multiply(this.viewport.scale);
    for (let box of boxPositions)
    {
      const pos = this.viewport.transform(box);
      this.renderer.drawRect(pos.clone().subtract(size), pos.clone().add(size), DrawSelectedBox.props);
    }
  }

  private static readonly props : RenderProps = { stroke : "rgb(0, 255, 0)", lineWidth: 3 };
};