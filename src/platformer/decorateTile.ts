import {
  ASSERT,
  // Utilities
  PI, // Add get/set
  // More utilities
  vec2,
  getTileCollisionData,
  TileLayerData,
  Vector2,
  Color,
  TileLayer,
} from "../../lib/little";

export function decorateTile(
  tileLayer: TileLayer,
  pos: Vector2,
  _tileCollision: number[],
  _tileCollisionSize: Vector2,
  levelGroundColor: Color
) {
  ASSERT((pos.x | 0) == pos.x && (pos.y | 0) == pos.y);
  const tileData = getTileCollisionData(pos);
  if (tileData <= 0) {
    tileData || tileLayer.setData(pos, new TileLayerData(), true); // force it to clear if it is empty
    return;
  }

  if (!tileLayer.context) return;
  for (let i = 4; i--; ) {
    // outline towards neighbors of differing type
    const neighborTileData = getTileCollisionData(
      pos.add(vec2().setAngle((i * PI) / 2))
    );
    if (neighborTileData == tileData) continue;

    // make pixel perfect outlines
    const size = i & 1 ? vec2(2, 16) : vec2(16, 2);
    tileLayer.context.fillStyle = levelGroundColor.mutate(0.1).toString();
    const drawPos = pos
      .scale(16)
      .add(vec2(i == 1 ? 14 : 0, i == 0 ? 14 : 0))
      .subtract(i & 1 ? vec2(0, 8 - size.y / 2) : vec2(8 - size.x / 2, 0));
    tileLayer.context.fillRect(
      drawPos.x,
      tileLayer.canvas.height - drawPos.y,
      size.x,
      -size.y
    );
  }
}
