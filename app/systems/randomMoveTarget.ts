import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { MoveToTarget } from "../systems/moveTo";
import { Controlled, Player } from "../systems/playable";
import { Vec2 } from "../vec2/vec2";

export class ChooseRandomMoveTarget implements System
{
  constructor(private player : Player, private min : Vec2, max : Vec2)
  {
    this.size = max.clone().subtract(min);
  }

  update(dt : number, entities : EntityContainer, deferred : Deferred) : void
  {
    entities.forEachEntity([MoveToTarget.t, Controlled.t], (e : Entity, components : any[]) =>
    {
      let [target, controlled] = components as [MoveToTarget, Controlled];
      if (controlled.player.id === this.player.id && !target.target)
        target.target = this.min.clone().add(new Vec2(Math.random(), Math.random()).elementMultiply(this.size));
    });
  }

  private size : Vec2;
};