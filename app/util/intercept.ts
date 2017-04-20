import { Vec2, dot, norm2 } from "../vec2/vec2";

export function interceptVector(targetPos : Vec2, targetVel : Vec2, initialPos : Vec2, speed : number) : Vec2
{
  if (speed <= 0)
    return null;

  const toTarget = targetPos.clone().subtract(initialPos);
  const a = norm2(targetVel) - speed * speed;
  const b = 2 * dot(targetVel, toTarget);
  const c = norm2(toTarget);

  if (a == 0)
  {
    const t = -c/b;
    return t > 0 ? toTarget.multiply(1/t).add(targetVel).normalize().multiply(speed) : null;
  }

  const D = b * b - 4 * a * c;
  if (D < 0)
    return null;

  const t1 = (-b - Math.sqrt(D)) / (2 * a);
  const t2 = (-b + Math.sqrt(D)) / (2 * a);
  const t = t1 > 0 && t1 > t2 ? t1 : t2;
  return t > 0 ? toTarget.multiply(1/t).add(targetVel).normalize().multiply(speed) : null;
};