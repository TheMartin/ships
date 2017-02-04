import { Game } from "./game/game";
import { Renderer } from "./renderer/renderer";

let content = document.getElementById("content");
let canvas = document.createElement("canvas");
let resize = () =>
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);
content.appendChild(canvas);
let renderer = new Renderer(canvas);
let game = new Game(renderer);
game.start(60);