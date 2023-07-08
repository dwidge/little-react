import {
  rand,
  randColor,
  vec2,
  Color,
  tileCollisionSize,
  initTileCollision,
  setTileCollisionData,
  tileCollisionRaycast,
  frameRate,
  engineObjectsUpdate,
  engineObjectsDestroy,
  Vector2,
  setTileCollision,
} from "../../lib/little";

import {
  initParallaxLayers,
  decorateBackgroundTile,
  decorateTile,
  level,
  getTileBackgroundData,
  tileBackground,
} from ".";
import { initSky } from "./drawSky";
import { Player } from "./player";
import { buildTerrain } from "./buildTerrain";
import { makeTileLayers } from "./makeTileLayers";

function calcPlayerStart(levelSize: Vector2) {
  const playerStartPos = vec2(rand(levelSize.x), levelSize.y);
  const raycastHit = tileCollisionRaycast(
    playerStartPos,
    vec2(playerStartPos.x, 0)
  );
  return raycastHit.add(vec2(0, 1));
}

export default function buildLevel() {
  const levelSize = vec2(256);
  const levelColor = randColor(
    new Color(0.2, 0.2, 0.2),
    new Color(0.8, 0.8, 0.8)
  );
  const levelGroundColor = levelColor
    .mutate()
    .add(new Color(0.4, 0.4, 0.4))
    .clamp();

  // clear old level
  engineObjectsDestroy();

  // randomize ground level hills
  const { tileBackground, tileCollision } = buildTerrain(levelSize);

  const sky = initSky();
  initParallaxLayers(levelColor, sky);

  // apply decoration to level tiles
  const { tileLayer, tileBackgroundLayer } = makeTileLayers(
    levelSize,
    tileBackground,
    tileCollision,
    levelColor
  );
  const pos = vec2();
  for (pos.x = levelSize.x; pos.x--; )
    for (pos.y = levelSize.y; pos.y-- > 1; ) {
      decorateBackgroundTile(pos);
      decorateTile(tileLayer, pos);
    }
  initTileCollision(levelSize);
  setTileCollision(tileCollision);

  // warm up level
  level.warmup = 1;
  for (let i = 5 * frameRate; i--; ) engineObjectsUpdate();
  level.warmup = 0;

  // spawn player
  const playerStartPos = calcPlayerStart(levelSize);
  const player = new Player(playerStartPos);

  return {
    score: 0,
    deaths: 0,
    player,
    playerStartPos,
    levelSize,
    levelColor,
    sky,
    levelGroundColor,
    tileBackground,
    tileCollision,
    warmup: 0,
    tileLayer,
    tileBackgroundLayer,
  };
}
