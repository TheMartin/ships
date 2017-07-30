import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager, Events } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { NetworkUserEvent } from "../network/networkUserEvent";
import { MoveToTarget } from "../systems/moveTo";
import { AttackTarget } from "../systems/attackTarget";
import { Selected, Selectable } from "../systems/selection";
import { Squadron, SquadronMember } from "../systems/squadron";
import { Controlled, Player } from "../systems/playable";

import { Vec2 } from "../vec2/vec2";

export class SplitOrder implements NetworkUserEvent
{
  constructor(public squadron : number) {}

  serialize() : any[]
  {
    return [ this.squadron ];
  }

  static deserialize(data : any[]) : SplitOrder
  {
    return new SplitOrder(data[0] as number);
  }

  name : string = SplitOrder.t;
  static readonly t : string = "SplitOrder";
};

export class OrderSplit implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager)
  {
    inputQueue.setHandler(SplitOrder.t, (evt : SplitOrder, interp : number, world : World) =>
    {
      const squadron = evt.squadron;
      let entities = world.findEntities([SquadronMember], (id : number, components : any[]) =>
      {
        let [squadronMember] = components as [SquadronMember];
        return squadronMember.squadron == squadron;
      });

      for (let squadronMember of entities)
      {
        world.addComponent(squadronMember, new MoveToTarget());
        if (world.getComponent(squadron, Selected))
        {
          world.addComponent(squadronMember, new Selected());
        }
        (world.getComponent(squadronMember, Selectable) as Selectable).target = squadronMember;
        (world.getComponent(squadronMember, AttackTarget) as AttackTarget).delegate = null;
        world.removeComponent(squadronMember, SquadronMember);
      }

      world.removeEntity(squadron);
    });

    ui.addEventListener("keydown", (event : Events.KeyEvent) =>
    {
      if (event.key === "s")
      {
        this.orderGiven = true;
      }
    });
  }

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    if (this.orderGiven)
    {
      let selectedSquadrons = world.findEntities([Selected, Squadron, Controlled], (id : number, components : any[]) =>
      {
        let [, , controlled] = components as [Selected, Squadron, Controlled];
        return controlled.player.id === this.player.id;
      });

      for (let squadron of selectedSquadrons)
      {
        inputQueue.enqueue(new SplitOrder(squadron));
      }
    }
    this.orderGiven = false;
  }

  private orderGiven : boolean = false;
};