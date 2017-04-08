import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager } from "../ui/uiManager";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";
import { Controlled, Player } from "../systems/playable";

import { Vec2 } from "../vec2/vec2";

export class OrderMove implements RenderSystem
{
  constructor(private entities : EntityContainer, private player : Player, ui : UiManager, viewport : Viewport)
  {
    ui.addEventListener("mouseup", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if (mouseEvent.button == 2)
      {
        this.entities.forEachEntity([Selected.t, MoveToTarget.t, Controlled.t], (e : Entity, components : any[]) =>
        {
          let [, target, controlled] = components as [Selected, MoveToTarget, Controlled];
          if (controlled.player === this.player)
            target.target = viewport.inverseTransform(new Vec2(mouseEvent.clientX, mouseEvent.clientY));
        });
      }
      e.preventDefault();
    });
  }

  update(dt : number, interp : number) : void
  {
  }

};