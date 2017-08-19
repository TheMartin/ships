type Fn = (now : number, dt : number) => void;

type ScheduledFn = (...args : any[]) => void;

interface Scheduler
{
  schedule(fn : ScheduledFn) : number;
  cancel(id : number) : void;
};

class TimeoutScheduler implements Scheduler
{
  constructor(private rate : number)
  {
  }

  schedule(fn : ScheduledFn) : number
  {
    return window.setTimeout(fn, this.rate);
  }

  cancel(id : number) : void
  {
    window.clearTimeout(id);
  }
};

class RenderScheduler implements Scheduler
{
  schedule(fn : ScheduledFn) : number
  {
    return window.requestAnimationFrame(fn);
  }

  cancel(id : number) : void
  {
    window.cancelAnimationFrame(id);
  }
};

export class Loop
{
  private constructor(private fn : Fn, private scheduler : Scheduler)
  {
    this.start();
  }

  start() : void
  {
    console.assert(!this.isRunning(), "Cannot double-start a loop");
    let callback = () =>
    {
      this.schedule(callback);
      const now = performance.now();
      this.fn(now, (now - this.last) / 1000);
      this.last = now;
    };

    this.schedule(callback);
  }

  isRunning() : boolean
  {
    return this.id !== null;
  }

  stop() : void
  {
    if (this.isRunning())
      this.cancel();
  }

  private schedule(callback : ScheduledFn) : void
  {
    this.id = this.scheduler.schedule(callback);
  }

  private cancel() : void
  {
    this.scheduler.cancel(this.id);
    this.id = null;
  }

  static timeout(fn : Fn, rate : number) : Loop
  {
    return new Loop(fn, new TimeoutScheduler(rate));
  }

  static render(fn : Fn) : Loop
  {
    return new Loop(fn, new RenderScheduler());
  }

  private last : number = null;
  private id : number = null;
};
