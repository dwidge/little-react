import { vec2, Vector2 } from "../../../lib/little";
import { generateRoom } from "./generateRoom";
import { Node } from "./buildTerrainFromNodes";

export function generateRooms(
  node: Node,
  levelSize: Vector2,
  tileCollision: number[]
) {
  const roomWidth = 10;
  const roomHeight = 10;

  // Calculate the number of rooms to fit within the level size
  const maxRoomsX = Math.floor(levelSize.x / roomWidth);
  const maxRoomsY = Math.floor(levelSize.y / roomHeight);

  const roomCount = Math.min(node.children.length, maxRoomsX * maxRoomsY);

  for (let i = 0; i < roomCount; i++) {
    const roomX = Math.floor(i % maxRoomsX) * roomWidth;
    const roomY = Math.floor(i / maxRoomsX) * roomHeight;
    const roomSize = vec2(roomWidth, roomHeight);

    generateRoom(
      node.children[i],
      roomSize,
      vec2(roomX, roomY),
      levelSize,
      tileCollision
    );
  }
}
