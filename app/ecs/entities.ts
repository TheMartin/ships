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

  readonly entities : EntityCollection = {};
};