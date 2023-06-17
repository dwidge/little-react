import {
  clamp,
  // Random
  rand,
  randInt,
  randColor,
  // More utilities
  vec2,
  Color,
  glEnable,
  initTileCollision,
  setTileCollisionData,
  getTileCollisionData,
  tileCollisionRaycast,
  TileLayerData,
  TileLayer,
  frameRate,
  engineObjectsUpdate,
  engineObjectsDestroy,
} from "../../lib/little";
import { Crate } from "./Crate";
import { Enemy } from "./Enemy";
import {
  initSky,
  initParallaxLayers,
  decorateBackgroundTile,
  decorateTile,
  level,
} from ".";
import {
  tileType_empty,
  tileType_solid,
  setTileBackgroundData,
  tileType_ladder,
  tileLayer,
  tileBackgroundLayer,
  getTileBackgroundData,
  levelGroundColor,
  warmup,
  spawnPlayer,
} from ".";

///////////////////////////////////////////////////////////////////////////////
// level generation

export function buildTerrain(size) {
  level.tileBackground = [];
  const { levelSize } = level;
  initTileCollision(size);
  let startGroundLevel = 40;
  let groundLevel = startGroundLevel;
  let groundSlope = rand(-1, 1);
  let backgroundDelta = 0,
    backgroundDeltaSlope = 0;
  for (let x = 0; x < size.x; x++) {
    // pull slope towards start ground level
    groundLevel += groundSlope =
      rand() < 0.05
        ? rand(-1, 1)
        : groundSlope + (startGroundLevel - groundLevel) / 1000;

    // small jump
    if (rand() < 0.04) groundLevel += rand(9, -9);

    if (rand() < 0.03) {
      // big jump
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

    groundLevel = clamp(groundLevel, 20, level.levelSize.y - 20);
    for (let y = 0; y < size.y; y++) {
      const pos = vec2(x, y);

      let frontTile = tileType_empty;
      if (y < groundLevel) frontTile = tileType_solid;

      let backTile = tileType_empty;
      if (y < groundLevel + backgroundDelta) backTile = tileType_solid;

      setTileCollisionData(pos, frontTile);
      setTileBackgroundData(pos, backTile);
    }
  }

  // add random holes
  for (let i = levelSize.x; i--; ) {
    const pos = vec2(rand(levelSize.x), rand(levelSize.y / 2, 9));
    const height = randInt(19, 1);
    const offset = vec2();
    for (offset.x = randInt(19, 1); --offset.x; )
      for (offset.y = height; --offset.y; )
        setTileCollisionData(pos.add(offset), tileType_empty);
  }

  // add ladders
  for (let ladderCount = 40; ladderCount--; ) {
    // pick random pos
    const pos = vec2(randInt(levelSize.x), randInt(levelSize.y));

    // find good place to put ladders
    let state = 0,
      ladderTop;
    for (; pos.y > 9; --pos.y) {
      const data = getTileCollisionData(pos);
      if (state == 0 || state == 2)
        data || state++; // found empty, go to next state
      else if (state == 1) {
        data && state++; // found solid, go to next state
        ladderTop = pos.y;
      } else if (state == 3 && data) {
        // found solid again, build ladder
        for (; ++pos.y <= ladderTop; )
          setTileCollisionData(pos, tileType_ladder);
        break;
      }
    }
  }

  // spawn crates
  for (let crateCount = 100; crateCount--; )
    new Crate(vec2(randInt(levelSize.x) + 0.5, randInt(levelSize.y)));

  // spawn enemies
  for (let enemyCount = 10; enemyCount--; )
    new Enemy(vec2(rand(levelSize.x), rand(levelSize.y)));
}

export function generateLevel() {
  // clear old level
  engineObjectsDestroy();

  // randomize ground level hills
  buildTerrain(level.levelSize);

  // find starting poing for player
  level.playerStartPos = vec2(rand(level.levelSize.x), level.levelSize.y);
  const raycastHit = tileCollisionRaycast(
    level.playerStartPos,
    vec2(level.playerStartPos.x, 0)
  );
  level.playerStartPos = raycastHit.add(vec2(0, 1));
}

export function makeTileLayers() {
  const { levelSize } = level;
  // create tile layers
  level.tileLayer = new TileLayer(vec2(), levelSize);
  level.tileBackgroundLayer = new TileLayer(vec2(), levelSize);
  const { tileLayer, tileBackgroundLayer } = level;
  tileLayer.renderOrder = -1000;
  tileBackgroundLayer.renderOrder = -2000;

  const pos = vec2();
  for (pos.x = levelSize.x; pos.x--; )
    for (pos.y = levelSize.y; pos.y--; ) {
      // foreground tiles
      let tileType = getTileCollisionData(pos);
      if (tileType) {
        let direction, mirror, tileIndex, color;
        if (tileType == tileType_solid) {
          tileIndex = (5 + rand() ** 3 * 2) | 0;
          color = level.levelColor.mutate(0.03);
          direction = randInt(4);
          mirror = randInt(2);
        } else if (tileType == tileType_ladder) tileIndex = 7;

        const data = new TileLayerData(tileIndex, direction, mirror, color);
        tileLayer.setData(pos, data);
      }

      // background tiles
      tileType = getTileBackgroundData(pos);
      if (tileType) {
        const data = new TileLayerData(
          (5 + rand() ** 3 * 2) | 0,
          randInt(4),
          randInt(2),
          level.levelColor.mutate().scale(0.4, 1)
        );
        tileBackgroundLayer.setData(pos, data);
      }
    }
  tileLayer.redraw();
  tileBackgroundLayer.redraw();

  if (!glEnable) {
    // get rid of background if webgl is not enabled
    tileBackgroundLayer.destroy();
    level.tileBackgroundLayer = 0;
  }
}

export function buildLevel() {
  level.levelSize = vec2(256);
  level.levelColor = randColor(
    new Color(0.2, 0.2, 0.2),
    new Color(0.8, 0.8, 0.8)
  );
  level.levelGroundColor = level.levelColor
    .mutate()
    .add(new Color(0.4, 0.4, 0.4))
    .clamp();

  generateLevel();
  initSky();
  initParallaxLayers();

  // apply decoration to level tiles
  makeTileLayers();
  const pos = vec2();
  for (pos.x = level.levelSize.x; pos.x--; )
    for (pos.y = level.levelSize.y; pos.y-- > 1; ) {
      decorateBackgroundTile(pos);
      decorateTile(pos);
    }

  // warm up level
  level.warmup = 1;
  for (let i = 5 * frameRate; i--; ) engineObjectsUpdate();
  level.warmup = 0;

  // spawn player
  spawnPlayer();
}
