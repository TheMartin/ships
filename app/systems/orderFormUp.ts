import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager, Events } from "../ui/uiManager";
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
  let controlled = world.getComponent(flagship, Controlled) as Controlled;

  const squadronId = World.nextEntityId();
  world.addEntity(squadronId, [
    new Squadron(flagship),
    new Named("Squadron " + squadronId),
    new MoveToTarget(),
    new AttackTarget(),
    new Controlled(controlled.player)
  ]);
  world.removeComponent(flagship, MoveToTarget);
  if (world.getComponent(flagship, Selected))
  {
    world.removeComponent(flagship, Selected);
    world.addComponent(squadronId, new Selected());
  }
  (world.getComponent(flagship, Selectable) as Selectable).target = squadronId;
  world.addComponent(flagship, new SquadronMember(squadronId, null));
  (world.getComponent(flagship, AttackTarget) as AttackTarget).delegate = squadronId;
  return squadronId;
}

export class OrderFormUp implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager)
  {
    inputQueue.setHandler(FormUpOrder.t, (evt : FormUpOrder, interp : number, world : World) =>
    {
      let entities = evt.entities.filter(e =>
      {
        let moveToTarget = world.getComponent(e, MoveToTarget) as MoveToTarget;
        let squadronMember = world.getComponent(e, SquadronMember) as SquadronMember;
        return !squadronMember && moveToTarget;
      });

      if (entities.length > 0)
      {
        let squadron = createSquadron(entities[0], world);
        for (let i = 1; i < entities.length; ++i)
        {
          let target = world.getComponent(entities[i], MoveToTarget) as MoveToTarget;
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
      let entities = world.findEntities([Selected, MoveToTarget, Controlled], (id : number, components : any[]) =>
      {
        let [, , controlled] = components as [Selected, MoveToTarget, Controlled];
        return !world.getComponent(id, Squadron) && controlled.player.id === this.player.id;
      });

      inputQueue.enqueue(new FormUpOrder(entities));
    }
    this.orderGiven = false;
  }

  private orderGiven : boolean = false;
};