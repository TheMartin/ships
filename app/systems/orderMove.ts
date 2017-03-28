import { Entity, EntityContainer } from "../ecs/entities";
import { System } from "../ecs/system";
import { UiManager } from "../ui/uiManager";
import { MoveToTarget } from "../systems/moveTo";
import { Selected } from "../systems/selection";

import { Vec2 } from "../vec2/vec2";

export class OrderMove implements System
{
  constructor(private entities : EntityContainer, ui : UiManager)
  {
    ui.addEventListener("mousedown", (e : Event) =>
    {
      let mouseEvent = e as MouseEvent;
      if (mouseEvent.button == 2)
      {
        this.entities.forEachEntity([Selected.t, MoveToTarget.t], (e : Entity, components : any[]) =>
        {
          let [, target] = components as [Selected, MoveToTarget];
          target.target = new Vec2(mouseEvent.clientX, mouseEvent.clientY);
        });
      }
      e.preventDefault();
    });
  }

  update(dt : number) : void
  {
  }

};