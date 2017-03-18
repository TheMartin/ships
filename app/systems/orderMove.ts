import { EntityContainer } from "../ecs/entities";
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
        for (let id in this.entities.entities)
        {
          let e = this.entities.entities[id];
          let selected = e.components[Selected.t] as Selected;
          let target = e.components[MoveToTarget.t] as MoveToTarget;
          if (!selected || !target)
            continue;

          target.target = new Vec2(mouseEvent.clientX, mouseEvent.clientY);
        }
      }
      e.preventDefault();
    });
  }

  update(dt : number) : void
  {
  }

};