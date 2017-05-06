import { Entity, EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager, MouseButton, Events } from "../ui/uiManager";
import { Targetable, AttackTarget } from "../systems/attackTarget";
import { Selected } from "../systems/selection";
import { Position } from "../systems/spatial";
import { Controlled, Player } from "../systems/playable";

import { Vec2, distance } from "../vec2/vec2";

export class OrderAttack implements RenderSystem
{
  constructor(private entities : EntityContainer, private player : Player, ui : UiManager, viewport : Viewport)
  {
    ui.addEventListener("entityclick", (event : Events.EntityClick) =>
    {
      if (event.button === MouseButton.Right)
      {
        for (let entity of event.entities)
        {
          let components = entity.getComponents([Controlled.t, Targetable.t]);
          if (!components)
            continue;

          let [controlled, targetable] = components as [Controlled, Targetable];
          if (controlled.player !== this.player)
          {
            this.entities.forEachEntity([Selected.t, AttackTarget.t, Controlled.t], (e : Entity, components : any[]) =>
            {
              let [, attackTarget, controlled] = components as [Selected, AttackTarget, Controlled];
              if (controlled.player === this.player)
                attackTarget.setTarget(entity);
            });
            break;
          }
        }
      }
    });
  }

  update(dt : number, interp : number, deferred : Deferred) : void
  {
  }
};