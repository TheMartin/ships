import { World } from "../ecs/entities";

import { UserInputQueue } from "../ui/userInputQueue";

import * as Network from "../network/network";
import { MessageType } from "../network/messageType";
import { isNetworkComponentType } from "../network/networkComponent";

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
  constructor(private server : Network.Server, componentMap : Map<string, Class>, eventMap : Map<string, Class>, inputQueue : UserInputQueue)
  {
    this.componentTypes = getNetworkComponentTypes(componentMap);

    let messageHandlers = {
      [MessageType.ClientUpdate] : (data : any) => this.onClientUpdate(data, eventMap, inputQueue),
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
    this.server.send({ type : MessageType.ServerUpdate, ack, delta : clientDelta.serialize() });
    this.history.push({ ack , snapshot });
  }

  private onClientUpdate(data : any, eventMap : Map<string, Class>, inputQueue : UserInputQueue) : void
  {
    const { ack, history } = data;
    if (ack > this.clientAckCounter)
    {
      let events = history.filter((item : any) => item.ack > this.clientAckCounter)
        .map((item : any) => item.events)
        .reduce((lhs : any[], rhs : any[]) => lhs.concat(rhs), []);

      for (let event of events)
      {
        let [name, ...data] = event;
        const type = eventMap.get(name) as any;
        console.assert(type && isNetworkComponentType(type), "Unrecognized network event key : ", event);
        inputQueue.enqueue(type.deserialize(data));
      }
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
  private history : VersionedSnapshot[] = [];
  private serverAckCounter : number = 0;
  private clientAckCounter : number = -1;
};