import { vec2, Vector2 } from "./little";
import { TileMap } from "./TileMap";

export function drawRoom(
  tileMap: TileMap,
  roomSize: Vector2,
  roomPosition: Vector2,
  entrance: Vector2,
  tileTypes: { empty: number; solid: number }
) {
  // Generate walls around the room
  for (let x = 0; x < roomSize.x; x++) {
    for (let y = 0; y < roomSize.y; y++) {
      const pos = vec2(roomPosition.x + x, roomPosition.y + y);

      // Check if the position is on the room borders
      const isBorder =
        x === 0 || y === 0 || x === roomSize.x - 1 || y === roomSize.y - 1;

      // Set the appropriate tile type based on whether it's a border or not
      const tileType = isBorder ? tileTypes.solid : tileTypes.empty;

      tileMap.setTile(pos, tileType);
    }
  }
  tileMap.setTile(roomPosition.add(entrance), tileTypes.solid);
}
