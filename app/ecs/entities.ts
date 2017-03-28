export class Entity
{
  constructor()
  {
    this.id = Entity.Count;
    Entity.Count += 1;
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

  readonly components : { [name : string] : Object } = { };
  readonly id : number;
  private static Count : number = 0;
};

export interface EntityCollection
{
  [id : number] : Entity;
}

export class EntityContainer
{
  addEntity(e : Entity) : void
  {
    this.entities[e.id] = e;
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
      let components : any[] = [];
      for (let name of componentNames)
      {
        if (!e.components[name])
          break;

        components.push(e.components[name]);
      }

      if (components.length == componentNames.length)
        callback(e, components);
    }
  }

  readonly entities : EntityCollection = {};
};