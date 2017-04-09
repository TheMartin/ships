import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager } from "../ui/uiManager";
import { Targetable, AttackTarget } from "../systems/attackTarget";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Cached } from "../systems/cached";
import { interpolatePosition } from "../systems/cacheSpatial";
import { Controlled, Player } from "../systems/playable";

import { Vec2, distance } from "../vec2/vec2";

export class OrderAttack implements RenderSystem
{
  constructor(private entities : EntityContainer, private player : Player, ui : UiManager, viewport : Viewport)
  {
    ui.addEventListener("mouseup", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if (mouseEvent.button == 2)
      {
        let clickPos = new Vec2(mouseEvent.clientX, mouseEvent.clientY);
        let target : Targetable = null;
        this.entities.forEachEntity([Position.t, Targetable.t, Controlled.t], (e : Entity, components : any[]) =>
        {
          let [position, targetable, controlled] = components as [Position, Targetable, Controlled];
          if (controlled.player !== this.player)
          {
            let [cachedPos] = e.getOptionalComponents([Cached.t + Position.t]) as [Cached<Position>];
            let pos = viewport.transform(interpolatePosition(position, cachedPos, this.interp));
            if (distance(pos, clickPos) < 10)
            {
              target = targetable;
            }
          }
        });

        this.entities.forEachEntity([Selected.t, AttackTarget.t, Controlled.t], (e : Entity, components : any[]) =>
        {
          let [, attackTarget, controlled] = components as [Selected, AttackTarget, Controlled];
          if (controlled.player === this.player)
            attackTarget.target = target;
        });
      }
      e.preventDefault();
    });
  }

  update(dt : number, interp : number) : void
  {
    this.interp = interp;
  }

  private interp : number = 0;
};