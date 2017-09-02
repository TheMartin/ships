import { World, Entity } from "../ecs/entities";
import { Component } from "../ecs/component";
import { RenderSystem } from "../ecs/renderSystem";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Squadron } from "../systems/squadron";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2 } from "../vec2/vec2";

export class RenderMoveTarget implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    world.forEachEntity([Selected, MoveToTarget], (id : Entity, components : Component[]) =>
    {
      let [, moveTarget] = components as [Selected, MoveToTarget];
      if (moveTarget.order.kind !== "MoveTo")
        return;

      let target = moveTarget.order.target;
      this.renderer.drawCircle(target, 10, RenderMoveTarget.targetProps, this.viewport);
      this.renderer.drawCircle(target, 5, RenderMoveTarget.targetProps, this.viewport);

      let originPos : Vec2 = null;
      let position = world.getComponent(id, Position) as Position;
      if (position)
      {
        originPos = this.spatialCache.interpolatePosition(position, id, now);
      }
      else
      {
        let squadron = world.getComponent(id, Squadron) as Squadron;
        if (squadron)
        {
          let flagship = squadron.flagship;
          let position = world.getComponent(squadron.flagship, Position) as Position;
          if (position)
          {
            originPos = this.spatialCache.interpolatePosition(position, squadron.flagship, now);
          }
        }
      }

      if (originPos)
      {
        this.renderer.drawLine(originPos, target, RenderMoveTarget.targetProps, this.viewport);
      }
    });
  }

  private static readonly targetProps : RenderProps = { stroke : "rgb(0, 255, 0)", lineWidth : 1, lineDash : [5, 15] };
};