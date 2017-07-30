import { World, ComponentStorage, delta, applyDelta, serialize, deserialize } from "../ecs/entities";
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

import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { RenderShape } from "../systems/shapeRenderer";
import { MoveToTarget } from "../systems/moveTo";
import { Selected, Selectable } from "../systems/selection";
import { Named } from "../systems/named";
import { Controlled } from "../systems/playable";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Armed } from "../systems/armed";
import { Damageable } from "../systems/damageable";
import { TracerEffect } from "../systems/tracerEffect";
import { Projectile } from "../systems/projectile";

import { UiManager } from "../ui/uiManager";
import { UserInputQueue, UserEvent } from "../ui/userInputQueue";
import { NetworkUserEvent } from "../network/networkUserEvent";
import { Renderer, Viewport } from "../renderer/renderer";
import { Vec2, lerp } from "../vec2/vec2";

import * as Network from "../network/network";

import { Static } from "../data/static";

import { shuffle } from "../util/shuffle";

enum MessageType
{
  ServerUpdate,
  ServerUpdateAck,
  ClientUpdate,
  ClientUpdateAck
};

export class Game
{
  constructor(private ui : UiManager, private renderer : Renderer)
  {
    this.players = [new Player(PlayerType.Local, 0), new Player(PlayerType.Ai, 1)];
    this.viewport = new Viewport(new Vec2(0, 0), 0, 1);
    let componentTypes = [
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
    this.componentMap = new Map<string, any>(componentTypes.map( (type : any) : [string, any] => [type.t, type] ));
    this.networkEventTypes = [
      AttackOrder.t,
      MoveOrder.t,
      FormUpOrder.t,
      SplitOrder.t
    ];
    this.networkEventDeserializers = new Map<string, (data : any[]) => NetworkUserEvent>([
      [AttackOrder.t, AttackOrder.deserialize],
      [MoveOrder.t, MoveOrder.deserialize],
      [FormUpOrder.t, FormUpOrder.deserialize],
      [SplitOrder.t, SplitOrder.deserialize]
    ]);
    this.world = new World(componentTypes);
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
      this.spatialCache.update(this.world);
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.ui.updateClickables(this.world, this.spatialCache, interp, this.viewport);
      this.draw(dt, interp);
    };

    this.setUpScenario();

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
  }

  startMultiplayerHost(fps : number, netTickRate : number, server : Network.Server) : void
  {
    this.setUpHostSystems();

    let dummySnapshot = this.makeEmptyNetworkSnapshot();
    let snapshotHistory : { ack : number, snapshot : Map<any, ComponentStorage> }[] = [];
    let serverAckCounter = 0;
    let clientAckCounter = -1;

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let updateFn = () =>
    {
      setTimeout(updateFn, 1000 / this.fps);
      const now = performance.now();
      const dt = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;
      this.spatialCache.update(this.world);
      this.update(dt);
    };

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = this.fps * (now - this.lastUpdate) / 1000;
      this.ui.updateClickables(this.world, this.spatialCache, interp, this.viewport);
      this.draw(dt, interp);
    };

    let sendUpdatesFn = () =>
    {
      setTimeout(sendUpdatesFn, 1000 / netTickRate);
      const snapshot = this.world.getSnapshot(this.getNetworkComponentTypes());
      const oldSnapshot = snapshotHistory.length > 0 ? snapshotHistory[0].snapshot : dummySnapshot;
      const clientDelta = this.getNetworkComponentTypes().map((type : any) : [any, ComponentStorage] =>
      {
        return [type, delta(oldSnapshot.get(type), snapshot.get(type))];
      });
      const ack = serverAckCounter++;
      server.send({ type : MessageType.ServerUpdate, ack, delta : clientDelta.map(([type, value] : [any, ComponentStorage]) => { return [type.name, serialize(value)]; }) });
      snapshotHistory.push({ ack , snapshot });
    };

    let messageHandlers = {
      [MessageType.ClientUpdate] : (data : any) =>
      {
        const { ack, history } = data;
        if (ack > clientAckCounter)
        {
          for (let item of history)
          {
            if (item.ack > clientAckCounter)
              item.events.forEach(([name, ...data] : [string, any[]]) => this.inputQueue.enqueue(this.networkEventDeserializers.get(name)(data)));
          }
          clientAckCounter = ack;
        }
        server.send({ type : MessageType.ClientUpdateAck, ack });
      },
      [MessageType.ServerUpdateAck] : (data : any) =>
      {
        const ack = data.ack;
        snapshotHistory = snapshotHistory.filter(item => item.ack >= ack);
      }
    };

    server.onData((data : any) =>
    {
      if (data.type in messageHandlers)
        messageHandlers[data.type](data);
    });

    this.setUpScenario();

    setTimeout(updateFn, 1000 / this.fps);
    requestAnimationFrame(drawFn);
    setTimeout(sendUpdatesFn, 1000 / netTickRate);
  }

  startMultiplayerClient(fps : number, netTickRate : number, client : Network.Client) : void
  {
    this.setUpClientSystems();

    let snapshot = this.makeEmptyNetworkSnapshot();
    let inputHistory : { ack : number, events : NetworkUserEvent[] }[] = [];
    let serverAckCounter = -1;
    let clientAckCounter = 0;

    let unsentEvents : NetworkUserEvent[] = [];
    let handlers : { [type : string] : (e : UserEvent, interp : number, world : World) => void } = {};
    this.networkEventTypes.forEach(type =>
    {
      let handler = this.inputQueue.getHandler(type);
      handlers[type] = handler;
      this.inputQueue.setHandler(type, (e : UserEvent, interp : number, world : World) =>
      {
        handler(e, interp, world);
        unsentEvents.push(e as NetworkUserEvent);
      });
    });

    this.fps = fps;
    this.lastUpdate = performance.now();
    this.lastDraw = performance.now();

    let drawFn = (now : any) =>
    {
      requestAnimationFrame(drawFn);
      const dt = (now - this.lastDraw) / 1000;
      this.lastDraw = now;
      const interp = netTickRate * (now - this.lastUpdate) / 1000;
      this.ui.updateClickables(this.world, this.spatialCache, interp, this.viewport);
      this.draw(dt, interp);
    };

    let sendUpdatesFn = () =>
    {
      setTimeout(sendUpdatesFn, 1000 / netTickRate);
      if (unsentEvents.length > 0)
      {
        const ack = clientAckCounter++;
        inputHistory.push({ ack, events : unsentEvents });
        unsentEvents = [];
        let history = inputHistory.map((item : {ack : number, events : NetworkUserEvent[]}) : {ack : number, events : any[]} =>
        {
          return { ack : item.ack, events : item.events.map(e => [e.name, ...e.serialize()]) };
        });
        client.send({ type : MessageType.ClientUpdate, ack, history });
      }
    };

    let messageHandlers = {
      [MessageType.ServerUpdate] : (data : any) =>
      {
        let { ack, delta } = data;
        if (ack > serverAckCounter)
        {
          this.lastUpdate = performance.now();
          this.spatialCache.update(this.world);
          delta.forEach(([key, data] : [string, any[]]) : void =>
          {
            const type = this.componentMap.get(key);
            applyDelta(snapshot.get(type), deserialize(data, type.deserialize));
          });
          this.world.replaceSnapshot(snapshot);
          inputHistory.map(item => item.events)
            .reduceRight((rhs, lhs) => lhs.concat(rhs), unsentEvents)
            .forEach(e => handlers[e.name](e, 0, this.world));
          serverAckCounter = ack;
        }
        client.send({ type : MessageType.ServerUpdateAck, ack });
      },
      [MessageType.ClientUpdateAck] : (data : any) =>
      {
        let { ack } = data;
        inputHistory = inputHistory.filter(item => item.ack > ack);
      }
    };

    client.onData((data : any) =>
    {
      if (data.type in messageHandlers)
        messageHandlers[data.type](data);
    });

    requestAnimationFrame(drawFn);
    setTimeout(sendUpdatesFn, 1000 / netTickRate);
  }

  update(dt : number) : void
  {
    let deferred = new Deferred();
    for (let system of this.updateSystems)
    {
      system.update(dt, this.world, deferred);
    }
    deferred.flush(this.world);
  }

  draw(dt : number, interp : number) : void
  {
    this.renderer.clear();
    let deferred = new Deferred();

    for (let system of this.renderSystems)
    {
      system.update(dt, interp, this.world, this.inputQueue, deferred);
    }
    deferred.flush(this.world);
    this.inputQueue.flush(interp, this.world);
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
      const id = World.nextEntityId();
      this.world.addEntity( id, Static.makeShip(id, Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], Static.Ship, this.players[0]) );
    }
    for (let i = 5; i < 10; ++i)
    {
      const id = World.nextEntityId();
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
      new OrderFormUp(this.inputQueue, player, this.ui),
      new OrderSplit(this.inputQueue, player, this.ui),
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

  private getNetworkComponentTypes() : any[]
  {
    return Array.from(this.componentMap.values()).filter( type => type.deserialize !== undefined );
  }

  private makeEmptyNetworkSnapshot() : Map<any, ComponentStorage>
  {
    return new Map<any, ComponentStorage>( this.getNetworkComponentTypes().map((type : any) : [any, ComponentStorage] => { return [type, new Map<number, any>()]; } ) );
  }

  private lastUpdate : number = 0;
  private lastDraw : number = 0;
  private fps : number = 0;
  private componentMap : Map<string, any> = null;
  private networkEventTypes : string[] = [];
  private networkEventDeserializers : Map<string, (data : any[]) => any> = null;
  private world : World = null;
  private spatialCache : SpatialCache = new SpatialCache();
  private updateSystems : System[] = [];
  private renderSystems : RenderSystem[] = [];
  private viewport : Viewport = Viewport.identity;
  private players : Player[] = [];
  private inputQueue : UserInputQueue = new UserInputQueue();
};