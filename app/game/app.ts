import { Game } from "../game/game";
import { UiManager } from "../ui/uiManager";
import { Renderer } from "../renderer/renderer";
import * as Fullscreen from "../util/fullscreen";
import { VdomNode, VdomElement, updateElementChildren } from "../vdom/vdom";
import * as Network from "../network/network";

enum AppState
{
  MainMenu,
  HostMp,
  JoinMp
};

function encodeData(data : Network.SignalData) : string
{
  return window.btoa(JSON.stringify(data));
};

function decodeData(data : string) : Network.SignalData
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

  private readyGame(fullscreen : boolean) : Game
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
    let ui = new UiManager(this.$root, canvas);
    return new Game(ui, renderer);
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
        let game = this.readyGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
        game.startSingleplayer(60);
      }),

      this.renderButton("Host multiplayer game", (e : Event) =>
      {
        this.switchState(AppState.HostMp);
        this.connection = new Network.Server((data : Network.SignalData) =>
        {
          (<HTMLTextAreaElement>document.getElementById("offer")).value = encodeData(data);
        });
      }),

      this.renderButton("Join multiplayer game", (e : Event) =>
      {
        this.switchState(AppState.JoinMp);
      }),
    );
  }

  private renderHostMpScreen() : VdomNode
  {
    return VdomElement.create("div", {},

      VdomElement.create("label", {"for" : "offer"}, "Offer:"),
      VdomElement.create("textarea", {"id" : "offer", "rows" : "10", "cols" : "50", "readonly" : true}),

      VdomElement.create("label", {"for" : "answer"}, "Answer:"),
      VdomElement.create("textarea", {"id" : "answer", "rows" : "10", "cols" : "50"}),

      VdomElement.create("ul", {},

        this.renderButton("Start", (e : Event) =>
        {
          let server = this.connection as Network.Server;
          server.acceptConnection(decodeData((<HTMLTextAreaElement>document.getElementById("answer")).value));
          server.onConnect(() =>
          {
            let game = this.readyGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
            game.startMultiplayerHost(60, 10, server);
          });
        }),

        this.renderButton("Back", (e : Event) =>
        {
          this.switchState(AppState.MainMenu);
          this.connection.destroy();
          this.connection = null;
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
      VdomElement.create("textarea", {"id" : "answer", "rows" : "10", "cols" : "50", "readonly" : true}),

      VdomElement.create("ul", {},
        this.renderButton("Generate answer", (e : Event) =>
        {
          let client = new Network.Client(decodeData((<HTMLTextAreaElement>document.getElementById("offer")).value), (data : Network.SignalData) =>
          {
            (<HTMLTextAreaElement>document.getElementById("answer")).value = encodeData(data);
          });
          client.onConnect(() =>
          {
            let game = this.readyGame((<HTMLInputElement>document.getElementById("fullscreen")).checked);
            game.startMultiplayerClient(60, 10, client);
          });
          this.connection = client;
        }),
        this.renderButton("Back", (e : Event) =>
        {
          this.switchState(AppState.MainMenu);
          if (this.connection)
          {
            this.connection.destroy();
            this.connection = null;
          }
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

  private connection : Network.Server | Network.Client = null;
  private root : VdomElement = null;
  private state : AppState = AppState.MainMenu;
};