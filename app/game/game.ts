import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";

import { Cached } from "../systems/cached";
import { Position, Rotation } from "../systems/spatial";
import { CachePosition, CacheRotation } from "../systems/cacheSpatial";
import { MoveTo, MoveToTarget } from "../systems/moveTo";
import { ChooseRandomTarget } from "../systems/randomTarget";
import { RenderMoveTarget } from "../systems/renderMoveTarget";
import { OrderMove } from "../systems/orderMove";
import { Selectable, SelectionSystem } from "../systems/selection";
import { RenderShape, ShapeRenderer } from "../systems/shapeRenderer";
import { StatusWindow } from "../systems/statusWindow";

import { UiManager } from "../ui/uiManager";
import { Renderer } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

import { Static } from "../data/static";

import { shuffle } from "../util/shuffle";

export class Game
{
  constructor(private ui : UiManager, private renderer : Renderer)
  {
    this.updateSystems =
    [
      new CachePosition(this.entityContainer),
      new CacheRotation(this.entityContainer),
      new MoveTo(this.entityContainer, 50),
      new OrderMove(this.entityContainer, ui)
    ];

    this.renderSystems =
    [
      new SelectionSystem(this.entityContainer, ui, renderer),
      new RenderMoveTarget(this.entityContainer, renderer),
      new ShapeRenderer(this.entityContainer, renderer),
      new StatusWindow(this.entityContainer, ui)
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

    const corner = new Vec2(50, 50);
    const dimensions = new Vec2(600, 600);
    const names = shuffle(["Arethusa", "Aurora", "Galatea", "Penelope", "Phaeton",
      "Bonaventure", "Dido", "Argonaut", "Scylla", "Swiftsure",
      "Minotaur", "Bellerophon", "Vanguard", "Collosus", "Audacious",
      "Warspite", "Valiant"]
      );
    for (let i = 0; i < 5; ++i)
    {
      this.entityContainer.addEntity( Static.makeShip(Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i]) );
    }

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  update(dt : number) : void
  {
    for (let system of this.updateSystems)
    {
      system.update(dt);
    }
  }

  draw(dt : number, interp : number) : void
  {
    this.renderer.clear();

    for (let system of this.renderSystems)
    {
      system.update(dt, interp);
    }
  }

  private lastUpdate : number = 0;
  private lastDraw : number = 0;
  private fps : number = 0;
  private entityContainer : EntityContainer = new EntityContainer();
  private updateSystems : System[] = [];
  private renderSystems : RenderSystem[] = [];
};