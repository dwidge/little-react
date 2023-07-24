import {
  randColor,
  vec2,
  Color,
  initTileCollision,
  frameRate,
  engineObjectsUpdate,
  setTileCollision,
} from "../../lib/little";

import { Level, initParallaxLayers, level } from ".";
import { decorateBackgroundTile } from "./decorateBackgroundTile";
import { decorateTile } from "./decorateTile";
import { initSky } from "./drawSky";
import { makeTileLayers } from "./makeTileLayers";
import { Terrain } from "./Terrain";

export default function buildLevel(terrain: Terrain): Partial<Level> {
  const levelColor = randColor(
    new Color(0.2, 0.2, 0.2),
    new Color(0.8, 0.8, 0.8)
  );
  const levelGroundColor = levelColor
    .mutate()
    .add(new Color(0.4, 0.4, 0.4))
    .clamp();

  // randomize ground level hills
  const {
    levelSize,
    tileBackground,
    tileCollision,
    playerStartPos,
    destructible,
  } = terrain;
  initTileCollision(levelSize);
  setTileCollision(tileCollision);

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
      decorateTile(tileLayer, pos, tileCollision, levelSize, levelGroundColor);
    }
  initTileCollision(levelSize);
  setTileCollision(tileCollision);

  // warm up level
  level.warmup = 1;
  for (let i = 5 * frameRate; i--; ) engineObjectsUpdate();
  level.warmup = 0;

  return {
    destructible,
    score: 0,
    deaths: 0,
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
