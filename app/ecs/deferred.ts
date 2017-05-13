import { World } from "../ecs/entities";

export class Deferred
{
  push(fn : (world : World) => void) : void
  {
    this.queue.push(fn);
  }

  flush(world : World) : void
  {
    for (let fn of this.queue)
    {
      fn(world);
    }

    this.queue = [];
  }
  private queue : { (world : World) : void; }[] = [];
};