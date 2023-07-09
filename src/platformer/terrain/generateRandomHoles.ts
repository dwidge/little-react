import { rand, randInt, vec2, Vector2 } from "../../../lib/little";
import { tileType_empty } from "..";
import { setTile } from "../setTile";

export function generateRandomHoles(
  levelSize: Vector2,
  tileCollision: number[]
) {
  for (let i = levelSize.x; i--; ) {
    const pos = vec2(rand(levelSize.x), rand(levelSize.y / 2, 9));
    const height = randInt(19, 1);
    const offset = vec2();
    for (offset.x = randInt(19, 1); --offset.x; )
      for (offset.y = height; --offset.y; )
        setTile(levelSize, tileCollision, pos.add(offset), tileType_empty);
  }
}
