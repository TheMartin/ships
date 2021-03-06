import { World, Entity, getClientId, getEntityId } from "../ecs/entities";
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
  constructor(public entities : Entity[]) {}

  serialize() : any[]
  {
    return [ ...this.entities ];
  }

  static deserialize(data : any[]) : FormUpOrder
  {
    return new FormUpOrder(data as Entity[]);
  }
};

function createSquadron(flagship : Entity, world : World, squadronId : Entity) : void
{
  let controlled = world.getComponent(flagship, Controlled) as Controlled;

  world.addEntity(squadronId, [
    new Squadron(flagship),
    new Named("Squadron " + getClientId(squadronId) + "-" + getEntityId(squadronId)),
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
}

export class OrderFormUp implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager)
  {
    inputQueue.setHandler(FormUpOrder, (evt : FormUpOrder, now : number, world : World, entityCreator : () => Entity) =>
    {
      let squadronId = entityCreator();

      let entities = evt.entities.filter(e =>
      {
        let moveToTarget = world.getComponent(e, MoveToTarget) as MoveToTarget;
        let squadronMember = world.getComponent(e, SquadronMember) as SquadronMember;
        return !squadronMember && moveToTarget;
      });

      if (entities.length > 0)
      {
        createSquadron(entities[0], world, squadronId);
        for (let i = 1; i < entities.length; ++i)
        {
          let target = world.getComponent(entities[i], MoveToTarget) as MoveToTarget;
          target.order = new Join(squadronId);
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

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    if (this.orderGiven)
    {
      let entities = world.findEntities([Selected, MoveToTarget, Controlled], (id : Entity, components : any[]) =>
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