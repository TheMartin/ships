import { World } from "../ecs/entities";

export interface UserEvent
{
};

export type UserEventHandler = (e : UserEvent, now : number, world : World) => void;

type EventClass = new (...args : any[]) => any;

export class UserInputQueue
{
  enqueue(e : UserEvent) : void
  {
    this.queue.push(e);
  }

  getHandler(type : EventClass) : UserEventHandler
  {
    return this.handlers.get(type.name);
  }

  setHandler(type : EventClass, handler : UserEventHandler)
  {
    this.handlers.set(type.name, handler);
  }

  flush(now : number, world : World) : void
  {
    for (let e of this.queue)
    {
      if (this.handlers.has(e.constructor.name))
        this.handlers.get(e.constructor.name)(e, now, world);
    }

    this.queue = [];
  }

  isEmpty() : boolean
  {
    return this.queue.length === 0;
  }

  private handlers : Map<string, UserEventHandler> = new Map<string, UserEventHandler>();
  private queue : UserEvent[] = [];
};