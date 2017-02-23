export class Vec2
{
  constructor(public x : number, public y : number) {}

  clone() : Vec2
  {
    return new Vec2(this.x, this.y);
  }

  add(v : Vec2) : Vec2
  {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v : Vec2) : Vec2
  {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multiply(s : number) : Vec2
  {
    this.x *= s;
    this.y *= s;
    return this;
  }

  elementMultiply(v : Vec2) : Vec2
  {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  elementDivide(v : Vec2) : Vec2
  {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  negate() : Vec2
  {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  normalize() : Vec2
  {
    return this.multiply(1 / norm(this));
  }

  normalized() : Vec2
  {
    return this.clone().normalize();
  }

  static lerp(v1 : Vec2, v2 : Vec2, alpha : number) : Vec2
  {
    return v1.clone().multiply(1 - alpha).add(v2.clone().multiply(alpha));
  }
};

export function dot(v1 : Vec2, v2 : Vec2) : number
{
  return v1.x * v2.x + v1.y * v2.y;
};

export function norm2(v : Vec2) : number
{
  return dot(v, v);
};

export function norm(v : Vec2) : number
{
  return Math.sqrt(norm2(v));
};

export function lerp(x1 : number, x2 : number, alpha : number) : number
{
  return (1 - alpha) * x1 + alpha * x2;
};