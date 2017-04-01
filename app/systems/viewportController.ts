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
      this.screenScroll.x = this.screenScroll.y = 0;
      if ((e.buttons & 2) != 0)
      {
        this.screenMove.add(new Vec2(e.clientX, e.clientY).subtract(this.lastMousePos));
      }
      else
      {
        const relX = e.clientX / ui.canvasWidth();
        const relY = e.clientY / ui.canvasHeight();
        if (relX < 0.1)
        {
          this.screenScroll.x = Math.pow(lerp(1, 0, relX / 0.1), 2);
        }
        else if (relX > 0.9)
        {
          this.screenScroll.x = -Math.pow(lerp(0, 1, (relX - 0.9) / 0.1), 2);
        }

        if (relY < 0.1)
        {
          this.screenScroll.y = Math.pow(lerp(1, 0, relY / 0.1), 2);
        }
        else if (relY > 0.9)
        {
          this.screenScroll.y = -Math.pow(lerp(0, 1, (relY - 0.9) / 0.1), 2);
        }
      }
      this.lastMousePos.x = e.clientX;
      this.lastMousePos.y = e.clientY;
    });
  }

  update(dt : number, interp : number) : void
  {
    this.viewport.pos.add(this.screenScroll.clone().multiply(this.scrollSpeed * dt));
    this.viewport.pos.add(this.screenMove);
    this.screenMove.x = this.screenMove.y = 0;
  }

  private lastMousePos : Vec2 = new Vec2(0, 0);
  private screenMove : Vec2 = new Vec2(0, 0);
  private screenScroll : Vec2 = new Vec2(0, 0);
};