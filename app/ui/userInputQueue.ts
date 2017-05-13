import { World } from "../ecs/entities";

export interface UserEvent
{
  name : string;
};

export class UserInputQueue
{
  enqueue(e : UserEvent) : void
  {
    this.queue.push(e);
  }

  getHandler(type : string) : (e : UserEvent, interp : number, world : World) => void
  {
    return this.handlers[type];
  }

  setHandler(type : string, handler : (e : UserEvent, interp : number, world : World) => void)
  {
    this.handlers[type] = handler;
  }

  flush(interp : number, world : World) : void
  {
    for (let e of this.queue)
    {
      if (e.name in this.handlers)
        this.handlers[e.name](e, interp, world);
    }

    this.queue = [];
  }

  private handlers : { [name : string] : (e : UserEvent, interp : number, world : World) => void } = {};
  private queue : UserEvent[] = [];
};