import { World, Entity } from "../ecs/entities";
import { RenderSystem } from "../ecs/renderSystem";
import { UserInputQueue } from "../ui/userInputQueue";
import { Renderer, RenderProps, Viewport } from "../renderer/renderer";
import { Position } from "../systems/spatial";
import { SpatialCache } from "../systems/spatialCache";
import { Selected } from "../systems/selection";
import { Damageable } from "../systems/damageable";
import { Vec2 } from "../vec2/vec2";
import { clamp } from "../util/clamp";

export class RenderHealthBar implements RenderSystem
{
  constructor(private spatialCache : SpatialCache, private renderer : Renderer, private viewport : Viewport) {}

  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void
  {
    world.forEachEntity([Position, Damageable], (id : Entity, components : any[]) =>
    {
      let [position, damageable] = components as [Position, Damageable];
      let selected = world.getComponent(id, Selected) as Selected;
      if (!selected && damageable.hitpoints === damageable.maxHitpoints)
        return;

      const ratio = clamp(damageable.hitpoints / damageable.maxHitpoints, 0, 1);
      let pos = this.viewport.transform(this.spatialCache.interpolatePosition(position, id, now)).add(RenderHealthBar.offset);

      this.renderer.drawRect(pos, RenderHealthBar.size.clone().elementMultiply(new Vec2(ratio, 1)).add(pos), RenderHealthBar.greenBarProps);
      this.renderer.drawRect(RenderHealthBar.size.clone().elementMultiply(new Vec2(ratio, 0)).add(pos), pos.add(RenderHealthBar.size), RenderHealthBar.redBarProps);
    });
  }

  private static readonly offset : Vec2 = new Vec2(-20, -25);
  private static readonly size : Vec2 = new Vec2(40, 3);
  private static readonly redBarProps : RenderProps = { fillColor : "rgb(255, 0, 0)" };
  private static readonly greenBarProps : RenderProps = { fillColor : "rgb(0, 255, 0)" };
};