import { clamp, rand, vec2, Vector2 } from "../../../lib/little";
import { tileType_empty, tileType_solid } from "..";
import { setTile } from "../setTile";

export function generateGroundLevel(
  levelSize: Vector2,
  tileBackground: number[],
  tileCollision: number[]
) {
  let startGroundLevel = 40;
  let groundLevel = startGroundLevel;
  let groundSlope = rand(-1, 1);
  let backgroundDelta = 0,
    backgroundDeltaSlope = 0;

  for (let x = 0; x < levelSize.x; x++) {
    groundLevel += groundSlope =
      rand() < 0.05
        ? rand(-1, 1)
        : groundSlope + (startGroundLevel - groundLevel) / 1000;

    if (rand() < 0.04) groundLevel += rand(9, -9);

    if (rand() < 0.03) {
      const jumpDelta = rand(19, -19);
      startGroundLevel = clamp(startGroundLevel + jumpDelta, 20, 80);
      groundLevel += jumpDelta;
      groundSlope = rand(-1, 1);
    }

    backgroundDelta += backgroundDeltaSlope;
    if (rand() < 0.1) backgroundDelta = rand(3, -1);
    if (rand() < 0.1) backgroundDelta = 0;
    if (rand() < 0.1) backgroundDeltaSlope = rand(-1, 1);
    backgroundDelta = clamp(backgroundDelta, -1, 3);

    groundLevel = clamp(groundLevel, 20, levelSize.y - 20);

    for (let y = 0; y < levelSize.y; y++) {
      const pos = vec2(x, y);

      let frontTile = tileType_empty;
      if (y < groundLevel) frontTile = tileType_solid;

      let backTile = tileType_empty;
      if (y < groundLevel + backgroundDelta) backTile = tileType_solid;

      setTile(levelSize, tileCollision, pos, frontTile);
      setTile(levelSize, tileBackground, pos, backTile);
    }
  }
}
