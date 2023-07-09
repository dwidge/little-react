import { randInt, vec2, Vector2 } from "../../../lib/little";
import { tileType_ladder } from "..";
import { setTile, getTile } from "../setTile";

export function generateLadders(levelSize: Vector2, tileCollision: number[]) {
  for (let ladderCount = 40; ladderCount--; ) {
    const pos = vec2(randInt(levelSize.x), randInt(levelSize.y));
    let state = 0,
      ladderTop = 0;
    for (; pos.y > 9; --pos.y) {
      const data = getTile(levelSize, tileCollision, pos);
      if (state == 0 || state == 2) data || state++;
      else if (state == 1) {
        data && state++;
        ladderTop = pos.y;
      } else if (state == 3 && data) {
        for (; ++pos.y <= ladderTop; )
          setTile(levelSize, tileCollision, pos, tileType_ladder);
        break;
      }
    }
  }
}
