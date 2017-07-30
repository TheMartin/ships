export type ComponentStorage = Map<number, any>;

export function delta(lhs : ComponentStorage, rhs : ComponentStorage) : ComponentStorage
{
  let result : ComponentStorage = new Map<number, any>();
  for (let [id, newComponent] of rhs.entries())
  {
    let oldComponent = lhs.get(id);
    if (!oldComponent || !oldComponent.equal(newComponent))
    {
      result.set(id, newComponent);
    }
  }
  for (let id of lhs.keys())
  {
    if (!rhs.has(id))
    {
      result.set(id, null);
    }
  }
  return result;
};

export function applyDelta(components : ComponentStorage, delta : ComponentStorage) : void
{
  for (let [id, newComponent] of delta.entries())
  {
    if (newComponent === null)
    {
      components.delete(id);
    }
    else
    {
      components.set(id, newComponent);
    }
  }
};

export function clone(components : ComponentStorage) : ComponentStorage
{
  let clone : ComponentStorage = new Map<number, any>();
  for (let [id, component] of components.entries())
  {
    clone.set(id, component.clone());
  }
  return clone;
};

export function serialize(components : ComponentStorage) : any[]
{
  let result : any[] = [];
  for (let [id, component] of components.entries())
  {
    result.push([id, component !== null ? component.serialize() : null]);
  }
  return result;
};

export function deserialize(data : any[], deserializer : (data : any[]) => any) : ComponentStorage
{
  return new Map<number, any>( data.map((item) : [number, any[]] => [ (<any[]>item)[0] as number, (<any[]>item)[1] !== null ? deserializer( (<any[]>item)[1] as any[] ) : null]) );
};

export class World
{
  constructor(types : any[])
  {
    const makeComponentStorage = (type : any) : [any, ComponentStorage] => [ type, new Map<number, any>() ];
    this.componentData = new Map<any, ComponentStorage>(types.map(makeComponentStorage));
  }

  static nextEntityId() : number
  {
    return World.EntityId++;
  }

  addEntity(id : number, components : any[]) : void
  {
    for (let component of components)
      this.componentData.get(component.constructor).set(id, component);
  }

  removeEntity(id : number) : void
  {
    for (let data of this.componentData.values())
      data.delete(id);
  }

  containsEntity(id : number) : boolean
  {
    for (let data of this.componentData.values())
    {
      if (data.has(id))
        return true;
    }

    return false;
  }

  addComponent(id : number, component : any) : void
  {
    this.componentData.get(component.constructor).set(id, component);
  }

  removeComponent(id : number, type : any) : void
  {
    this.componentData.get(type).delete(id);
  }

  getComponent(id : number, type : any) : any
  {
    let data = this.componentData.get(type);
    let component = data ? data.get(id) : null;
    return component ? component : null;
  }

  forEachEntity(types : any[], callback : (id : number, components : any[]) => void) : void
  {
    for (let id of this.findSmallestComponentFromTypes(types).keys())
    {
      let components = this.getComponents(id, types);
      if (components)
        callback(id, components);
    }
  }

  findEntities(types : any[], filter : (id : number, components : any[]) => boolean = () => true) : number[]
  {
    let entities : number[] = [];
    for (let id of this.findSmallestComponentFromTypes(types).keys())
    {
      let components = this.getComponents(id, types);
      if (components && filter(id, components))
        entities.push(id);
    }
    return entities;
  }

  getComponents(id : number, types : any[]) : any[]
  {
    let components : any[] = [];
    for (let type of types)
    {
      let component = this.componentData.get(type).get(id);
      if (!component)
        return null;

      components.push(component);
    }
    return components;
  };

  getOptionalComponents(id : number, types : any[]) : any[]
  {
    return types.map(type => this.getComponent(id, type));
  }

  getSnapshot(types : any[]) : Map<any, ComponentStorage>
  {
    const typeToKvPair = (type : any) : [any, ComponentStorage] => [ type, clone(this.componentData.get(type)) ];
    return new Map<any, ComponentStorage>(types.map(typeToKvPair));
  }

  replaceSnapshot(snapshot : Map<any, ComponentStorage>) : void
  {
    for (let [key, value] of snapshot.entries())
    {
      this.componentData.set(key, clone(value));
    }
  }

  private findSmallestComponentFromTypes(types : any[]) : ComponentStorage
  {
    let minSize : number = Number.POSITIVE_INFINITY;
    let minElement : ComponentStorage = null;
    for (let type of types)
    {
      let data = this.componentData.get(type);
      if (data && data.size < minSize)
      {
        minSize = data.size;
        minElement = data;
      }
    }
    console.assert(minElement !== null, "Did not find any storage for ", types, " in ", this.componentData);

    return minElement;
  }

  private componentData : Map<any, ComponentStorage>;
  private static EntityId : number = 0;
};