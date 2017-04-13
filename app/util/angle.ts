function fmod(a : number, b : number) : number
{
  return a - Math.floor(a / b) * b;
}

export function wrapAngle(a : number) : number
{
  a = fmod(a, 2 * Math.PI);
  if (a < 0)
  {
    a += 2 * Math.PI;
  }
  return a;
};

export function angleDiff(a : number, b : number) : number
{
  const diff = fmod(b - a + Math.PI, 2 * Math.PI);
  return diff + (diff < 0 ? Math.PI : -Math.PI);
};