import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Renderer, RenderProps } from "../renderer/renderer";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { Vec2 } from "../vec2/vec2";

export class RenderMoveTarget implements RenderSystem
{
  constructor(private entities : EntityContainer, private renderer : Renderer) {}

  update(dt : number, interp : number) : void
  {
    this.entities.forEachEntity([Selected.t, MoveToTarget.t], (e : Entity, components : any[]) =>
    {
      let [, moveTarget] = <[Selected, MoveToTarget]>(components);
      if (!moveTarget.target)
        return;

      this.renderer.drawCircle(moveTarget.target, 10, RenderMoveTarget.targetProps);
      this.renderer.drawCircle(moveTarget.target, 5, RenderMoveTarget.targetProps);

      let position = e.components[Position.t] as Position;
      if (!position)
        return;

      let pos = position.pos;
      let cachedPos = e.components[Cached.t + Position.t] as Cached<Position>;
      if (cachedPos && cachedPos.value)
        pos = Vec2.lerp(cachedPos.value.pos, pos, interp);

      this.renderer.drawLine(pos, moveTarget.target, RenderMoveTarget.targetProps, RenderMoveTarget.targetDash);
    });
  }

  private static readonly targetProps : RenderProps = { stroke : "rgb(0, 255, 0)", lineWidth : 1 };
  private static readonly targetDash : number[] = [5, 15];
};