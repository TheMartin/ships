import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager } from "../ui/uiManager";
import { Selected } from "../systems/selection";
import { Cached } from "../systems/cached";
import { Position } from "../systems/spatial";
import { interpolatePosition } from "../systems/cacheSpatial";
import { MoveToTarget } from "../systems/moveTo";
import { Named } from "../systems/named";

import { Vec2, lerp } from "../vec2/vec2";

export class StatusWindow implements RenderSystem
{
  constructor(private entities : EntityContainer, private ui : UiManager)
  {
    this.elem = document.createElement("div");
    this.elem.classList.add("window");
  }

  update(dt : number, interp : number) : void
  {
    let state : any[] = [];
    this.entities.forEachEntity([Selected.t], (e : Entity, components : any[]) =>
    {
      let [name, position, cachedPos, target] = e.getOptionalComponents([Named.t, Position.t, Cached.t + Position.t, MoveToTarget.t]) as [Named, Position, Cached<Position>, MoveToTarget];
      let row : any = {};

      if (name)
        row.name = name.name;

      if (position)
        row.position = interpolatePosition(position, cachedPos, interp);

      if (target && target.target)
        row.target = target.target;

      state.push(row);
    });

    if (state.length == 0)
    {
      if (this.elem.parentNode)
        this.ui.removeElement(this.elem);
    }
    else
    {
      while (this.elem.lastChild)
        this.elem.removeChild(this.elem.lastChild);

      for (let row of state)
      {
        let rowElem = document.createElement("div");
        rowElem.classList.add("ship");

        if (row.name)
        {
          let nameElem = document.createElement("span");
          nameElem.classList.add("name");
          nameElem.innerText = row.name;
          rowElem.appendChild(nameElem);
        }

        if (row.position)
        {
          let posElem = document.createElement("span");
          posElem.classList.add("pos");
          posElem.innerText = row.position.x.toFixed() + " : " + row.position.y.toFixed();
          rowElem.appendChild(posElem);
        }

        if (row.target)
        {
          let tgtElem = document.createElement("span");
          tgtElem.classList.add("tgt");
          tgtElem.innerText = row.target.x.toFixed() + " : " + row.target.y.toFixed();
          rowElem.appendChild(tgtElem);
        }

        this.elem.appendChild(rowElem);
      }

      if (!this.elem.parentNode)
        this.ui.addElement(this.elem);
    }
  }

  private elem : HTMLElement;
};