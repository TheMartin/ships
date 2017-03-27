import { Game } from "./game/game";
import { Renderer } from "./renderer/renderer";
import { UiManager } from "./ui/uiManager";

let content = document.getElementById("content");
let canvas = document.createElement("canvas");
content.addEventListener("contextmenu", (e : Event) => { e.preventDefault(); });
let resize = () =>
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);
content.appendChild(canvas);
let renderer = new Renderer(canvas);
let ui = new UiManager(content, canvas);
let game = new Game(ui, renderer);
game.start(60);