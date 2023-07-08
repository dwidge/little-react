import { clamp, rand, randInt, vec2, Vector2 } from "../../lib/little";
import { Crate } from "./Crate";
import { Enemy } from "./Enemy";
import { tileType_empty, tileType_solid, tileType_ladder } from ".";
import { setTile, getTile } from "./setTile";

export function buildTerrain(levelSize: Vector2) {
  const tileBackground: number[] = [];
  const tileCollision: number[] = [];

  generateGroundLevel(levelSize, tileBackground, tileCollision);
  generateRandomHoles(levelSize, tileCollision);
  generateLadders(levelSize, tileCollision);
  spawnCrates(levelSize);
  spawnEnemies(levelSize);

  return { tileBackground, tileCollision };
}

function generateGroundLevel(
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

function generateRandomHoles(levelSize: Vector2, tileCollision: number[]) {
  for (let i = levelSize.x; i--; ) {
    const pos = vec2(rand(levelSize.x), rand(levelSize.y / 2, 9));
    const height = randInt(19, 1);
    const offset = vec2();
    for (offset.x = randInt(19, 1); --offset.x; )
      for (offset.y = height; --offset.y; )
        setTile(levelSize, tileCollision, pos.add(offset), tileType_empty);
  }
}

function generateLadders(levelSize: Vector2, tileCollision: number[]) {
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

function spawnCrates(levelSize: Vector2) {
  for (let crateCount = 100; crateCount--; )
    new Crate(vec2(randInt(levelSize.x) + 0.5, randInt(levelSize.y)));
}

function spawnEnemies(levelSize: Vector2) {
  for (let enemyCount = 10; enemyCount--; )
    new Enemy(vec2(rand(levelSize.x), rand(levelSize.y)));
}
