import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager } from "../ui/uiManager";

import { Vec2, lerp } from "../vec2/vec2";

export class ViewportController implements RenderSystem
{
  constructor(ui : UiManager, private scrollSpeed : number, private viewport : Viewport)
  {
    ui.addEventListener("mousemove", (e : MouseEvent) =>
    {
      this.screenMove.x = this.screenMove.y = 0;
      const relX = e.clientX / ui.canvasWidth();
      const relY = e.clientY / ui.canvasHeight();
      if (relX < 0.1)
      {
        this.screenMove.x = Math.pow(lerp(1, 0, relX / 0.1), 2);
      }
      else if (relX > 0.9)
      {
        this.screenMove.x = -Math.pow(lerp(0, 1, (relX - 0.9) / 0.1), 2);
      }

      if (relY < 0.1)
      {
        this.screenMove.y = Math.pow(lerp(1, 0, relY / 0.1), 2);
      }
      else if (relY > 0.9)
      {
        this.screenMove.y = -Math.pow(lerp(0, 1, (relY - 0.9) / 0.1), 2);
      }
    });
  }

  update(dt : number, interp : number) : void
  {
    this.viewport.pos.add(this.screenMove.clone().multiply(this.scrollSpeed * dt));
  }

  private screenMove : Vec2 = new Vec2(0, 0);
};