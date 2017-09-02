import { World, Entity } from "../ecs/entities";

import { SpatialCache } from "../systems/spatialCache";

import { UserInputQueue, UserEvent, UserEventHandler } from "../ui/userInputQueue";

import * as Network from "../network/network";
import { NetworkUserEvent, isNetworkEventType } from "../network/networkUserEvent";
import { isNetworkComponentType } from "../network/networkComponent";
import { MessageType } from "../network/messageType";

type Class = new (...args : any[]) => any;

interface HistoryItem
{
  ack : number;
  events : UserEvent[];
  snapshot : World;
};

function getNetworkComponentTypes(componentMap : Map<string, Class>) : Class[]
{
  return Array.from(componentMap.values()).filter(isNetworkComponentType) as Class[];
}

function getNonNetworkComponentTypes(componentMap : Map<string, Class>) : Class[]
{
  return Array.from(componentMap.values()).filter(type => !isNetworkComponentType(type)) as Class[];
}

function getNetworkEventTypes(eventMap : Map<string, Class>) : Class[]
{
  return Array.from(eventMap.values()).filter(isNetworkEventType) as Class[];
}

function isNetworkUserEvent(event : UserEvent) : boolean
{
  return (event as NetworkUserEvent).serialize !== undefined;
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
    this.localComponentTypes = getNonNetworkComponentTypes(componentMap);

    let pendingInputs = this.preparePendingInputQueue(eventMap, inputQueue);

    let messageHandlers = {
      [MessageType.ServerUpdate] : (data : any) => this.onServerUpdate(data, componentMap, pendingInputs, processSnapshot),
      [MessageType.ClientUpdateAck] : (data : any) => this.onAckClientUpdate(data)
    };

    this.snapshot = new World(Array.from(componentMap.values()) as Class[]);

    this.client.onData((data : any) =>
    {
      if (data.type in messageHandlers)
        messageHandlers[data.type](data);
    });
  }

  sendEvents(world : World) : void
  {
    if (this.unsentEvents.filter(isNetworkUserEvent).length > 0)
    {
      const ack = this.clientAckCounter++;
      this.history.push({ ack, events : this.unsentEvents, snapshot : world.getSnapshot(this.localComponentTypes) });
      this.unsentEvents = [];
      let history = this.history.map((item : HistoryItem) : {ack : number, events : any[]} =>
      {
        return { ack : item.ack, events : item.events.filter(isNetworkUserEvent).map(e => [e.constructor.name, ...(e as NetworkUserEvent).serialize()]) };
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
        this.unsentEvents.push(e);
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
    let acknowledgedUpdates = this.history.filter(item => item.ack <= ack);
    if (acknowledgedUpdates.length > 0)
    {
      this.snapshot.replaceSnapshot(acknowledgedUpdates.pop().snapshot);
      this.history = this.history.filter(item => item.ack > ack);
    }
  }

  private snapshot : World = null;
  private history : HistoryItem[] = [];
  private networkComponentTypes : Class[] = [];
  private localComponentTypes : Class[] = [];
  private unsentEvents : UserEvent[] = [];
  private serverAckCounter : number = -1;
  private clientAckCounter : number = 0;
};