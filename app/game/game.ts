import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";

import { Cached } from "../systems/cached";
import { Position } from "../systems/position";
import { CachePosition } from "../systems/cachePosition";
import { SineMovement } from "../systems/sineMovement";
import { RenderShape, ShapeRenderer } from "../systems/shapeRenderer";

import { Renderer } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

import { Static } from "../data/static";

export class Game
{
  constructor(private renderer : Renderer)
  {
    this.updateSystems =
    [
      new CachePosition(),
      new SineMovement()
    ];

    this.renderSystems =
    [
      new ShapeRenderer(renderer)
    ];
  }

  start(fps : number) : void
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
        .addComponent(Position.t,
          new Position(
            new Vec2(50, 50)
          )
        )
        .addComponent(RenderShape.t,
          new RenderShape(Static.Box)
        )
        .addComponent(Cached.t + Position.t,
          new Cached<Position>()
        )
      );

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  update(dt : number) : void
  {
    for (let system of this.updateSystems)
    {
      system.update(dt, this.entityCollection.entities);
    }
  }

  draw(dt : number, interp : number) : void
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