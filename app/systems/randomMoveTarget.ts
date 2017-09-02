import { World, Entity } from "../ecs/entities";
import { Component } from "../ecs/component";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { MoveToTarget, MoveTo } from "../systems/moveTo";
import { Controlled, Player } from "../systems/playable";
import { Vec2 } from "../vec2/vec2";

export class ChooseRandomMoveTarget implements System
{
  constructor(private player : Player, private min : Vec2, max : Vec2)
  {
    this.size = max.clone().subtract(min);
  }

  update(dt : number, world : World, deferred : Deferred) : void
  {
    world.forEachEntity([MoveToTarget, Controlled], (id : Entity, components : Component[]) =>
    {
      let [target, controlled] = components as [MoveToTarget, Controlled];
      if (controlled.player.id === this.player.id && target.order.kind === "Stop")
      {
        let newTarget = this.min.clone().add(new Vec2(Math.random(), Math.random()).elementMultiply(this.size));
        target.order = new MoveTo(newTarget);
      }
    });
  }

  private size : Vec2;
};