import {
  // Utilities
  PI,
  Vector2, // Add get/set
  // More utilities
  vec2,
} from "../../lib/little";
import { level, getTileBackgroundData } from "platformer";

export function decorateBackgroundTile(pos: Vector2) {
  if (!level.tileBackgroundLayer) return;

  const tileData = getTileBackgroundData(pos);
  if (tileData <= 0) return;

  // make round corners
  for (let i = 4; i--; ) {
    // check corner neighbors
    const neighborTileDataA = getTileBackgroundData(
      pos.add(vec2().setAngle((i * PI) / 2))
    );
    const neighborTileDataB = getTileBackgroundData(
      pos.add(vec2().setAngle((((i + 1) % 4) * PI) / 2))
    );
    if (neighborTileDataA > 0 || neighborTileDataB > 0) continue;

    const directionVector = vec2()
      .setAngle((i * PI) / 2 + PI / 4, 10)
      .floor();
    const drawPos = pos
      .add(vec2(0.5)) // center
      .scale(16)
      .add(directionVector)
      .floor(); // direction offset

    // clear rect without any scaling to prevent blur from filtering
    const s = 2;
    level.tileBackgroundLayer.context?.clearRect(
      drawPos.x - s / 2,
      level.tileBackgroundLayer.canvas.height - drawPos.y - s / 2,
      s,
      s
    );
  }
}
