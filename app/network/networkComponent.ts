import { Component } from "../ecs/component";

export interface NetworkComponent extends Component
{
  equal(other : Component) : boolean;
  serialize() : any[];
};

export function isNetworkComponentType(type : any) : boolean
{
  return type.deserialize !== undefined;
}