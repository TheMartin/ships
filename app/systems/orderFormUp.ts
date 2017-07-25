import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { NetworkUserEvent } from "../network/networkUserEvent";
import { MoveToTarget, Join } from "../systems/moveTo";
import { AttackTarget } from "../systems/attackTarget";
import { Selected, Selectable } from "../systems/selection";
import { Named } from "../systems/named";
import { Squadron, SquadronMember } from "../systems/squadron";
import { Controlled, Player } from "../systems/playable";

import { Vec2 } from "../vec2/vec2";

export class FormUpOrder implements NetworkUserEvent
{
  constructor(public entities : number[]) {}

  serialize() : any[]
  {
    return [ ...this.entities ];
  }

  static deserialize(data : any[]) : FormUpOrder
  {
    return new FormUpOrder(data as number[]);
  }

  name : string = FormUpOrder.t;
  static readonly t : string = "FormUpOrder";
};

function createSquadron(flagship : number, world : World) : number
{
  let controlled = world.getComponent(flagship, Controlled.t) as Controlled;

  const squadronId = World.nextEntityId();
  world.addEntity(squadronId, {
    [Squadron.t] : new Squadron(flagship),
    [Named.t] : new Named("Squadron"),
    [MoveToTarget.t] : new MoveToTarget(),
    [AttackTarget.t] : new AttackTarget(),
    [Controlled.t] : new Controlled(controlled.player)
  });
  world.removeComponent(flagship, MoveToTarget.t);
  if (world.getComponent(flagship, Selected.t))
  {
    world.removeComponent(flagship, Selected.t);
    world.addComponent(squadronId, Selected.t, new Selected());
  }
  (world.getComponent(flagship, Selectable.t) as Selectable).target = squadronId;
  world.addComponent(flagship, SquadronMember.t, new SquadronMember(squadronId, null));
  (world.getComponent(flagship, AttackTarget.t) as AttackTarget).delegate = squadronId;
  return squadronId;
}

export class OrderFormUp implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager, viewport : Viewport)
  {
    inputQueue.setHandler(FormUpOrder.t, (evt : FormUpOrder, interp : number, world : World) =>
    {
      let entities = evt.entities.filter(e =>
      {
        let [controlled, moveToTarget] = world.getComponents(e, [Controlled.t, MoveToTarget.t]) as [Controlled, MoveToTarget];
        let squadronMember = world.getComponent(e, SquadronMember.t) as SquadronMember;
        return !squadronMember && moveToTarget && controlled && controlled.player.id === this.player.id;
      });

      if (entities.length > 0)
      {
        let squadron = createSquadron(entities[0], world);
        for (let i = 1; i < entities.length; ++i)
        {
          let target = world.getComponent(entities[i], MoveToTarget.t) as MoveToTarget;
          target.order = new Join(squadron);
        }
      }
    });

    ui.addEventListener("keydown", (event : Events.KeyEvent) =>
    {
      if (event.key === "g")
      {
        this.orderGiven = true;
      }
    });
  }

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    if (this.orderGiven)
    {
      let entities = world.findEntities([Selected.t, MoveToTarget.t, Controlled.t], (id : number, components : any[]) =>
      {
        let [, , controlled] = components as [Selected, MoveToTarget, Controlled];
        return !world.getComponent(id, Squadron.t) && controlled.player.id === this.player.id;
      });

      inputQueue.enqueue(new FormUpOrder(entities));
    }
    this.orderGiven = false;
  }

  private orderGiven : boolean = false;
};