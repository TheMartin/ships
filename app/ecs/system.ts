import { EntityContainer } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";

export interface System
{
  update(dt : number, entities : EntityContainer, deferred : Deferred) : void;
}