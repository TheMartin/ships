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

export class JoinOrder implements NetworkUserEvent
{
  constructor(public entity : number, public flagship : number) {}

  serialize() : any[]
  {
    return [ this.entity, this.flagship ];
  }

  static deserialize(data : any[]) : JoinOrder
  {
    return new JoinOrder(data[0], data[1]);
  }

  name : string = JoinOrder.t;
  static readonly t : string = "JoinOrder";
};

export class FormSquadronOrder implements NetworkUserEvent
{
  constructor(public entity : number) {}

  serialize() : any[]
  {
    return [ this.entity ];
  }

  static deserialize(data : any[]) : FormSquadronOrder
  {
    return new FormSquadronOrder(data[0]);
  }

  name : string = FormSquadronOrder.t;
  static readonly t : string = "FormSquadronOrder";
};

export class OrderJoin implements RenderSystem
{
  constructor(inputQueue : UserInputQueue, private player : Player, ui : UiManager, viewport : Viewport)
  {
    inputQueue.setHandler(FormSquadronOrder.t, (evt : FormSquadronOrder, interp : number, world : World) =>
    {
      if (!world.containsEntity(evt.entity))
        return;

      let controlled = world.getComponent(evt.entity, Controlled.t) as Controlled;

      const squadronId = World.nextEntityId();
      world.addEntity(squadronId, {
        [Squadron.t] : new Squadron(evt.entity),
        [Named.t] : new Named("Squadron"),
        [MoveToTarget.t] : new MoveToTarget(),
        [AttackTarget.t] : new AttackTarget(),
        [Controlled.t] : new Controlled(controlled.player)
      });
      world.removeComponent(evt.entity, MoveToTarget.t);
      if (world.getComponent(evt.entity, Selected.t))
      {
        world.removeComponent(evt.entity, Selected.t);
        world.addComponent(squadronId, Selected.t, new Selected());
      }
      (world.getComponent(evt.entity, Selectable.t) as Selectable).target = squadronId;
      world.addComponent(evt.entity, SquadronMember.t, new SquadronMember(squadronId, null));
      (world.getComponent(evt.entity, AttackTarget.t) as AttackTarget).delegate = squadronId;
    });

    inputQueue.setHandler(JoinOrder.t, (evt : JoinOrder, interp : number, world : World) =>
    {
      if (!world.containsEntity(evt.entity)
        || !world.getComponent(evt.entity, MoveToTarget.t)
        || !world.containsEntity(evt.flagship)
        || !world.getComponent(evt.flagship, SquadronMember.t)
        )
        return;

      const squadron = (world.getComponent(evt.flagship, SquadronMember.t) as SquadronMember).squadron;
      if (world.containsEntity(squadron))
      {
        let target = world.getComponent(evt.entity, MoveToTarget.t) as MoveToTarget;
        target.order = new Join(squadron);
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

      if (entities.length > 0)
      {
        let flagship = entities[0];
        inputQueue.enqueue(new FormSquadronOrder(flagship));
        for (let i = 1; i < entities.length; ++i)
          inputQueue.enqueue(new JoinOrder(entities[i], flagship));
      }
    }
    this.orderGiven = false;
  }

  private orderGiven : boolean = false;
};