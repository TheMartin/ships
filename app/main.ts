import { Game } from "./game/game";
import { Renderer } from "./renderer/renderer";
import { UiManager } from "./ui/uiManager";
import * as Fullscreen from "./util/fullscreen";
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
if (Fullscreen.fullscreenAvailable())
{
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
      Fullscreen.setFullscreen(content);
    }
  });  
}
content.appendChild(canvas);
let renderer = new Renderer(canvas);
let game = new Game(content, canvas, renderer);
game.start(60);