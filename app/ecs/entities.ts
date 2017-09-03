import { Component } from "../ecs/component";
import { NetworkComponent } from "../network/networkComponent";

type ComponentStorage = Map<Entity, Component>;

type ComponentClass = new (...args : any[]) => Component;

export type Entity = number;

const ClientIdBits = 3;
const EntityIdBits = 32 - ClientIdBits;
const MaxClientId = 1 << ClientIdBits;
const MaxEntityId = 1 << EntityIdBits;
const ClientMask = (MaxClientId - 1) << EntityIdBits;
const EntityMask = MaxEntityId - 1;

export function createEntityId(clientId : number, entityId : number) : Entity
{
  console.assert(clientId >= 0 && clientId < MaxClientId);
  console.assert(entityId >= 0 && entityId < MaxEntityId);
  return (clientId << EntityIdBits) | entityId;
}

export function getClientId(id : Entity) : number
{
  return (id & ClientMask) >> EntityIdBits;
}

export function getEntityId(id : Entity) : number
{
  return id & EntityMask;
}

function delta(lhs : ComponentStorage, rhs : ComponentStorage) : ComponentStorage
{
  let result : ComponentStorage = new Map<Entity, Component>();
  for (let [id, newComponent] of rhs.entries())
  {
    let oldComponent = lhs.get(id);
    if (!oldComponent || !(oldComponent as NetworkComponent).equal(newComponent))
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

function applyDelta(components : ComponentStorage, delta : ComponentStorage) : void
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

function clone(components : ComponentStorage) : ComponentStorage
{
  let clone : ComponentStorage = new Map<Entity, Component>();
  for (let [id, component] of components.entries())
  {
    clone.set(id, component.clone());
  }
  return clone;
};

function serialize(components : ComponentStorage) : any[]
{
  let result : any[] = [];
  for (let [id, component] of components.entries())
  {
    result.push([id, component !== null ? (component as NetworkComponent).serialize() : null]);
  }
  return result;
};

function deserialize(data : any[], deserializer : (data : any[]) => Component) : ComponentStorage
{
  return new Map<Entity, Component>( data.map((item : any[]) : [Entity, Component] => [ (<any[]>item)[0] as Entity, (<any[]>item)[1] !== null ? deserializer( (<any[]>item)[1] as any[] ) : null]) );
};

export class World
{
  constructor(types : ComponentClass[])
  {
    const makeComponentStorage = (type : ComponentClass) : [ComponentClass, ComponentStorage] => [ type, new Map<Entity, Component>() ];
    this.componentData = new Map<ComponentClass, ComponentStorage>(types.map(makeComponentStorage));
  }

  addEntity(id : Entity, components : Component[]) : void
  {
    for (let component of components)
      this.componentData.get((component as any).constructor).set(id, component);
  }

  removeEntity(id : Entity) : void
  {
    for (let data of this.componentData.values())
      data.delete(id);
  }

  containsEntity(id : Entity) : boolean
  {
    for (let data of this.componentData.values())
    {
      if (data.has(id))
        return true;
    }

    return false;
  }

  addComponent(id : Entity, component : Component) : void
  {
    this.componentData.get((component as any).constructor).set(id, component);
  }

  removeComponent(id : Entity, type : ComponentClass) : void
  {
    this.componentData.get(type).delete(id);
  }

  getComponent(id : Entity, type : ComponentClass) : Component
  {
    let data = this.componentData.get(type);
    let component = data ? data.get(id) : null;
    return component ? component : null;
  }

  getAllEntities() : Entity[]
  {
    let entities = new Set<Entity>();
    this.componentData.forEach(storage => storage.forEach((_, id) => entities.add(id)));
    return Array.from(entities.values());
  }

  forEachEntity(types : ComponentClass[], callback : (id : Entity, components : Component[]) => void) : void
  {
    for (let id of this.findSmallestComponentFromTypes(types).keys())
    {
      let components = this.getComponents(id, types);
      if (components)
        callback(id, components);
    }
  }

  findEntities(types : ComponentClass[], filter : (id : Entity, components : Component[]) => boolean = () => true) : Entity[]
  {
    let entities : Entity[] = [];
    for (let id of this.findSmallestComponentFromTypes(types).keys())
    {
      let components = this.getComponents(id, types);
      if (components && filter(id, components))
        entities.push(id);
    }
    return entities;
  }

  getComponents(id : Entity, types : ComponentClass[]) : Component[]
  {
    let components : Component[] = [];
    for (let type of types)
    {
      let component = this.componentData.get(type).get(id);
      if (!component)
        return null;

      components.push(component);
    }
    return components;
  };

  getOptionalComponents(id : Entity, types : ComponentClass[]) : Component[]
  {
    return types.map(type => this.getComponent(id, type));
  }

  getSnapshot(types : ComponentClass[]) : World
  {
    let snapshot = new World(types);
    for (let type of types)
    {
      let data = clone(this.componentData.get(type));
      if (data)
      {
        snapshot.componentData.set(type, data);
      }
    }
    return snapshot;
  }

  replaceSnapshot(snapshot : World) : void
  {
    for (let [key, value] of snapshot.componentData.entries())
    {
      this.componentData.set(key, clone(value));
    }
  }

  delta(oldSnapshot : World) : World
  {
    const types = Array.from(oldSnapshot.componentData.keys());
    let worldDelta = new World(types);
    for (let type of types)
    {
      if (this.componentData.has(type))
      {
        worldDelta.componentData.set(type, delta(oldSnapshot.componentData.get(type), this.componentData.get(type)));
      }
    }
    return worldDelta;
  }

  applyDelta(delta : World) : void
  {
    const types = Array.from(delta.componentData.keys());
    console.assert(types.filter(type => !this.componentData.has(type)).length === 0, "Component type mismatch in applying delta", types);
    for (let type of types)
    {
      applyDelta(this.componentData.get(type), delta.componentData.get(type));
    }
  }

  serialize() : any[]
  {
    let result : any[] = [];
    for (let [type, data] of this.componentData.entries())
    {
      result.push([type.name, serialize(data)]);
    }
    return result;
  }

  static deserialize(data : any[], componentMap : Map<string, ComponentClass>) : World
  {
    const types = data.map(([key, data]) => key);
    let world = new World([]);
    for (let [key, value] of data)
    {
      let type = componentMap.get(key);
      console.assert(type && (type as any).deserialize, "Unrecognized network component : " + key);
      world.componentData.set(type, deserialize(value, (type as any).deserialize));
    }
    return world;
  }

  private findSmallestComponentFromTypes(types : ComponentClass[]) : ComponentStorage
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

  private componentData : Map<ComponentClass, ComponentStorage>;
};