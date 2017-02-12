import { EntityCollection } from "./entities";

export interface RenderSystem
{
  update(dt : number, interp : number, entities : EntityCollection) : void;
}