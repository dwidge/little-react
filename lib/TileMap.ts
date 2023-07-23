import { Vector2 } from "./little";
import { getTile, setTile } from "../src/platformer/setTile";

export class TileMap {
  public levelSize: Vector2;
  public tileCollision: number[];
  constructor(levelSize: Vector2, tileCollision: number[]) {
    this.levelSize = levelSize;
    this.tileCollision = tileCollision;
  }
  setTile(pos: Vector2, tileType: number) {
    setTile(this.levelSize, this.tileCollision, pos, tileType);
  }
  getTile(pos: Vector2): number {
    return getTile(this.levelSize, this.tileCollision, pos);
  }
}
