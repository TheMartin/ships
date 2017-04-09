export type VdomNode = string | VdomElement;

interface PropMap
{
  [propName : string] : string;
};

export class VdomElement
{
  constructor(
    public type : string,
    public props : PropMap,
    public children : VdomNode[]
    )
  {
  }

  static create(type : string, props : { [propName : string] : string }, children : VdomNode[]) : VdomElement
  {
    return { type, props, children };
  }
};

function setProp($target : HTMLElement, name : string, value : string) : void
{
  $target.setAttribute(name, value);
}

function setProps($target : HTMLElement, props : PropMap) : void
{
  Object.keys(props).forEach(name => setProp($target, name, props[name]));
}

function removeProp($target : HTMLElement, name : string, oldValue : string) : void
{
  $target.removeAttribute(name);
}

function updateProp($target : HTMLElement, name : string, newValue : string, oldValue : string) : void
{
  if (!newValue)
  {
    removeProp($target, name, oldValue);
  }
  else if (!oldValue || oldValue !== newValue)
  {
    setProp($target, name, newValue);
  }
}

function updateProps($target : HTMLElement, newProps : PropMap, oldProps : PropMap = {}) : void
{
  const props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach(name => updateProp($target, name, newProps[name], oldProps[name]));
}

function isElement(node : VdomNode) : node is VdomElement
{
  return (<VdomElement>node).type !== undefined;
}

export function createElement(node : VdomNode) : Node
{
  if (typeof node === "string")
  {
    return document.createTextNode(node);
  }
  else
  {
    const $element = document.createElement(node.type);
    setProps($element, node.props);
    node.children.map(createElement).forEach($child => $element.appendChild($child));
    return $element;
  }
}

function nodeTypeChanged(newNode : VdomNode, oldNode : VdomNode)
{
  return typeof newNode !== typeof oldNode
    || typeof newNode === "string" && (<string>newNode) !== (<string>oldNode)
    || (<VdomElement>newNode).type !== (<VdomElement>oldNode).type;
}

export function updateElementChildren($element : HTMLElement, newNode : VdomElement, oldNode : VdomElement) : void
{
  for (let i = 0; i < Math.min(newNode.children.length, oldNode.children.length); ++i)
  {
    if (nodeTypeChanged(newNode.children[i], oldNode.children[i]))
    {
      $element.replaceChild(createElement(newNode.children[i]), $element.childNodes[i]);
    }
    else if (isElement(newNode.children[i]))
    {
      updateProps($element.childNodes[i] as HTMLElement, (<VdomElement>newNode.children[i]).props, (<VdomElement>oldNode.children[i]).props);
      updateElementChildren($element.childNodes[i] as HTMLElement, newNode.children[i] as VdomElement, oldNode.children[i] as VdomElement);
    }
  }
  if (oldNode.children.length > newNode.children.length)
  {
    for (let i = oldNode.children.length - 1; i >= newNode.children.length; --i)
      $element.removeChild($element.childNodes[i]);
  }
  else if (newNode.children.length > oldNode.children.length)
  {
    for (let i = oldNode.children.length; i < newNode.children.length; ++i)
      $element.appendChild(createElement(newNode.children[i]));
  }
}