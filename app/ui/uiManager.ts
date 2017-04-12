import { Entity, EntityContainer } from "../ecs/entities";
import { Clickable } from "../systems/clickable";
import { Vec2, distance } from "../vec2/vec2";

export enum MouseButton
{
  Left,
  Middle,
  Right,
  Count
};

function domButtonToMouseButton(button : number) : MouseButton
{
  return button;
}

enum ButtonState
{
  Up,
  Clicked,
  Dragged
};

export namespace Events
{
  export class EntityClick
  {
    entities : Entity[];
    button : MouseButton;
  };

  export class MouseEvent
  {
    pos : Vec2;
    button : MouseButton;
  };

  export class MouseClick extends MouseEvent { };
  export class MouseDragStart extends MouseEvent { };
  export class MouseDragEnd extends MouseEvent { };

  export class MouseMove
  {
    pos : Vec2;
    delta : Vec2;
  };
}

type EventListener<EventType> = (event : EventType) => void;
type ErasedEventListener = (event : any) => void;

export class UiManager
{
  constructor(private entities : EntityContainer, private rootElement : HTMLElement, private canvas : HTMLCanvasElement)
  {
    this.mousePos = new Vec2(this.canvas.width / 2, this.canvas.height / 2);

    canvas.addEventListener("mousedown", (e : MouseEvent) =>
    {
      this.mouseButtons[domButtonToMouseButton(e.button)] = ButtonState.Clicked;
    });

    canvas.addEventListener("mouseup", (e : MouseEvent) =>
    {
      let pos = new Vec2(e.clientX, e.clientY);
      let button = domButtonToMouseButton(e.button);
      if (this.mouseButtons[button] === ButtonState.Clicked)
      {
        const entities = this.entities.filterEntities([Clickable.t], (e : Entity, components : any[]) =>
        {
          let [clickable] = components as [Clickable];
          return clickable.pos && distance(clickable.pos, pos) < 5;
        });
        if (entities.length > 0)
        {
          this.invokeListeners("entityclick", { entities, button });
        }
        else
        {
          this.invokeListeners("click", { pos, button });
        }
      }
      else if (this.mouseButtons[button] === ButtonState.Dragged)
      {
        this.invokeListeners("dragend", { pos, button });
      }
      this.mouseButtons[button] = ButtonState.Up;
    });

    rootElement.addEventListener("mouseenter", (e : MouseEvent) =>
    {
      this.mousePos = new Vec2(e.clientX, e.clientY);
    });

    rootElement.addEventListener("mouseleave", (e : MouseEvent) =>
    {
      this.mousePos = null;
    });

    rootElement.addEventListener("mousemove", (e : MouseEvent) =>
    {
      const oldMousePos = this.mousePos.clone();
      const delta = oldMousePos.clone().subtract(new Vec2(e.clientX, e.clientY));
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      this.invokeListeners("mousemove", { pos : this.mousePos.clone(), delta });
      for (let i = MouseButton.Left; i < MouseButton.Count; ++i)
      {
        if (this.mouseButtons[i] === ButtonState.Clicked)
        {
          this.invokeListeners("dragstart", { pos : oldMousePos, button : i });
          this.mouseButtons[i] = ButtonState.Dragged;
        }
      }
    });
  }

  addEventListener(type : string, listener : (e : any) => void) : void
  {
    const normalizedType = type.toLowerCase();
    if (normalizedType in this.listeners)
      this.listeners[normalizedType].push(listener);
  }

  removeEventListener(type : string, listener : (e : Event) => void) : void
  {
    const normalizedType = type.toLowerCase();
    if (normalizedType in this.listeners)
    {
      const index = this.listeners[normalizedType].indexOf(listener);
      if (index > -1)
        this.listeners[normalizedType].splice(index, 1);
    }
  }

  addElement(elem : HTMLElement) : void
  {
    this.rootElement.appendChild(elem);
  }

  removeElement(elem : HTMLElement) : void
  {
    this.rootElement.removeChild(elem);
  }

  canvasWidth() : number
  {
    return this.canvas.width;
  }

  canvasHeight() : number
  {
    return this.canvas.height;
  }

  mousePosition() : Vec2
  {
    return this.mousePos;
  }

  private invokeListeners(type : string, e : any)
  {
    if (!(type in this.listeners))
      return;

    for (let listener of this.listeners[type])
      listener(e);
  }

  private mouseButtons : ButtonState[] = [ButtonState.Up, ButtonState.Up, ButtonState.Up];
  private mousePos : Vec2 = new Vec2(0, 0);
  private listeners : { [type : string] : ErasedEventListener[] } = {
    entityclick : [],
    click : [],
    mousemove : [],
    dragstart : [],
    dragend : []
  };
};