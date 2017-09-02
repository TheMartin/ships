import { World, Entity } from "../ecs/entities";
import { Component } from "../ecs/component";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { NetworkComponent } from "../network/networkComponent";
import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { Squadron, SquadronMember } from "../systems/squadron";
import { AttackTarget } from "../systems/attackTarget";
import { Selectable, Selected } from "../systems/selection";
import { Vec2, dot, norm, norm2 } from "../vec2/vec2";
import { angleDiff } from "../util/angle";
import { clamp } from "../util/clamp";

export class MoveTo
{
  constructor(public target : Vec2) {}
  equal(other : MoveTo) : boolean { return this.target.equal(other.target); }
  clone() : MoveTo { return new MoveTo(this.target.clone()); }
  serialize() : any[] { return [ this.target.x, this.target.y ]; }
  static deserialize(data : any[]) { return new MoveTo(new Vec2(data[0] as number, data[1] as number)); }
  kind : "MoveTo" = "MoveTo";
};

export class Join
{
  constructor(public squadron : Entity) {}
  equal(other : Join) : boolean { return this.squadron === other.squadron; }
  clone() : Join { return new Join(this.squadron); }
  serialize() : any[] { return [ this.squadron ]; }
  static deserialize(data : any[]) { return new Join(data[0] as Entity); }
  kind : "Join" = "Join";
};

export class Stop
{
  clone() : Stop { return new Stop(); }
  serialize() : any[] { return []; }
  static deserialize(data : any[]) { return new Stop(); }
  kind : "Stop" = "Stop";
};

export type MoveOrder = MoveTo | Join | Stop;

function equal(lhs : MoveOrder, rhs : MoveOrder) : boolean
{
  if (lhs.kind !== rhs.kind)
    return false;

  switch (lhs.kind)
  {
    case "MoveTo" : return lhs.equal(rhs as MoveTo);
    case "Join" : return lhs.equal(rhs as Join);
    case "Stop" : return true;
  }
}

function serialize(order : MoveOrder) : any[]
{
  return [ order.kind, ...order.serialize() ];
}

function deserialize(data : any[]) : MoveOrder
{
  let [kind, ...args] = data;
  switch (kind)
  {
    case "MoveTo" : return MoveTo.deserialize(args);
    case "Join" : return Join.deserialize(args);
    case "Stop" : return Stop.deserialize(args);
  }
}

export class MoveToTarget implements NetworkComponent
{
  equal(other : MoveToTarget) : boolean
  {
    return equal(this.order, other.order);
  }

  clone() : MoveToTarget
  {
    return MoveToTarget.Make(this.order.clone());
  }

  serialize() : any[]
  {
    return serialize(this.order);
  }

  static deserialize(data : any[]) : MoveToTarget
  {
    return MoveToTarget.Make( deserialize(data) );
  }

  private static Make(order : MoveOrder) : MoveToTarget
  {
    let tgt = new MoveToTarget();
    tgt.order = order;
    return tgt;
  }

  order : MoveOrder = new Stop();
};

export class UpdateMovement implements System
{
  constructor(private speed : number, private angularSpeed : number) {}

  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([Position, Rotation, Velocity, AngularVelocity, MoveToTarget], (id : Entity, components : Component[]) =>
    {
      if (world.getComponent(id, Squadron))
        return;

      let [position, rotation, velocity, angularVelocity, target] = components as [Position, Rotation, Velocity, AngularVelocity, MoveToTarget];
      switch (target.order.kind)
      {
        case "MoveTo":
        {
          const toTarget = target.order.target.clone().subtract(position.pos);
          velocity.vel = toTarget.normalized().multiply(Math.min(this.speed, norm(toTarget) / dt));
          angularVelocity.vel = Math.sign(angleDiff(rotation.angle, toTarget.angle())) * this.angularSpeed;
          break;
        }
        case "Join":
        {
          if (world.containsEntity(target.order.squadron))
          {
            const flagship = (world.getComponent(target.order.squadron, Squadron) as Squadron).flagship;
            const [flagshipPos, flagshipRot] = world.getComponents(flagship, [Position, Rotation]) as [Position, Rotation];
            const toTarget = flagshipPos.pos.clone().subtract(position.pos);
            velocity.vel = toTarget.normalized().multiply(this.speed);
            angularVelocity.vel = Math.sign(angleDiff(rotation.angle, toTarget.angle())) * this.angularSpeed;
          }
          else
          {
            velocity.vel = Vec2.zero.clone();
            angularVelocity.vel = 0;
            target.order = new Stop();
          }
          break;
        }
        case "Stop":
        {
          velocity.vel = Vec2.zero.clone();
          angularVelocity.vel = 0;
          break;
        }
      }
    });
  }
};

export class FinishMovement implements System
{
  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([Position, MoveToTarget], (id : Entity, components : Component[]) =>
    {
      let [position, target] = components as [Position, MoveToTarget];
      switch (target.order.kind)
      {
        case "MoveTo":
        {
          const toTarget = target.order.target.clone().subtract(position.pos);
          if (norm(toTarget) < 0.25)
            target.order = new Stop();

          break;
        }
        case "Join":
        {
          const squadron = target.order.squadron;
          const flagship = (world.getComponent(squadron, Squadron) as Squadron).flagship;
          const flagshipPos = world.getComponent(flagship, Position) as Position;
          const toTarget = flagshipPos.pos.clone().subtract(position.pos);
          if (norm(toTarget) < 30)
          {
            deferred.push((world : World) =>
            {
              let flagshipRot = world.getComponent(flagship, Rotation) as Rotation;
              world.removeComponent(id, MoveToTarget);
              if (world.getComponent(id, Selected))
              {
                world.removeComponent(id, Selected);
                world.addComponent(squadron, new Selected());
              }
              (world.getComponent(id, Selectable) as Selectable).target = squadron;
              (world.getComponent(id, AttackTarget) as AttackTarget).delegate = squadron;
              world.addComponent(id, new SquadronMember(squadron, toTarget.negate().rotated(flagshipRot.angle)));
            });
          }
          break;
        }
      }
    });

    world.forEachEntity([Squadron, MoveToTarget], (id : Entity, components : Component[]) =>
    {
      let [squadron, target] = components as [Squadron, MoveToTarget];
      if (target.order.kind === "MoveTo")
      {
        const flagshipPos = world.getComponent(squadron.flagship, Position) as Position;
        const toTarget = target.order.target.clone().subtract(flagshipPos.pos);
        if (norm(toTarget) < 0.25)
          target.order = new Stop();
      }
    });
  }
};