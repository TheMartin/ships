import { World } from "../ecs/entities";

import { UserInputQueue } from "../ui/userInputQueue";

import * as Network from "../network/network";
import { MessageType } from "../network/messageType";
import { isNetworkComponentType } from "../network/networkComponent";
import { isNetworkEventType } from "../network/networkUserEvent";

type Class = new (...args : any[]) => any;

interface VersionedSnapshot
{
  ack : number;
  snapshot : World;
};

function getNetworkComponentTypes(componentMap : Map<string, Class>) : Class[]
{
  return Array.from(componentMap.values()).filter(isNetworkComponentType) as Class[];
}

export class Host
{
  constructor(
    private server : Network.Server,
    componentMap : Map<string, Class>,
    eventMap : Map<string, Class>,
    inputQueue : UserInputQueue,
    processPendingEvents : (pendingEvents : UserInputQueue, remoteCount : number) => number
    )
  {
    this.componentTypes = getNetworkComponentTypes(componentMap);

    let pendingEvents = new UserInputQueue();
    for (let type of eventMap.values())
    {
      pendingEvents.setHandler(type, inputQueue.getHandler(type));
    }

    let messageHandlers = {
      [MessageType.ClientUpdate] : (data : any) => this.onClientUpdate(data, eventMap, pendingEvents, processPendingEvents),
      [MessageType.ServerUpdateAck] : (data : any) => this.onAckServerUpdate(data)
    };

    this.server.onData((data : any) =>
    {
      if (data.type in messageHandlers)
        messageHandlers[data.type](data);
    });

    this.dummySnapshot = new World(this.componentTypes);
  }

  update(world : World) : void
  {
    const snapshot = world.getSnapshot(this.componentTypes);
    const oldSnapshot = this.history.length > 0 ? this.history[0].snapshot : this.dummySnapshot;
    const clientDelta = world.delta(oldSnapshot);
    const ack = this.serverAckCounter++;
    this.server.send({ type : MessageType.ServerUpdate, ack, entityCount : this.remoteEntityCount, delta : clientDelta.serialize() });
    this.history.push({ ack , snapshot });
  }

  private onClientUpdate(data : any, eventMap : Map<string, Class>, inputQueue : UserInputQueue, processPendingEvents : (pendingEvents : UserInputQueue, remoteCount : number) => number) : void
  {
    const { ack, history } = data;
    if (ack > this.clientAckCounter)
    {
      history.filter((item : any) => item.ack > this.clientAckCounter)
        .map((item : any) => item.events)
        .reduce((lhs : any[], rhs : any[]) => lhs.concat(rhs), [])
        .forEach((event : any) =>
        {
          let [name, ...data] = event;
          const type = eventMap.get(name) as any;
          console.assert(type && isNetworkEventType(type), "Unrecognized network event key : ", event);
          inputQueue.enqueue(type.deserialize(data));
        });

      this.remoteEntityCount = processPendingEvents(inputQueue, this.remoteEntityCount);
      console.assert(inputQueue.isEmpty());

      this.clientAckCounter = ack;
    }
    this.server.send({ type : MessageType.ClientUpdateAck, ack });
  }

  private onAckServerUpdate(data : any) : void
  {
    this.history = this.history.filter(item => item.ack >= data.ack);
  }

  private componentTypes : Class[] = [];
  private dummySnapshot : World = null;
  private remoteEntityCount : number = 0;
  private history : VersionedSnapshot[] = [];
  private serverAckCounter : number = 0;
  private clientAckCounter : number = -1;
};