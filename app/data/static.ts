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
    return new Entity()
      .addComponent(Position.t,
        new Position(pos)
      )
      .addComponent(Rotation.t,
        new Rotation(rot)
      )
      .addComponent(Velocity.t,
        new Velocity(new Vec2(0, 0))
      )
      .addComponent(AngularVelocity.t,
        new AngularVelocity(0)
      )
      .addComponent(RenderShape.t,
        new RenderShape(shape)
      )
      .addComponent(Cached.t + Position.t,
        new Cached<Position>()
      )
      .addComponent(Cached.t + Rotation.t,
        new Cached<Rotation>()
      )
      .addComponent(MoveToTarget.t,
        new MoveToTarget()
      )
      .addComponent(Selectable.t,
        new Selectable()
      )
      .addComponent(Named.t,
        new Named(name)
      )
      .addComponent(Controlled.t,
        new Controlled(player)
      )
      .addComponent(Targetable.t,
        new Targetable()
      )
      .addComponent(AttackTarget.t,
        new AttackTarget()
      )
      .addComponent(Clickable.t,
        new Clickable()
      )
      .addComponent(Armed.t,
        new Armed(0.75, 1000, 350)
      );
  };
};