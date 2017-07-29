# Ships

A HTML5 game about ships in space, cobbled together on weekends and particularly boring nights. Current version playable [here!](http://themartin.github.io/ships/)

It's a work in progress.

## How to build

* Install [node.js](https://nodejs.org/)
* Clone this repo
* `npm install`
* `npm start` to launch dev version in browser
* `npm run build` to build a static version in `\dist`

## How to play

* Select the _Start singleplayer game_ for a scenario playing against the AI.
* Select the _Host multiplayer game_ for a 1v1 multiplayer scenario.
** To run multiplayer, the hosting player should send the generated _Offer_ to the joining player.
** The joining player should paste the offer into the _Offer_ box and select _Generate answer_.
** Then, the joining player should send the generated _Answer_ back to the hosting player.
** The hosting player should paste the answer into the _Answer_ box.
** The game will launch when the hosting player selects _Start_.
* Optionally, tick the _Start fullscreen_ option to launch the game in fullscreen mode.
* Once in-game, use the following controls:
** Move the mouse towards viewport borders, or right-click-drag to move the viewport.
** Use the scrollwheel to zoom in or out.
** Left-click on friendly ships to select them.
** Left-click-drag to create a selection box to select multiple ships.
** Right-click into empty space to order selected ships to move there.
** Right-click on hostile ships to order selected ships to engage them.
** When selected, left-click into empty space to cancel selection.
** Press the _G_ key to order selected ships to form a squadron.
** Press the _S_ key to order selected squadrons to split into individual ships.
