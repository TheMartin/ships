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

  rotate(a : number) : Vec2
  {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const x = c * this.x - s * this.y;
    const y = s * this.x + c * this.y;
    this.x = x;
    this.y = y;
    return this;
  }

  rotated(a : number) : Vec2
  {
    return this.clone().rotate(a);
  }

  angle() : number
  {
    return Math.atan2(this.x, -this.y);
  }

  static lerp(v1 : Vec2, v2 : Vec2, alpha : number) : Vec2
  {
    return v1.clone().multiply(1 - alpha).add(v2.clone().multiply(alpha));
  }

  static random() : Vec2
  {
    return new Vec2(Math.random(), Math.random());
  }

  static fromAngle(a : number) : Vec2
  {
    return new Vec2(Math.sin(a), -Math.cos(a));
  }

  static readonly zero : Vec2 = new Vec2(0, 0);
};

export function dot(v1 : Vec2, v2 : Vec2) : number
{
  return v1.x * v2.x + v1.y * v2.y;
};

export function cross(v1 : Vec2, v2 : Vec2) : number
{
  return v1.x * v2.y - v1.y * v2.x;
};

export function norm2(v : Vec2) : number
{
  return dot(v, v);
};

export function norm(v : Vec2) : number
{
  return Math.sqrt(norm2(v));
};

export function distance2(v1 : Vec2, v2 : Vec2) : number
{
  return norm2(v1.clone().subtract(v2));
};

export function distance(v1 : Vec2, v2 : Vec2) : number
{
  return Math.sqrt(distance2(v1, v2));
};

export function lerp(x1 : number, x2 : number, alpha : number) : number
{
  return (1 - alpha) * x1 + alpha * x2;
};