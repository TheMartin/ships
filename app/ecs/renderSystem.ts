import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { UserInputQueue } from "../ui/userInputQueue";

export interface RenderSystem
{
  update(now : number, dt : number, world : World, inputQueue : UserInputQueue, deferred : Deferred) : void;
}