import { Game } from "./game/game";
import { Renderer } from "./renderer/renderer";
import { UiManager } from "./ui/uiManager";
import "./styles/styles.css";

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
let game = new Game(content, canvas, renderer);
game.start(60);