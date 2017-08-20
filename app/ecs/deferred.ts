import { World, Entity } from "../ecs/entities";

type EntityCreator = () => Entity;
type DeferredFn = (world : World, entityCreator : EntityCreator) => void;

export class Deferred
{
  push(fn : DeferredFn) : void
  {
    this.queue.push(fn);
  }

  flush(world : World, entityCreator : EntityCreator) : void
  {
    for (let fn of this.queue)
    {
      fn(world, entityCreator);
    }

    this.queue = [];
  }
  private queue : DeferredFn[] = [];
};