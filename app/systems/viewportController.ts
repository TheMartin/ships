import { EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { RenderSystem } from "../ecs/renderSystem";
import { Viewport } from "../renderer/renderer";
import { UiManager, Events, MouseButton } from "../ui/uiManager";

import { Vec2, lerp } from "../vec2/vec2";

export class ViewportController implements RenderSystem
{
  constructor(private ui : UiManager, private scrollSpeed : number, private scaleRatio : number, private viewport : Viewport)
  {
    ui.addEventListener("dragstart", (e : Events.MouseDragStart) =>
    {
      if (e.button === MouseButton.Right)
      {
        this.lastMousePos = e.pos.clone();
        this.dragging = true;
      }
    });

    ui.addEventListener("dragend", (e : Events.MouseDragStart) =>
    {
      if (e.button === MouseButton.Right)
        this.dragging = false;
    });

    ui.addEventListener("wheel", (e : Events.MouseScroll) =>
    {
      const pos = e.pos ? e.pos : this.ui.canvasDimensions().multiply(0.5);
      const rescale = Math.pow(this.scaleRatio, -e.delta);
      this.viewport.scale *= rescale;
      this.viewport.pos = pos.add(this.viewport.pos.clone().subtract(pos).multiply(rescale));
    });
  }

  update(dt : number, interp : number, entities : EntityContainer, deferred : Deferred) : void
  {
    const mousePos = this.ui.mousePosition();
    if (!mousePos)
      return;

    if (this.dragging)
    {
      this.viewport.pos.add(mousePos.clone().subtract(this.lastMousePos));
    }
    else
    {
      let screenScroll = new Vec2(0, 0);
      const relX = mousePos.x / this.ui.canvasWidth();
      const relY = mousePos.y / this.ui.canvasHeight();
      if (relX < 0.1)
      {
        screenScroll.x = Math.pow(lerp(1, 0, relX / 0.1), 2);
      }
      else if (relX > 0.9)
      {
        screenScroll.x = -Math.pow(lerp(0, 1, (relX - 0.9) / 0.1), 2);
      }

      if (relY < 0.1)
      {
        screenScroll.y = Math.pow(lerp(1, 0, relY / 0.1), 2);
      }
      else if (relY > 0.9)
      {
        screenScroll.y = -Math.pow(lerp(0, 1, (relY - 0.9) / 0.1), 2);
      }

      this.viewport.pos.add(screenScroll.multiply(this.scrollSpeed * dt));
    }

    this.lastMousePos = mousePos.clone();
  }

  private dragging : boolean = false;
  private lastMousePos : Vec2;
};