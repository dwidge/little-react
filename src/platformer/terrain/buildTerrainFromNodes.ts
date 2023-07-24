import { Vector2 } from "../../../lib/little";
import { fillGround } from "./fillGround";
import { spawnCrates } from "./spawnCrates";
import { spawnEnemies } from "./spawnEnemies";
import { generateRooms } from "./generateRooms";
import { tileType_solid } from "platformer";
import { Terrain } from "platformer/Terrain";
import { Node } from "./Node";

export function buildTerrainFromNodes(
  levelSize: Vector2,
  rootNode: Node
): Terrain {
  const tileBackground: number[] = [];
  const tileCollision: number[] = [];

  fillGround(
    levelSize,
    tileBackground,
    tileCollision,
    tileType_solid,
    tileType_solid
  );
  const playerStartPos = generateRooms(rootNode, levelSize, tileCollision);
  const crates = spawnCrates(levelSize);
  const enemies = spawnEnemies(levelSize);

  return {
    levelSize,
    playerStartPos,
    tileBackground,
    tileCollision,
    objects: [...crates, ...enemies],
  };
}
