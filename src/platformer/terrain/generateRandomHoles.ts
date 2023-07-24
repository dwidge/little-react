import { rand, randInt, vec2, Vector2 } from "../../../lib/little";
import { tileType_empty } from "..";
import { setTile } from "../setTile";

export function generateRandomHoles(
  levelSize: Vector2,
  tileCollision: number[]
) {
  return Array(levelSize.x)
    .fill(0)
    .map(() => generateRandomHole(levelSize, tileCollision));
}

export function generateRandomHole(
  levelSize: Vector2,
  tileCollision: number[]
) {
  const pos = vec2(rand(levelSize.x), rand(levelSize.y / 2, 9));
  const size = vec2(randInt(19, 1), randInt(19, 1));
  const offset = vec2();
  for (offset.x = size.x; --offset.x; )
    for (offset.y = size.y; --offset.y; )
      setTile(levelSize, tileCollision, pos.add(offset), tileType_empty);
  return pos;
}
