import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { NetworkUserEvent } from "../network/networkUserEvent";
import { MoveToTarget, MoveTo } from "../systems/moveTo";
import { Selected, Selectable } from "../systems/selection";
import { Controlled, Player } from "../systems/playable";

import { Vec2 } from "../vec2/vec2";

export class MoveOrder implements NetworkUserEvent
{
  constructor(public entity : number, public target : Vec2) {}

  serialize() : any[]
  {
    return [ this.entity, this.target.x, this.target.y ];
  }

  static deserialize(data : any[]) : MoveOrder
  {
    return new MoveOrder(data[0], new Vec2(data[1], data[2]));
  }

  name : string = MoveOrder.t;
  static readonly t : string = "MoveOrder";
};

export class OrderMove implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager, viewport : Viewport)
  {
    inputQueue.setHandler(MoveOrder.t, (evt : MoveOrder, interp : number, world : World) =>
    {
      if (!world.containsEntity(evt.entity))
        return;

      let moveTarget = world.getComponent(evt.entity, MoveToTarget) as MoveToTarget;
      if (moveTarget)
        moveTarget.order = new MoveTo(evt.target);
    });

    ui.addEventListener("click", (event : Events.MouseClick) =>
    {
      if (event.button === MouseButton.Right)
      {
        this.orderQueue.push(viewport.inverseTransform(event.pos));
      }
    });
  }

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    for (let order of this.orderQueue)
    {
      world.forEachEntity([Selected, MoveToTarget, Controlled], (id : number, components : any[]) =>
      {
        let [, , controlled] = components as [Selected, MoveToTarget, Controlled];
        if (controlled.player.id === this.player.id)
          inputQueue.enqueue(new MoveOrder(id, order));
      });
    }
    this.orderQueue = [];
  }

  private orderQueue : Vec2[] = [];
};