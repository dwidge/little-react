import { Vector2 } from "../../lib/little";

export const getTile = (levelSize: Vector2, tiles: number[], pos: Vector2) =>
  pos.arrayCheck(levelSize)
    ? tiles[((pos.y | 0) * levelSize.x + pos.x) | 0]
    : 0;
export const setTile = (
  levelSize: Vector2,
  tiles: number[],
  pos: Vector2,
  data = 0
) =>
  pos.arrayCheck(levelSize) &&
  (tiles[((pos.y | 0) * levelSize.x + pos.x) | 0] = data);
