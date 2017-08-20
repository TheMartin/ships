import { World } from "../ecs/entities";
import { UserInputQueue } from "../ui/userInputQueue";

export interface RenderSystem
{
  update(now : number, dt : number, world : World, inputQueue : UserInputQueue) : void;
}