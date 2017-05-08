import { EntityContainer } from "../ecs/entities";

export class Deferred
{
  push(fn : (entities : EntityContainer) => void) : void
  {
    this.queue.push(fn);
  }

  flush(entities : EntityContainer) : void
  {
    for (let fn of this.queue)
    {
      fn(entities);
    }

    this.queue = [];
  }
  private queue : { (entities : EntityContainer) : void; }[] = [];
};