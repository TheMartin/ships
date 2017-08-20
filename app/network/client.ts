import { World, Entity } from "../ecs/entities";

import { SpatialCache } from "../systems/spatialCache";

import { UserInputQueue, UserEvent, UserEventHandler } from "../ui/userInputQueue";

import * as Network from "../network/network";
import { NetworkUserEvent } from "../network/networkUserEvent";
import { isNetworkComponentType } from "../network/networkComponent";
import { MessageType } from "../network/messageType";

type Class = new (...args : any[]) => any;

interface UnsentEventBatch
{
  ack : number;
  events : NetworkUserEvent[];
};

function getNetworkComponentTypes(componentMap : Map<string, Class>) : Class[]
{
  return Array.from(componentMap.values()).filter(isNetworkComponentType) as Class[];
}

export class Client
{
  constructor(
    private client : Network.Client,
    componentMap : Map<string, Class>,
    eventMap : Map<string, Class>,
    inputQueue : UserInputQueue,
    processSnapshot : (snapshot : World, entityCount : number, pendingInputs : UserInputQueue) => void
  )
  {
    let pendingInputs = this.preparePendingInputQueue(eventMap, inputQueue);

    let messageHandlers = {
      [MessageType.ServerUpdate] : (data : any) => this.onServerUpdate(data, componentMap, pendingInputs, processSnapshot),
      [MessageType.ClientUpdateAck] : (data : any) => this.onAckClientUpdate(data)
    };

    this.snapshot = new World(getNetworkComponentTypes(componentMap));

    this.client.onData((data : any) =>
    {
      if (data.type in messageHandlers)
        messageHandlers[data.type](data);
    });
  }

  sendEvents() : void
  {
    if (this.unsentEvents.length > 0)
    {
      const ack = this.clientAckCounter++;
      this.history.push({ ack, events : this.unsentEvents });
      this.unsentEvents = [];
      let history = this.history.map((item : UnsentEventBatch) : {ack : number, events : any[]} =>
      {
        return { ack : item.ack, events : item.events.map(e => [e.constructor.name, ...e.serialize()]) };
      });
      this.client.send({ type : MessageType.ClientUpdate, ack, history });
    }
  }

  private preparePendingInputQueue(eventMap : Map<string, Class>, inputQueue : UserInputQueue) : UserInputQueue
  {
    let pendingInputs = new UserInputQueue();
    let handlers = new Map<string, UserEventHandler>();
    for (let [name, type] of eventMap.entries())
    {
      let handler = inputQueue.getHandler(type);
      pendingInputs.setHandler(type, handler);
      inputQueue.setHandler(type, (e : UserEvent, now : number, world : World, entityCreator : () => Entity) =>
      {
        handler(e, now, world, entityCreator);
        this.unsentEvents.push(e as NetworkUserEvent);
      });
    }
    return pendingInputs;
  }

  private onServerUpdate(data : any, componentMap : Map<string, Class>, pendingInputs : UserInputQueue, processSnapshot : (snapshot : World, entityCount : number, pendingInputs : UserInputQueue) => void) : void
  {
    let { ack, entityCount, delta } = data;
    if (ack > this.serverAckCounter)
    {
      this.snapshot.applyDelta(World.deserialize(delta, componentMap));
      this.history.map(item => item.events)
        .reduceRight((rhs, lhs) => lhs.concat(rhs), this.unsentEvents)
        .forEach(e => pendingInputs.enqueue(e));

      processSnapshot(this.snapshot, entityCount, pendingInputs);
      console.assert(pendingInputs.isEmpty());

      this.serverAckCounter = ack;
    }
    this.client.send({ type : MessageType.ServerUpdateAck, ack });
  }

  private onAckClientUpdate(data : any) : void
  {
    let { ack } = data;
    this.history = this.history.filter(item => item.ack > ack);
  }

  private snapshot : World = null;
  private history : UnsentEventBatch[] = [];
  private unsentEvents : NetworkUserEvent[] = [];
  private serverAckCounter : number = -1;
  private clientAckCounter : number = 0;
};