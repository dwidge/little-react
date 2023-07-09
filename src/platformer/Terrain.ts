import { Vector2 } from "../../lib/little";

export type Terrain = {
  levelSize: Vector2;
  tileBackground: number[];
  tileCollision: number[];
};
