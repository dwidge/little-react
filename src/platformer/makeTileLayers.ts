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

export function makeTileLayers(
  levelSize: Vector2,
  tileBackground: number[],
  tileCollision: number[],
  levelColor: Color
) {
  return {
    tileLayer: makeForegroundLayer(levelSize, tileBackground, levelColor),
    tileBackgroundLayer: glEnable
      ? makeBackgroundLayer(levelSize, tileCollision, levelColor)
      : undefined,
  };
}

export function makeForegroundLayer(
  levelSize: Vector2,
  tileBackground: number[],
  levelColor: Color
) {
  const tileLayer = new TileLayer(vec2(), levelSize);
  tileLayer.renderOrder = -1000;

  const pos = vec2();
  for (pos.x = levelSize.x; pos.x--; )
    for (pos.y = levelSize.y; pos.y--; ) {
      const tileType = getTile(levelSize, tileBackground, pos);
      if (tileType) {
        let direction, mirror, tileIndex, color;
        if (tileType == tileType_solid) {
          tileIndex = (5 + rand() ** 3 * 2) | 0;
          color = levelColor.mutate(0.03);
          direction = randInt(4);
          mirror = randInt(2);
        } else if (tileType == tileType_ladder) tileIndex = 7;

        const data = new TileLayerData(tileIndex, direction, !!mirror, color);
        tileLayer.setData(pos, data);
      }
    }
  tileLayer.redraw();

  return tileLayer;
}

export function makeBackgroundLayer(
  levelSize: Vector2,
  tileCollision: number[],
  levelColor: Color
) {
  const tileBackgroundLayer = new TileLayer(vec2(), levelSize);
  tileBackgroundLayer.renderOrder = -2000;

  const pos = vec2();
  for (pos.x = levelSize.x; pos.x--; )
    for (pos.y = levelSize.y; pos.y--; ) {
      const tileType = getTile(levelSize, tileCollision, pos);
      if (tileType) {
        const data = new TileLayerData(
          (5 + rand() ** 3 * 2) | 0,
          randInt(4),
          !!randInt(2),
          levelColor.mutate().scale(0.4, 1)
        );
        tileBackgroundLayer.setData(pos, data);
      }
    }
  tileBackgroundLayer.redraw();

  return tileBackgroundLayer;
}
