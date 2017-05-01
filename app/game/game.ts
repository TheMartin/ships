import { Entity, EntityContainer, EntityCollection } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";

import { CachePosition, CacheRotation } from "../systems/cacheSpatial";
import { MoveKinematic } from "../systems/moveKinematic";
import { MoveTo } from "../systems/moveTo";
import { ChooseRandomMoveTarget } from "../systems/randomMoveTarget";
import { RenderMoveTarget } from "../systems/renderMoveTarget";
import { OrderMove } from "../systems/orderMove";
import { SelectionSystem } from "../systems/selection";
import { ShapeRenderer } from "../systems/shapeRenderer";
import { StatusWindow } from "../systems/statusWindow";
import { ViewportController } from "../systems/viewportController";
import { Player, PlayerType } from "../systems/playable";
import { RenderAttackTarget } from "../systems/renderAttackTarget";
import { OrderAttack } from "../systems/orderAttack";
import { UpdateClickable } from "../systems/clickable";
import { Shooting } from "../systems/armed";
import { MoveProjectiles } from "../systems/projectile";
import { CheckDestroyed } from "../systems/damageable";
import { RenderTracer } from "../systems/tracerEffect";
import { RenderHealthBar } from "../systems/renderHealthBar";

import { UiManager } from "../ui/uiManager";
import { Renderer, Viewport } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

import * as Network from "../network/network";

import { Static } from "../data/static";

import { shuffle } from "../util/shuffle";

import * as SimplePeer from "simple-peer";

export class Game
{
  constructor(rootElement : HTMLElement, canvas : HTMLCanvasElement, private renderer : Renderer)
  {
    this.ui = new UiManager(this.entityContainer, rootElement, canvas);
    this.players = [new Player(PlayerType.Local), new Player(PlayerType.Ai)];
    this.viewport = new Viewport(new Vec2(0, 0), 0, 1);
  }

  startSingleplayer(fps : number) : void
  {
    this.setUpSystems();

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let updateFn = () =>
    {
      setTimeout(updateFn, 1000 / this.fps);
      const now = performance.now();
      const dt = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.draw(dt, interp);
    };

    this.setUpScenario();

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  startMultiplayerHost(fps : number, peer : SimplePeer.Instance) : void
  {
    this.setUpSystems();

    const serverTickPerSecond = 10;
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
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.draw(dt, interp);
    };

    let sendUpdatesFn = () =>
    {
      setTimeout(sendUpdatesFn, 1000 / serverTickPerSecond);
      const state = Network.clone(this.entityContainer.entities);
      peer.send(JSON.stringify({ ack : ackCounter++, delta : Network.serialize(Network.delta(history.length > 0 ? history[0].state : {}, state)) }));
      history.push( { ack : ackCounter, state } );
    };

    peer.on('data', (data : Buffer) =>
    {
      const { ack } = JSON.parse(data.toString());
      history = history.filter(item => item.ack >= ack);
    });

    this.setUpScenario();

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
    setTimeout(sendUpdatesFn, 1000 / serverTickPerSecond);
  }

  startMultiplayerClient(fps : number, peer : SimplePeer.Instance) : void
  {
    this.setUpClientSystems();

    let ackCounter = -1;

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let updateFn = () =>
    {
      setTimeout(updateFn, 1000 / this.fps);
      const now = performance.now();
      const dt = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.draw(dt, interp);
    };

    peer.on('data', (data : Buffer) =>
    {
      let { ack, delta } = JSON.parse(data.toString());
      if (ack > ackCounter)
      {
        Network.applyDelta(this.entityContainer.entities, Network.deserialize(delta));
        ackCounter = ack;
      }
      peer.send(JSON.stringify({ ack }));
    });

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  update(dt : number) : void
  {
    let deferred = new Deferred();
    for (let system of this.updateSystems)
    {
      system.update(dt, deferred);
    }
    deferred.flush();
  }

  draw(dt : number, interp : number) : void
  {
    this.renderer.clear();
    let deferred = new Deferred();

    for (let system of this.renderSystems)
    {
      system.update(dt, interp, deferred);
    }
    deferred.flush();
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

  private setUpSystems() : void
  {
    let player = this.players[0];
    let ai = this.players[1];

    this.updateSystems =
    [
      new CachePosition(this.entityContainer),
      new CacheRotation(this.entityContainer),
      new ChooseRandomMoveTarget(this.entityContainer, ai, new Vec2(0, 0), new Vec2(1000, 1000)),
      new MoveTo(this.entityContainer, 50, Math.PI / 3),
      new MoveProjectiles(this.entityContainer),
      new Shooting(this.entityContainer),
      new MoveKinematic(this.entityContainer),
      new CheckDestroyed(this.entityContainer)
    ];

    this.renderSystems =
    [
      new UpdateClickable(this.entityContainer, this.viewport),
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new SelectionSystem(this.entityContainer, player, this.ui, this.renderer, this.viewport),
      new OrderMove(this.entityContainer, player, this.ui, this.viewport),
      new OrderAttack(this.entityContainer, player, this.ui, this.viewport),
      new RenderMoveTarget(this.entityContainer, this.renderer, this.viewport),
      new RenderAttackTarget(this.entityContainer, this.renderer, this.viewport),
      new ShapeRenderer(this.entityContainer, this.renderer, this.viewport),
      new RenderTracer(this.entityContainer, this.renderer, this.viewport),
      new RenderHealthBar(this.entityContainer, this.renderer, this.viewport),
      new StatusWindow(this.entityContainer, this.ui)
    ];
  }

  private setUpClientSystems() : void
  {
    this.renderSystems =
    [
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new ShapeRenderer(this.entityContainer, this.renderer, this.viewport),
      new RenderTracer(this.entityContainer, this.renderer, this.viewport),
      new RenderHealthBar(this.entityContainer, this.renderer, this.viewport)
    ];
  }

  private lastUpdate : number = 0;
  private lastDraw : number = 0;
  private fps : number = 0;
  private entityContainer : EntityContainer = new EntityContainer();
  private ui : UiManager;
  private updateSystems : System[] = [];
  private renderSystems : RenderSystem[] = [];
  private viewport : Viewport = Viewport.identity;
  private players : Player[] = [];
};