import { Vector2 } from "../../../lib/little";
import { fillGround } from "./fillGround";
import { generateLadders } from "./generateLadders";
import { spawnCrates } from "./spawnCrates";
import { spawnEnemies } from "./spawnEnemies";
import { generateRooms } from "./generateRooms";
import { tileType_solid } from "platformer";
import { Terrain } from "platformer/Terrain";

export interface Node {
  name: string;
  children: Node[];
}

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
  generateRooms(rootNode, levelSize, tileCollision);
  generateLadders(levelSize, tileCollision);
  spawnCrates(levelSize);
  spawnEnemies(levelSize);

  return { levelSize, tileBackground, tileCollision };
}
