export interface NetworkComponent
{
  equal(other : NetworkComponent) : boolean;
  clone() : NetworkComponent;
  serialize() : any[];
};

export function isNetworkComponentType(type : any) : boolean
{
  return type.deserialize !== undefined;
}