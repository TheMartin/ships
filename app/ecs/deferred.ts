export class Deferred
{
  push(fn : () => void) : void
  {
    this.queue.push(fn);
  }

  flush() : void
  {
    for (let fn of this.queue)
    {
      fn();
    }

    this.queue = [];
  }
  private queue : { () : void; }[] = [];
};