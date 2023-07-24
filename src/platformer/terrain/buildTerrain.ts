import { Vector2 } from "../../../lib/little";
import { generateGroundLevel } from "./generateGroundLevel";
import { generateRandomHoles } from "./generateRandomHoles";
import { generateLadders } from "./generateLadders";
import { spawnCrates } from "./spawnCrates";
import { spawnEnemies } from "./spawnEnemies";
import { Terrain } from "platformer/Terrain";

export function buildTerrain(levelSize: Vector2): Terrain {
  const tileBackground: number[] = [];
  const tileCollision: number[] = [];

  generateGroundLevel(levelSize, tileBackground, tileCollision);
  const holes = generateRandomHoles(levelSize, tileCollision);
  generateLadders(levelSize, tileCollision);
  const crates = spawnCrates(levelSize);
  const enemies = spawnEnemies(levelSize);
  const playerStartPos = holes[0];

  return {
    levelSize,
    playerStartPos,
    destructible: true,
    tileBackground,
    tileCollision,
    objects: [...crates, ...enemies],
  };
}
