import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";

export interface System
{
  update(dt : number, world : World, deferred : Deferred) : void;
}