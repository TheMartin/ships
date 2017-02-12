import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";
import { Box, InterpolatedBox, BoxUpdater, BoxRenderer } from "../systems/box";
import { Renderer } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

export class Game
{
  constructor(private renderer : Renderer)
  {
    this.updateSystems =
    [
      new BoxUpdater()
    ];

    this.renderSystems =
    [
      new BoxRenderer(renderer)
    ];
  }

  start(fps : number)
  {
    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let updateFn = () =>
    {
      const now = performance.now();
      const dt = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      this.update(dt);
      setTimeout(updateFn, 1000 / this.fps);
    };

    let drawFn = (now : any) =>
    {
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.draw(dt, interp);
      requestAnimationFrame(drawFn);
    };

    this.entityCollection.addEntity(
      new Entity()
        .addComponent(Box.t,
          new Box(
            new Vec2(50, 50),
            new Vec2(10, 10)
          )
        )
        .addComponent(InterpolatedBox.t,
          new InterpolatedBox()
        )
      );

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  update(dt : number)
  {
    for (let system of this.updateSystems)
    {
      system.update(dt, this.entityCollection.entities);
    }
  }

  draw(dt : number, interp : number)
  {
    this.renderer.clear();
    
    for (let system of this.renderSystems)
    {
      system.update(dt, interp, this.entityCollection.entities);
    }
  }

  private lastUpdate : number = 0;
  private lastDraw : number = 0;
  private fps : number = 0;
  private entityCollection : EntityContainer = new EntityContainer();
  private updateSystems : System[] = [];
  private renderSystems : RenderSystem[] = [];
};