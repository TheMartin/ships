import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Deferred } from "../ecs/deferred";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { Targetable, AttackTarget } from "../systems/attackTarget";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { interpolatePosition } from "../systems/cacheSpatial";
import { Vec2 } from "../vec2/vec2";

export class RenderAttackTarget implements RenderSystem
{
  constructor(private entities : EntityContainer, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Selected.t, AttackTarget.t], (e : Entity, components : any[]) =>
    {
      let [, attackTarget] = components as [Selected, AttackTarget];
      let targetEntity = this.entities.getEntity(attackTarget.target);
      if (!targetEntity)
      {
        attackTarget.target = null;
        return;
      }

      let [targetPosition] = targetEntity.getComponents([Position.t]) as [Position];
      let [targetCachedPos] = targetEntity.getOptionalComponents([Cached.t + Position.t]) as [Cached<Position>];
      let targetPos = interpolatePosition(targetPosition, targetCachedPos, interp);

      this.renderer.drawCircle(targetPos, 10, RenderAttackTarget.targetProps, this.viewport);
      this.renderer.drawCircle(targetPos, 5, RenderAttackTarget.targetProps, this.viewport);

      let [position, cachedPos] = e.getOptionalComponents([Position.t, Cached.t + Position.t]) as [Position, Cached<Position>];
      if (position)
        this.renderer.drawLine(targetPos, interpolatePosition(position, cachedPos, interp), RenderAttackTarget.targetProps, this.viewport);
    });
  }

  private static readonly targetProps : RenderProps = { stroke : "rgb(255, 0, 0)", lineWidth : 1, lineDash : [1, 7] };
};