import { vec2, Vector2 } from "../../lib/little";

export function mapXY<T>(size: Vector2, fn: (pos: Vector2) => T): T[] {
  const arr: T[] = [];
  for (let y = 0; y < size.y; y++)
    for (let x = 0; x < size.x; x++) arr.push(fn(vec2(x, y)));
  return arr;
}
