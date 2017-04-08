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
import { ViewportController } from "../systems/viewportController";
import { Player, PlayerType } from "../systems/playable";

import { UiManager } from "../ui/uiManager";
import { Renderer, Viewport } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

import { Static } from "../data/static";

import { shuffle } from "../util/shuffle";

export class Game
{
  constructor(private ui : UiManager, private renderer : Renderer)
  {
    let player = new Player(PlayerType.Local);
    let ai = new Player(PlayerType.Ai);
    this.players = [player, ai];

    this.updateSystems =
    [
      new CachePosition(this.entityContainer),
      new CacheRotation(this.entityContainer),
      new ChooseRandomTarget(this.entityContainer, ai, new Vec2(0, 0), new Vec2(1000, 1000)),
      new MoveTo(this.entityContainer, 50)
    ];

    this.viewport = new Viewport(new Vec2(0, 0), 0, 1);

    this.renderSystems =
    [
      new ViewportController(ui, 1000, this.viewport),
      new SelectionSystem(this.entityContainer, player, ui, renderer, this.viewport),
      new OrderMove(this.entityContainer, player, ui, this.viewport),
      new RenderMoveTarget(this.entityContainer, renderer, this.viewport),
      new ShapeRenderer(this.entityContainer, renderer, this.viewport),
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
      this.entityContainer.addEntity( Static.makeShip(Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], Static.Ship, this.players[0]) );
    }
    for (let i = 5; i < 10; ++i)
    {
      this.entityContainer.addEntity( Static.makeShip(Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], Static.NeutralShip, this.players[1]) );
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
  private viewport : Viewport = Viewport.identity;
  private players : Player[] = [];
};