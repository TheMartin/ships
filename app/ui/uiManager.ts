export class UiManager
{
  constructor(private rootElement : HTMLElement, private canvas : HTMLCanvasElement)
  {
  }

  addEventListener(type : string, listener : (e : Event) => void) : void
  {
    this.rootElement.addEventListener(type, listener);
  }

  removeEventListener(type : string, listener : (e : Event) => void) : void
  {
    this.rootElement.removeEventListener(type, listener);
  }
};