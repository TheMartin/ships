export class Entity
{
  constructor( public readonly id : number, public readonly components : { [name : string] : Object } = { } )
  {
  }

  addComponent(name : string, component : Object) : Entity
  {
    this.components[name] = component;
    return this;
  }

  removeComponent(name : string) : Entity
  {
    delete this.components[name];
    return this;
  }

  getComponents(names : string[]) : any[]
  {
    let components : any[] = [];
    for (let name of names)
    {
      if (!this.components[name])
        return null;

      components.push(this.components[name]);
    }
    return components;
  }

  getOptionalComponents(names : string[]) : any[]
  {
    let components : any[] = [];
    for (let name of names)
    {
      if (this.components[name])
        components.push(this.components[name]);
    }
    return components;
  }
};

export interface EntityCollection
{
  [id : number] : Entity;
}

export class EntityContainer
{
  static createEntity(components : { [name : string] : Object } = { }) : Entity
  {
    return new Entity(EntityContainer.EntityCount++, components);
  }

  addEntity(e : Entity) : void
  {
    this.entities[e.id] = e;
  }

  containsEntity(id : number) : boolean
  {
    return id !== null && id in this.entities;
  }

  getEntity(id : number) : Entity
  {
    return this.entities[id];
  }

  removeEntity(e : Entity) : void
  {
    delete this.entities[e.id];
  }

  forEachEntity(componentNames : string[], callback : (e : Entity, components : any[]) => void) : void
  {
    for (let id in this.entities)
    {
      const e = this.entities[id];
      let components : any[] = e.getComponents(componentNames);
      if (components)
        callback(e, components);
    }
  }

  findEntity(componentNames : string[], callback : (e : Entity, components : any[]) => boolean) : Entity
  {
    for (let id in this.entities)
    {
      const e = this.entities[id];
      let components : any[] = e.getComponents(componentNames);
      if (components)
      {
        if (callback(e, components))
          return e;
      }
    }
    return null;
  }

  filterEntities(componentNames : string[], callback : (e : Entity, components : any[]) => boolean) : Entity[]
  {
    let entities : Entity[] = [];
    for (let id in this.entities)
    {
      const e = this.entities[id];
      let components : any[] = e.getComponents(componentNames);
      if (components)
      {
        if (callback(e, components))
          entities.push(e);
      }
    }
    return entities;
  }

  entities : EntityCollection = {};
  private static EntityCount = 0;
};