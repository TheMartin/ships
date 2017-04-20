import { Deferred } from "../ecs/deferred";

export interface System
{
  update(dt : number, deferred : Deferred) : void;
}