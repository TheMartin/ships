import { World, createEntityId } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { RenderSystem } from "../ecs/renderSystem";

import { SpatialCache } from "../systems/spatialCache";
import { MoveKinematic } from "../systems/moveKinematic";
import { UpdateMovement, FinishMovement } from "../systems/moveTo";
import { Squadron, SquadronMember, SquadronMovement, CheckSquadronIntegrity } from "../systems/squadron";
import { ChooseRandomMoveTarget } from "../systems/randomMoveTarget";
import { RenderMoveTarget } from "../systems/renderMoveTarget";
import { OrderMove, MoveOrder } from "../systems/orderMove";
import { SelectionSystem, DrawSelectedBox } from "../systems/selection";
import { ShapeRenderer } from "../systems/shapeRenderer";
import { StatusWindow } from "../systems/statusWindow";
import { ViewportController } from "../systems/viewportController";
import { Player, PlayerType } from "../systems/playable";
import { RenderAttackTarget } from "../systems/renderAttackTarget";
import { OrderAttack, AttackOrder } from "../systems/orderAttack";
import { FormUpOrder, OrderFormUp } from "../systems/orderFormUp";
import { SplitOrder, OrderSplit } from "../systems/orderSplit";
import { Shooting } from "../systems/armed";
import { MoveProjectiles } from "../systems/projectile";
import { CheckDestroyed } from "../systems/damageable";
import { RenderTracer } from "../systems/tracerEffect";
import { RenderHealthBar } from "../systems/renderHealthBar";

import { DebugWindow } from "../systems/debugWindow";

import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { RenderShape } from "../systems/shapeRenderer";
import { MoveToTarget } from "../systems/moveTo";
import { Selected, Selectable, SelectionChange } from "../systems/selection";
import { Named } from "../systems/named";
import { Controlled } from "../systems/playable";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Armed } from "../systems/armed";
import { Damageable } from "../systems/damageable";
import { TracerEffect } from "../systems/tracerEffect";
import { Projectile } from "../systems/projectile";

import { UiManager } from "../ui/uiManager";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, Viewport } from "../renderer/renderer";
import { Vec2 } from "../vec2/vec2";

import * as Network from "../network/network";
import { Host } from "../network/host";
import { Client } from "../network/client";

import { Static } from "../data/static";

import { shuffle } from "../util/shuffle";

import { Loop } from "../util/loop";

type Class = new (...args : any[]) => any;

function makeConstructorNameMap(ctors : Class[]) : Map<string, Class>
{
  return new Map<string, Class>(ctors.map( (type : Class) : [string, Class] => [type.name, type] ));
}

export class Game
{
  static componentTypes : Class[] = [
    Position,
    Rotation,
    Velocity,
    AngularVelocity,
    RenderShape,
    MoveToTarget,
    Selectable,
    Selected,
    Named,
    Controlled,
    Targetable,
    AttackTarget,
    Armed,
    Damageable,
    TracerEffect,
    Projectile,
    Squadron,
    SquadronMember
  ];

  static eventTypes : Class[] = [
    AttackOrder,
    MoveOrder,
    FormUpOrder,
    SplitOrder,
    SelectionChange
  ];

  constructor(private ui : UiManager, private renderer : Renderer)
  {
    this.players = [new Player(PlayerType.Local, 0), new Player(PlayerType.Ai, 1)];
    this.viewport = new Viewport(new Vec2(0, 0), 0, 1);
  }

  startSingleplayer(fps : number) : void
  {
    let updateStep = 1000 / fps;

    this.setUpSingleplayerSystems();
    this.setUpScenario();

    Loop.timeout((now, dt) => this.update(now, dt, updateStep), updateStep);
    Loop.render((now, dt) => this.draw(now, dt, 0));
  }

  startMultiplayerHost(fps : number, netTickRate : number, server : Network.Server) : void
  {
    this.setUpHostSystems();

    let host = new Host(server, this.componentMap, this.networkEventMap, this.inputQueue, (pendingInputs : UserInputQueue, remoteCount : number) =>
    {
      pendingInputs.flush(performance.now(), this.world, () => createEntityId(this.players[1].id, remoteCount++));
      return remoteCount;
    });

    this.setUpScenario();

    let updateStep = 1000 / fps;
    Loop.timeout((now, dt) => this.update(now, dt, updateStep), updateStep);
    Loop.render((now, dt) => this.draw(now, dt, 0));
    Loop.timeout(() => host.update(this.world), 1000 / netTickRate);
  }

  startMultiplayerClient(fps : number, netTickRate : number, client : Network.Client) : void
  {
    let clientStep = 1000 / netTickRate;

    this.setUpClientSystems();

    let gameClient = new Client(client, this.componentMap, this.eventMap, this.inputQueue, (snapshot : World, entityCount : number, pendingInputs : UserInputQueue) =>
    {
      const now = performance.now();
      this.spatialCache.update(this.world, now, clientStep);
      this.world.replaceSnapshot(snapshot);
      for (let id = entityCount; id < this.nextLocalEntityId; ++id)
      {
        this.world.removeEntity(createEntityId(this.players[1].id, id));
      }
      this.nextLocalEntityId = entityCount;
      pendingInputs.flush(now, this.world, () => createEntityId(this.players[1].id, this.nextLocalEntityId++));
    });

    Loop.render((now, dt) => this.draw(now, dt, 1));
    Loop.timeout(() => gameClient.sendEvents(this.world), clientStep);
  }

  update(now : number, dt : number, step : number) : void
  {
    this.spatialCache.update(this.world, now, step);
    let deferred = new Deferred();
    for (let system of this.updateSystems)
    {
      system.update(dt, this.world, deferred);
    }
    deferred.flush(this.world, () => createEntityId(this.players[0].id, this.nextLocalEntityId++));
  }

  draw(now : number, dt : number, playerId : number) : void
  {
    this.ui.updateClickables(this.world, this.spatialCache, now, this.viewport);
    this.renderer.clear();

    for (let system of this.renderSystems)
    {
      system.update(now, dt, this.world, this.inputQueue);
    }
    this.inputQueue.flush(now, this.world, () => createEntityId(playerId, this.nextLocalEntityId++));
  }

  private setUpScenario() : void
  {
    const corner = new Vec2(50, 50);
    const dimensions = new Vec2(600, 600);
    const names = shuffle([
      "Arethusa", "Aurora", "Galatea", "Penelope", "Phaeton",
      "Bonaventure", "Dido", "Argonaut", "Scylla", "Swiftsure",
      "Minotaur", "Bellerophon", "Vanguard", "Collosus", "Audacious",
      "Warspite", "Valiant"
      ]);
    for (let i = 0; i < 5; ++i)
    {
      const id = createEntityId(this.players[0].id, this.nextLocalEntityId++);
      this.world.addEntity( id, Static.makeShip(id, Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], Static.Ship, this.players[0]) );
    }
    for (let i = 5; i < 10; ++i)
    {
      const id = createEntityId(this.players[0].id, this.nextLocalEntityId++);
      this.world.addEntity( id, Static.makeShip(id, Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], Static.NeutralShip, this.players[1]) );
    }
  }

  private setUpSingleplayerSystems() : void
  {
    let player = this.players[0];
    let ai = this.players[1];

    this.updateSystems =
    [
      new CheckSquadronIntegrity(),
      new ChooseRandomMoveTarget(ai, new Vec2(0, 0), new Vec2(1000, 1000)),
      new UpdateMovement(50, Math.PI / 3),
      new SquadronMovement(50, Math.PI / 3),
      new MoveProjectiles(),
      new Shooting(),
      new MoveKinematic(),
      new CheckDestroyed(),
      new FinishMovement()
    ];

    this.renderSystems =
    [
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
      new OrderMove(this.inputQueue, player, this.ui, this.viewport),
      new OrderFormUp(this.inputQueue, player, this.ui),
      new OrderSplit(this.inputQueue, player, this.ui),
      new OrderAttack(this.inputQueue, player, this.ui),
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
      new CheckSquadronIntegrity(),
      new UpdateMovement(50, Math.PI / 3),
      new SquadronMovement(50, Math.PI / 3),
      new MoveProjectiles(),
      new Shooting(),
      new MoveKinematic(),
      new CheckDestroyed(),
      new FinishMovement()
    ];

    this.renderSystems =
    [
      new ViewportController(this.ui, 1000, 2, this.viewport),
      new SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
      new OrderMove(this.inputQueue, player, this.ui, this.viewport),
      new OrderFormUp(this.inputQueue, player, this.ui),
      new OrderSplit(this.inputQueue, player, this.ui),
      new OrderAttack(this.inputQueue, player, this.ui),
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
      new OrderFormUp(this.inputQueue, player, this.ui),
      new OrderSplit(this.inputQueue, player, this.ui),
      new OrderAttack(this.inputQueue, player, this.ui),
      new DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
      new RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
      new RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
      new ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
      new RenderTracer(this.spatialCache, this.renderer, this.viewport),
      new RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
      new StatusWindow(this.spatialCache, this.ui)
    ];
  }

  private componentMap : Map<string, Class> = makeConstructorNameMap(Game.componentTypes);
  private eventMap : Map<string, Class> = makeConstructorNameMap(Game.eventTypes);
  private networkEventMap : Map<string, Class> = makeConstructorNameMap(Game.eventTypes.filter(item => (item as any).deserialize !== undefined));
  private world : World = new World(Game.componentTypes);
  private nextLocalEntityId : number = 0;
  private spatialCache : SpatialCache = new SpatialCache();
  private updateSystems : System[] = [];
  private renderSystems : RenderSystem[] = [];
  private viewport : Viewport = Viewport.identity;
  private players : Player[] = [];
  private inputQueue : UserInputQueue = new UserInputQueue();
};