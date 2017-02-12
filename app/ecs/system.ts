import { EntityCollection } from "./entities";

export interface System
{
  update(dt : number, entities : EntityCollection) : void;
}