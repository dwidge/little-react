import {
  rand,
  randInt,
  vec2,
  Color,
  glEnable,
  TileLayerData,
  TileLayer,
  Vector2,
} from "../../lib/little";
import { tileType_solid, tileType_ladder } from ".";
import { getTile } from "./setTile";
import { mapXY } from "./mapXY";

export function makeTileLayers(
  levelSize: Vector2,
  tileBackground: number[],
  tileCollision: number[],
  levelColor: Color
) {
  return {
    tileLayer: makeForegroundLayer(levelSize, tileCollision, levelColor),
    tileBackgroundLayer: !glEnable
      ? makeBackgroundLayer(levelSize, tileBackground, levelColor)
      : undefined,
  };
}

export function makeForegroundLayer(
  levelSize: Vector2,
  tileCollision: number[],
  levelColor: Color
) {
  const tileLayer = new TileLayer(vec2(), levelSize);
  tileLayer.renderOrder = -1000;

  tileLayer.data = mapXY(levelSize, (pos) => {
    const tileType = getTile(levelSize, tileCollision, pos);
    if (tileType == tileType_solid) {
      const tileIndex = (5 + rand() ** 3 * 2) | 0;
      const color = levelColor.mutate(0.03);
      const direction = randInt(4);
      const mirror = randInt(2);
      return new TileLayerData(tileIndex, direction, !!mirror, color);
    } else if (tileType == tileType_ladder) return new TileLayerData(7);
    return new TileLayerData(0);
  });
  tileLayer.redraw();

  return tileLayer;
}

export function makeBackgroundLayer(
  levelSize: Vector2,
  tileBackground: number[],
  levelColor: Color
) {
  const tileBackgroundLayer = new TileLayer(vec2(), levelSize);
  tileBackgroundLayer.renderOrder = -2000;

  tileBackgroundLayer.data = mapXY(levelSize, (pos) => {
    const tileType = getTile(levelSize, tileBackground, pos);
    if (tileType)
      return new TileLayerData(
        (5 + rand() ** 3 * 2) | 0,
        randInt(4),
        !!randInt(2),
        levelColor.mutate().scale(0.4, 1)
      );
    return new TileLayerData(0);
  });
  tileBackgroundLayer.redraw();

  return tileBackgroundLayer;
}
