import { Game } from "../game/game";
import { Renderer } from "../renderer/renderer";
import * as Fullscreen from "../util/fullscreen";
import { VdomElement, createElement } from "../vdom/vdom";

export class App
{
  private constructor(private $root : HTMLElement)
  {
    this.$root.appendChild(createElement(
      VdomElement.create("ul", {"class" : "menu"},

        VdomElement.create("li", {},
          VdomElement.create("a", {
            "href" : "",
            "class" : "btn",
            "onclick" : (e : Event) =>
            {
              this.runGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
              e.preventDefault();
            }
          },
          "Start")
        )
      )
    ));

    this.$root.appendChild(createElement(
      VdomElement.create("div", {"class" : "title"}, "Ships")
    ));

    this.$root.appendChild(createElement(
      VdomElement.create("div", {"class" : "fullscreen"},
        VdomElement.create("input", {"id" : "fullscreen", "type" : "checkbox"}),
        VdomElement.create("label", {"for" : "fullscreen"}, "Start fullscreen")
      )
    ));
  }

  static mount($root : HTMLElement) : App
  {
    $root.addEventListener("contextmenu", (e : Event) => { e.preventDefault(); });
    return new App($root);
  }

  runGame(fullscreen : boolean) : void
  {
    let canvas = document.createElement("canvas");

    if (Fullscreen.fullscreenAvailable())
    {
      if (fullscreen)
        Fullscreen.setFullscreen(this.$root);

      document.addEventListener("keydown", (e : KeyboardEvent) =>
      {
        if (e.keyCode !== 13)
          return;

        if (Fullscreen.isFullscreen())
        {
          Fullscreen.disableFullscreen();
        }
        else
        {
          Fullscreen.setFullscreen(this.$root);
        }
      });
    }

    let resize = () =>
    {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    while (this.$root.firstChild)
      this.$root.removeChild(this.$root.firstChild);

    this.$root.appendChild(canvas);
    let renderer = new Renderer(canvas);
    let game = new Game(this.$root, canvas, renderer);
    game.start(60);
  }
};