export interface NetworkComponent
{
  equal(other : NetworkComponent) : boolean;
  clone() : NetworkComponent;
  serialize() : any[];
};