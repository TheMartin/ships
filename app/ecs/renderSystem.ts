import { Deferred } from "../ecs/deferred";

export interface RenderSystem
{
  update(dt : number, interp : number, deferred : Deferred) : void;
}