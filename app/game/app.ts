import { Game } from "../game/game";
import { Renderer } from "../renderer/renderer";
import * as Fullscreen from "../util/fullscreen";
import { VdomNode, VdomElement, updateElementChildren } from "../vdom/vdom";
import * as SimplePeer from "simple-peer";

enum AppState
{
  MainMenu,
  HostMp,
  JoinMp
};

function encodeData(data : SimplePeer.SignalData) : string
{
  return window.btoa(JSON.stringify(data));
};

function decodeData(data : string) : SimplePeer.SignalData
{
  return JSON.parse(window.atob(data));
};

export class App
{
  private constructor(private $root : HTMLElement)
  {
    this.root = VdomElement.create(this.$root.tagName, {});
    this.render();
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

  private render() : void
  {
    let elems = VdomElement.create(this.$root.tagName, {},
      VdomElement.create("div", {"class" : "title"}, "Ships"),

      VdomElement.create("div", {"class" : "menu"},
      {
        [AppState.MainMenu] : () => this.renderMainMenu(),
        [AppState.HostMp] : () => this.renderHostMpScreen(),
        [AppState.JoinMp] : () => this.renderJoinMpScreen()
      }[this.state]()),

      VdomElement.create("div", {"class" : "fullscreen"},
        VdomElement.create("input", {"id" : "fullscreen", "type" : "checkbox"}),
        VdomElement.create("label", {"for" : "fullscreen"}, "Start fullscreen")
      )
    );

    updateElementChildren(this.$root, elems, this.root);
    this.root = elems;
  }

  private renderMainMenu() : VdomNode
  {
    return VdomElement.create("ul", {},

      this.renderButton("Start singleplayer game", (e : Event) =>
      {
        this.runGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
      }),

      this.renderButton("Host multiplayer game", (e : Event) =>
      {
        this.switchState(AppState.HostMp);
        this.peer = SimplePeer({ initiator : true, trickle : false });
        this.peer.on('signal', (data : SimplePeer.SignalData) =>
        {
          (<HTMLTextAreaElement>document.getElementById("offer")).value = encodeData(data);
        });
      }),

      this.renderButton("Join multiplayer game", (e : Event) =>
      {
        this.switchState(AppState.JoinMp);
        this.peer = SimplePeer({ trickle : false });
        this.peer.on('signal', (data : SimplePeer.SignalData) =>
        {
          (<HTMLTextAreaElement>document.getElementById("answer")).value = encodeData(data);
        });
        this.peer.on('connect', () =>
        {
          this.runGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
        });
      }),
    );
  }

  private renderHostMpScreen() : VdomNode
  {
    return VdomElement.create("div", {},

      VdomElement.create("label", {"for" : "offer"}, "Offer:"),
      VdomElement.create("textarea", {"id" : "offer", "rows" : "10", "cols" : "50"}),

      VdomElement.create("label", {"for" : "answer"}, "Answer:"),
      VdomElement.create("textarea", {"id" : "answer", "rows" : "10", "cols" : "50"}),

      VdomElement.create("ul", {},

        this.renderButton("Start", (e : Event) =>
        {
          this.peer.signal(decodeData((<HTMLTextAreaElement>document.getElementById("answer")).value));
          this.peer.on('connect', () =>
          {
            this.runGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
          });
        }),

        this.renderButton("Back", (e : Event) =>
        {
          this.switchState(AppState.MainMenu);
          this.peer.destroy();
          this.peer = null;
        })
      )
    );
  }

  private renderJoinMpScreen() : VdomNode
  {
    return VdomElement.create("div", {},

      VdomElement.create("label", {"for" : "offer"}, "Offer:"),
      VdomElement.create("textarea", {"id" : "offer", "rows" : "10", "cols" : "50"}),

      VdomElement.create("label", {"for" : "answer"}, "Answer:"),
      VdomElement.create("textarea", {"id" : "answer", "rows" : "10", "cols" : "50"}),

      VdomElement.create("ul", {},
        this.renderButton("Generate answer", (e : Event) =>
        {
          this.peer.signal(decodeData((<HTMLTextAreaElement>document.getElementById("offer")).value));
        }),
        this.renderButton("Back", (e : Event) =>
        {
          this.switchState(AppState.MainMenu);
          this.peer.destroy();
          this.peer = null;
        })
      )
    );
  }

  private renderButton(text : string, onclick : (e : Event) => void) : VdomNode
  {
    return VdomElement.create("li", {},
      VdomElement.create("a", {
        "href" : "",
        "class" : "btn",
        "onclick" : (e : Event) =>
        {
          onclick(e);
          e.preventDefault();
        }
      }, text)
    );
  }

  private switchState(state : AppState) : void
  {
    if (this.state !== state)
    {
      this.state = state;
      this.render();
    }
  }

  private peer : SimplePeer.Instance = null;
  private root : VdomElement = null;
  private state : AppState = AppState.MainMenu;
};