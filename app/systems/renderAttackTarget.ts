import { World } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Deferred } from "../ecs/deferred";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { Targetable, AttackTarget } from "../systems/attackTarget";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Squadron } from "../systems/squadron";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2 } from "../vec2/vec2";

export class RenderAttackTarget implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void
  {
    world.forEachEntity([Selected.t, AttackTarget.t], (id : number, components : any[]) =>
    {
      let [, attackTarget] = components as [Selected, AttackTarget];
      while (!world.containsEntity(attackTarget.target) && world.containsEntity(attackTarget.delegate))
      {
        attackTarget = world.getComponent(attackTarget.delegate, AttackTarget.t) as AttackTarget;
      }

      if (!world.containsEntity(attackTarget.target))
      {
        return;
      }

      let targetPosition = world.getComponent(attackTarget.target, Position.t) as Position;
      console.assert(targetPosition);
      let targetPos = this.spatialCache.interpolatePosition(targetPosition, attackTarget.target, interp);

      this.renderer.drawCircle(targetPos, 10, RenderAttackTarget.targetProps, this.viewport);
      this.renderer.drawCircle(targetPos, 5, RenderAttackTarget.targetProps, this.viewport);

      let originPos : Vec2 = null;
      let position = world.getComponent(id, Position.t) as Position;
      if (position)
      {
        originPos = this.spatialCache.interpolatePosition(position, id, interp);
      }
      else
      {
        let squadron = world.getComponent(id, Squadron.t) as Squadron;
        if (squadron)
        {
          let flagship = squadron.flagship;
          let position = world.getComponent(squadron.flagship, Position.t) as Position;
          if (position)
          {
            originPos = this.spatialCache.interpolatePosition(position, squadron.flagship, interp);
          }
        }
      }

      if (originPos)
      {
        this.renderer.drawLine(targetPos, originPos, RenderAttackTarget.targetProps, this.viewport);
      }
    });
  }

  private static readonly targetProps : RenderProps = { stroke : "rgb(255, 0, 0)", lineWidth : 1, lineDash : [1, 7] };
};