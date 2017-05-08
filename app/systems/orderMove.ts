import { Entity, EntityContainer } from "../ecs/entities";
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
  constructor(public target : Vec2) {}
  name : string = "MoveOrder";
};

export class OrderMove implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, player : Player, ui : UiManager, viewport : Viewport)
  {
    inputQueue.setHandler("MoveOrder", (evt : MoveOrder, interp : number, entities : EntityContainer) =>
    {
      entities.forEachEntity([Selected.t, MoveToTarget.t, Controlled.t], (e : Entity, components : any[]) =>
      {
        let [, target, controlled] = components as [Selected, MoveToTarget, Controlled];
        if (controlled.player.id === player.id)
          target.target = evt.target;
      });
    });

    ui.addEventListener("click", (event : Events.MouseClick) =>
    {
      if (event.button === MouseButton.Right)
        inputQueue.enqueue(new MoveOrder(viewport.inverseTransform(event.pos)));
    });
  }

  update(dt : number, interp : number, entities : EntityContainer, deferred : Deferred) : void
  {
  }

};