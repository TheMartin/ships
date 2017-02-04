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

export interface System
{
  update(dt : number, entities : EntityCollection) : void;
}

export interface RenderSystem
{
  update(dt : number, interp : number, entities : EntityCollection) : void;
}

export class ECS
{
  constructor(private systems : System[], private renderSystems : RenderSystem[]) {}

  addEntity(e : Entity) : void
  {
    this._entities[e.id] = e;
  }

  removeEntity(e : Entity) : void
  {
    delete this._entities[e.id];
  }

  update(dt : number) : void
  {
    for (let system of this.systems)
    {
      system.update(dt, this._entities);
    }
  }

  render(dt : number, interp : number) : void
  {
    for (let system of this.renderSystems)
    {
      system.update(dt, interp, this._entities);
    }
  }

  private _entities : EntityCollection = {};
};