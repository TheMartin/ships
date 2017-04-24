import { Entity } from "../ecs/entities";
import { Cached } from "../systems/cached";
import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { RenderShape } from "../systems/shapeRenderer";
import { MoveToTarget } from "../systems/moveTo";
import { Selectable } from "../systems/selection";
import { Named } from "../systems/named";
import { Controlled, Player } from "../systems/playable";
import { AttackTarget, Targetable } from "../systems/attackTarget";
import { Clickable } from "../systems/clickable";
import { Armed } from "../systems/armed";
import { Damageable } from "../systems/damageable";

import { Shape } from "../renderer/shape";
import { Vec2 } from "../vec2/vec2";

export class Static
{
  static Box : Shape = new Shape(
    {
      stroke : "black",
      lineWidth : 5,
      fillColor : "gray"
    },
    [ new Vec2(-35, -35), new Vec2(-25, 25), new Vec2(25, 25), new Vec2(25, -25) ]
  );

  private static shipVertices : Vec2[] = [ new Vec2(0, -15), new Vec2(-12, 15), new Vec2(0, 10.5), new Vec2(12, 15) ];

  static Ship : Shape = new Shape(
    {
      stroke : "hsla(207, 100%, 60%, 1)",
      lineWidth : 3,
      fillColor : "hsla(207, 100%, 30%, 0.8)"
    },
    Static.shipVertices
  );

  static NeutralShip : Shape = new Shape(
    {
      stroke : "hsla(120, 100%, 60%, 1)",
      lineWidth : 3,
      fillColor : "hsla(120, 100%, 30%, 0.8)"
    },
    Static.shipVertices
  );

  static makeShip(pos : Vec2, rot : number, name : string, shape : Shape, player : Player)
  {
    return new Entity({
      [Position.t] : new Position(pos),
      [Rotation.t] : new Rotation(rot),
      [Velocity.t] : new Velocity(new Vec2(0, 0)),
      [AngularVelocity.t] : new AngularVelocity(0),
      [RenderShape.t] : new RenderShape(shape),
      [Cached.t + Position.t] : new Cached<Position>(),
      [Cached.t + Rotation.t] : new Cached<Rotation>(),
      [MoveToTarget.t] : new MoveToTarget(),
      [Selectable.t] : new Selectable(),
      [Named.t] : new Named(name),
      [Controlled.t] : new Controlled(player),
      [Targetable.t] : new Targetable(),
      [AttackTarget.t] : new AttackTarget(),
      [Clickable.t] : new Clickable(15),
      [Armed.t] : new Armed(0.75, 1000, 350, 20),
      [Damageable.t] : new Damageable(300)
    });
  };
};