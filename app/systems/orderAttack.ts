import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager, MouseButton, Events } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { NetworkUserEvent } from "../network/networkUserEvent";
import { Targetable, AttackTarget } from "../systems/attackTarget";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Controlled, Player } from "../systems/playable";

import { Vec2, distance } from "../vec2/vec2";

export class AttackOrder implements NetworkUserEvent
{
  constructor(public entity : number, public target : number) { }

  serialize() : any[]
  {
    return [ this.entity, this.target ];
  }

  static deserialize(data : any[]) : AttackOrder
  {
    return new AttackOrder(data[0], data[1]);
  }

  name : string = AttackOrder.t;
  static readonly t : string = "AttackOrder";
};

export class OrderAttack implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager, viewport : Viewport)
  {
    inputQueue.setHandler(AttackOrder.t, (evt : AttackOrder, interp : number, world : World) =>
    {
      if (!world.containsEntity(evt.entity) || !world.containsEntity(evt.target))
        return;

      let attackTarget = world.getComponent(evt.entity, AttackTarget.t) as AttackTarget;
      if (attackTarget)
        attackTarget.target = evt.target;
    });

    ui.addEventListener("entityclick", (event : Events.EntityClick) =>
    {
      if (event.button === MouseButton.Right)
        this.orderQueue.push(event.entities);
    });
  }

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    for (let order of this.orderQueue)
    {
      for (let entity of order)
      {
        if (!world.containsEntity(entity))
          continue;

        let components = world.getComponents(entity, [Controlled.t, Targetable.t]) as [Controlled, Targetable];
        if (!components)
          continue;

        let [controlled, ] = components;
        if (controlled.player.id !== this.player.id)
        {
          world.forEachEntity([Selected.t, AttackTarget.t, Controlled.t], (id : number, components : any[]) =>
          {
            let [, , controlled] = components as [Selected, AttackTarget, Controlled];
            if (controlled.player.id === this.player.id)
              inputQueue.enqueue(new AttackOrder(id, entity));
          });
          break;
        }
      }
    }
    this.orderQueue = [];
  }

  private orderQueue : number[][] = [];
};