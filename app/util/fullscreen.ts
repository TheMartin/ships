export function fullscreenAvailable() : boolean
{
  if ("fullscreenEnabled" in document)
  {
    return document.fullscreenEnabled;
  }
  else if ("webkitFullscreenEnabled" in document)
  {
    return document.webkitFullscreenEnabled;
  }
  else if ("mozFullScreenEnabled" in document)
  {
    return (<any>document).mozFullScreenEnabled;
  }

  return false;
};

export function setFullscreen(element : HTMLElement) : boolean
{
  if ("fullscreenElement" in document)
  {
    if (document.fullscreenElement)
      return false;

    element.requestFullscreen();
    return true;
  }
  else if ("webkitFullscreenElement" in document)
  {
    if (document.webkitFullscreenElement)
      return false;

    element.webkitRequestFullscreen();
    return true;
  }
  else if ("mozFullScreenElement" in document)
  {
    if ((<any>document).mozFullScreenElement)
      return false;

    (<any>element).mozRequestFullScreen();
    return true;
  }

  return false;
};

export function disableFullscreen() : void
{
  if (document.fullscreenElement && document.exitFullscreen)
  {
    document.exitFullscreen();
  }
  else if (document.webkitFullscreenElement && document.webkitExitFullscreen)
  {
    document.webkitExitFullscreen();
  }
  else if ((<any>document).mozFullScreenElement && (<any>document).mozCancelFullScreen)
  {
    (<any>document).mozCancelFullScreen();
  }
};

export function isFullscreen() : boolean
{
  return document.fullscreenElement || document.webkitFullscreenElement || (<any>document).mozFullScreenElement;
};