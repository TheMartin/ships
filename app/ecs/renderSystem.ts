import { EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";

export interface RenderSystem
{
  update(dt : number, interp : number, entities : EntityContainer, deferred : Deferred) : void;
}