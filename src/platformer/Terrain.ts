import { EngineObject, Vector2 } from "../../lib/little";

export type Terrain = {
  levelSize: Vector2;
  playerStartPos: Vector2;
  tileBackground: number[];
  tileCollision: number[];
  objects: EngineObject[];
};
