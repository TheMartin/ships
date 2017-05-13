import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";
import { UserEvent, UserInputQueue } from "../ui/userInputQueue";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";
import { Controlled, Player } from "../systems/playable";

import { Vec2 } from "../vec2/vec2";

export class MoveOrder implements UserEvent
{
  constructor(public entity : number, public target : Vec2) {}
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

      let moveTarget = world.getComponent(evt.entity, MoveToTarget.t) as MoveToTarget;
      if (moveTarget)
        moveTarget.target = evt.target;
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
      world.forEachEntity([Selected.t, MoveToTarget.t, Controlled.t], (id : number, components : any[]) =>
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