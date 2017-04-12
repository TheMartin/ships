import { Entity, EntityContainer } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { UiManager } from "../ui/uiManager";
import { Selected } from "../systems/selection";
import { Cached } from "../systems/cached";
import { Position } from "../systems/spatial";
import { interpolatePosition } from "../systems/cacheSpatial";
import { MoveToTarget } from "../systems/moveTo";
import { Named } from "../systems/named";
import { AttackTarget, Targetable } from "../systems/attackTarget";

import { VdomNode, VdomElement, createElement, updateElementChildren } from "../vdom/vdom";

import { Vec2, lerp } from "../vec2/vec2";

function positionToString(pos : Vec2) : string
{
  return pos.x.toFixed() + " : " + pos.y.toFixed();
};

export class StatusWindow implements RenderSystem
{
  constructor(private entities : EntityContainer, private ui : UiManager)
  {
    this.elem = VdomElement.create("div", {"class" : "window"}, []);
    this.$elem = createElement(this.elem) as HTMLElement;
  }

  update(dt : number, interp : number) : void
  {
    let elem = VdomElement.create("div", {"class" : "window"}, []);
    this.entities.forEachEntity([Selected.t], (e : Entity, components : any[]) =>
    {
      let [name, position, cachedPos, moveTarget, attackTarget] = e.getOptionalComponents(
        [Named.t, Position.t, Cached.t + Position.t, MoveToTarget.t, AttackTarget.t]
        ) as [Named, Position, Cached<Position>, MoveToTarget, AttackTarget];

      let elems : VdomElement[] = [];

      if (name)
        elems.push(VdomElement.create("span", {"class" : "name"}, [name.name]));

      if (position)
        elems.push(VdomElement.create("span", {"class" : "pos"}, [positionToString(interpolatePosition(position, cachedPos, interp))]));

      if (moveTarget && moveTarget.target)
        elems.push(VdomElement.create("span", {"class" : "tgt"}, [positionToString(moveTarget.target)]));

      if (attackTarget && attackTarget.target)
      {
        let targetEntity = this.entities.findEntity([Targetable.t, Named.t], (e : Entity, components : any[]) =>
        {
          let [target,] = components as [Targetable, Named];
          return target === attackTarget.target;
        });
        if (targetEntity)
        {
          let [targetName] = targetEntity.getComponents([Named.t]) as [Named];
          elems.push(VdomElement.create("span", {"class" : "atk"}, [targetName.name]))
        }
      }

      elem.children.push(VdomElement.create("div", {"class" : "ship"}, elems));
    });

    updateElementChildren(this.$elem, elem, this.elem);
    this.elem = elem;
    
    if (this.elem.children.length == 0)
    {
      if (this.$elem.parentNode)
        this.ui.removeElement(this.$elem);
    }
    else
    {
      if (!this.$elem.parentNode)
        this.ui.addElement(this.$elem);
    }
  }

  private $elem : HTMLElement;
  private elem : VdomElement;
};