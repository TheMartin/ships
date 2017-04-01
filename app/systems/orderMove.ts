import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager } from "../ui/uiManager";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";

import { Vec2 } from "../vec2/vec2";

export class OrderMove implements RenderSystem
{
  constructor(private entities : EntityContainer, ui : UiManager, viewport : Viewport)
  {
    ui.addEventListener("mousedown", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if (mouseEvent.button == 2)
      {
        this.entities.forEachEntity([Selected.t, MoveToTarget.t], (e : Entity, components : any[]) =>
        {
          let [, target] = components as [Selected, MoveToTarget];
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