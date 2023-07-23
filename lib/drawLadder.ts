import { Vector2 } from "./little";
import { TileMap } from "./TileMap";

export function drawLadder(tileMap: TileMap, top: Vector2, tileType: number) {
  top = drawLadderOn(tileMap, top, tileType, (type) => !!type);
  top = drawLadderOn(tileMap, top, tileType, (type) => !type);
  return top;
}
function drawLadderOn(
  tileMap: TileMap,
  top: Vector2,
  tileType: number,
  test: (type: number) => boolean
) {
  let pos = new Vector2(top.x, top.y);
  for (; top.y - pos.y < 10; --pos.y) {
    const data = tileMap.getTile(pos);
    if (!test(data)) break;
    tileMap.setTile(pos, tileType);
  }
  return pos;
}
