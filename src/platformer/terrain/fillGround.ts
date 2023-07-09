import { vec2, Vector2 } from "../../../lib/little";
import { setTile } from "../setTile";

export function fillGround(
  levelSize: Vector2,
  tileBackground: number[],
  tileCollision: number[],
  frontTile: number,
  backTile: number
) {
  for (let x = 0; x < levelSize.x; x++) {
    for (let y = 0; y < levelSize.y; y++) {
      const pos = vec2(x, y);

      setTile(levelSize, tileCollision, pos, frontTile);
      setTile(levelSize, tileBackground, pos, backTile);
    }
  }
}
