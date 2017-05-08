import { Entity, EntityContainer, EntityCollection } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";

import { SpatialCache } from "../systems/spatialCache";
import { MoveKinematic } from "../systems/moveKinematic";
import { MoveTo } from "../systems/moveTo";
import { ChooseRandomMoveTarget } from "../systems/randomMoveTarget";
import { RenderMoveTarget } from "../systems/renderMoveTarget";
import { OrderMove } from "../systems/orderMove";
import { SelectionSystem, DrawSelectedBox } from "../systems/selection";
import { ShapeRenderer } from "../systems/shapeRenderer";
import { StatusWindow } from "../systems/statusWindow";
import { ViewportController } from "../systems/viewportController";
import { Player, PlayerType } from "../systems/playable";
import { RenderAttackTarget } from "../systems/renderAttackTarget";
import { OrderAttack } from "../systems/orderAttack";
import { Shooting } from "../systems/armed";
import { MoveProjectiles } from "../systems/projectile";
import { CheckDestroyed } from "../systems/damageable";
import { RenderTracer } from "../systems/tracerEffect";
import { RenderHealthBar } from "../systems/renderHealthBar";

import { UiManager } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, Viewport } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

import * as Network from "../network/network";
import * as NetworkSync from "../network/networkSync";

import { Static } from "../data/static";

import { shuffle } from "../util/shuffle";

export class Game
{
  constructor(private ui : UiManager, private renderer : Renderer)
  {
    this.players = [new Player(PlayerType.Local, 0), new Player(PlayerType.Ai, 1)];
    this.viewport = new Viewport(new Vec2(0, 0), 0, 1);
  }

  startSingleplayer(fps : number) : void
  {
    this.setUpSingleplayerSystems();

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let updateFn = () =>
    {
      setTimeout(updateFn, 1000 / this.fps);
      const now = performance.now();
      const dt = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      this.spatialCache.update(this.entityContainer);
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.ui.updateClickables(this.entityContainer, this.spatialCache, interp, this.viewport);
      this.draw(dt, interp);
    };

    this.setUpScenario();

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  startMultiplayerHost(fps : number, netTickRate : number, server : Network.Server) : void
  {
    this.setUpHostSystems();

    let history : { ack : number, state : EntityCollection }[] = [];
    let ackCounter = 0;

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let updateFn = () =>
    {
      setTimeout(updateFn, 1000 / this.fps);
      const now = performance.now();
      const dt = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      this.spatialCache.update(this.entityContainer);
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.ui.updateClickables(this.entityContainer, this.spatialCache, interp, this.viewport);
      this.draw(dt, interp);
    };

    let sendUpdatesFn = () =>
    {
      setTimeout(sendUpdatesFn, 1000 / netTickRate);
      const state = NetworkSync.clone(this.entityContainer.entities);
      const delta = NetworkSync.delta(history.length > 0 ? history[0].state : {}, state);
      const ack = ackCounter++;
      server.send({ ack , delta : NetworkSync.serialize(delta) });
      history.push({ ack , state });
    };

    server.onData((data : any) =>
    {
      const { ack } = data;
      history = history.filter(item => item.ack >= ack);
    });

    this.setUpScenario();

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
    setTimeout(sendUpdatesFn, 1000 / netTickRate);
  }

  startMultiplayerClient(fps : number, netTickRate : number, client : Network.Client) : void
  {
    this.setUpClientSystems();

    let ackCounter = -1;

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = netTickRate * (now - this.lastUpdate) / 1000;
      this.ui.updateClickables(this.entityContainer, this.spatialCache, interp, this.viewport);
      this.draw(dt, interp);
    };

    client.onData((data : any) =>
    {
      let { ack, delta } = data;
      if (ack > ackCounter)
      {
        this.lastUpdate = performance.now();
        this.spatialCache.update(this.entityContainer);
        NetworkSync.applyDelta(this.entityContainer.entities, NetworkSync.deserialize(delta));
        ackCounter = ack;
      }
      client.send({ ack });
    });

    requestAnimationFrame(drawFn);
  }

  update(dt : number) : void
  {
    let deferred = new Deferred();
    for (let system of this.updateSystems)
    {
      system.update(dt, this.entityContainer, deferred);
    }
    deferred.flush(this.entityContainer);
  }

  draw(dt : number, interp : number) : void
  {
    this.renderer.clear();
    let deferred = new Deferred();

    for (let system of this.renderSystems)
    {
      system.update(dt, interp, this.entityContainer, deferred);
    }
    deferred.flush(this.entityContainer);
    this.inputQueue.flush(interp, this.entityContainer);
  }

  private setUpScenario() : void
  {
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
  }

  private setUpSingleplayerSystems() : void
  {
    let player = this.players[0];
    let ai = this.players[1];

    this.updateSystems =
    [
      new ChooseRandomMoveTarget(ai, new Vec2(0, 0), new Vec2(1000, 1000)),
      new MoveTo(50, Math.PI / 3),
      new MoveProjectiles(),
      new Shooting(),
      new MoveKinematic(),
      new CheckDestroyed()
    ];

    this.renderSystems =
    [
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
      new OrderMove(this.inputQueue, player, this.ui, this.viewport),
      new OrderAttack(this.inputQueue, player, this.ui, this.viewport),
      new DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
      new RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
      new RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
      new ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
      new RenderTracer(this.spatialCache, this.renderer, this.viewport),
      new RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
      new StatusWindow(this.spatialCache, this.ui)
    ];
  }

  private setUpHostSystems() : void
  {
    let player = this.players[0];

    this.updateSystems =
    [
      new MoveTo(50, Math.PI / 3),
      new MoveProjectiles(),
      new Shooting(),
      new MoveKinematic(),
      new CheckDestroyed()
    ];

    this.renderSystems =
    [
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
      new OrderMove(this.inputQueue, player, this.ui, this.viewport),
      new OrderAttack(this.inputQueue, player, this.ui, this.viewport),
      new DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
      new RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
      new RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
      new ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
      new RenderTracer(this.spatialCache, this.renderer, this.viewport),
      new RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
      new StatusWindow(this.spatialCache, this.ui)
    ];
  }

  private setUpClientSystems() : void
  {
    let player = this.players[1];

    this.renderSystems =
    [
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
      new OrderMove(this.inputQueue, player, this.ui, this.viewport),
      new OrderAttack(this.inputQueue, player, this.ui, this.viewport),
      new DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
      new RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
      new RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
      new ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
      new RenderTracer(this.spatialCache, this.renderer, this.viewport),
      new RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
      new StatusWindow(this.spatialCache, this.ui)
    ];
  }

  private lastUpdate : number = 0;
  private lastDraw : number = 0;
  private fps : number = 0;
  private entityContainer : EntityContainer = new EntityContainer();
  private spatialCache : SpatialCache = new SpatialCache();
  private updateSystems : System[] = [];
  private renderSystems : RenderSystem[] = [];
  private viewport : Viewport = Viewport.identity;
  private players : Player[] = [];
  private inputQueue : UserInputQueue = new UserInputQueue();
};