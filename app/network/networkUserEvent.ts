import { UserEvent } from "../ui/userInputQueue";

export interface NetworkUserEvent extends UserEvent
{
  serialize() : any[];
};

export function isNetworkEventType(type : any) : boolean
{
  return type.deserialize !== undefined;
}