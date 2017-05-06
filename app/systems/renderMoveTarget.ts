import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Vec2 } from "../vec2/vec2";

export class RenderMoveTarget implements RenderSystem
{
  constructor(private entities : EntityContainer, private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(dt : number, interp : number, deferred : Deferred) : void
  {
    this.entities.forEachEntity([Selected.t, MoveToTarget.t], (e : Entity, components : any[]) =>
    {
      let [, moveTarget] = components as [Selected, MoveToTarget];
      if (!moveTarget.target)
        return;

      this.renderer.drawCircle(moveTarget.target, 10, RenderMoveTarget.targetProps, this.viewport);
      this.renderer.drawCircle(moveTarget.target, 5, RenderMoveTarget.targetProps, this.viewport);

      let [position] = e.getOptionalComponents([Position.t]) as [Position];
      if (position)
        this.renderer.drawLine(this.spatialCache.interpolatePosition(position, e, interp), moveTarget.target, RenderMoveTarget.targetProps, this.viewport);
    });
  }

  private static readonly targetProps : RenderProps = { stroke : "rgb(0, 255, 0)", lineWidth : 1, lineDash : [5, 15] };
};