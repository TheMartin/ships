import { EntityContainer } from "../ecs/entities";

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

  getHandler(type : string) : (e : UserEvent, interp : number, entities : EntityContainer) => void
  {
    return this.handlers[type];
  }

  setHandler(type : string, handler : (e : UserEvent, interp : number, entities : EntityContainer) => void)
  {
    this.handlers[type] = handler;
  }

  flush(interp : number, entities : EntityContainer) : void
  {
    for (let e of this.queue)
    {
      if (e.name in this.handlers)
        this.handlers[e.name](e, interp, entities);
    }

    this.queue = [];
  }

  private handlers : { [name : string] : (e : UserEvent, interp : number, entities : EntityContainer) => void } = {};
  private queue : UserEvent[] = [];
};