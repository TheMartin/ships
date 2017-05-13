import { UserEvent } from "../ui/userInputQueue";

export interface NetworkUserEvent extends UserEvent
{
  serialize() : any[];
};