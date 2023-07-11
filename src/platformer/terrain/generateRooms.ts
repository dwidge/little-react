import { vec2, Vector2 } from "../../../lib/little";
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

import { tileType_empty, tileType_solid } from "..";
import { setTile } from "../setTile";

function generateRoom(
  node: Node,
  roomSize: Vector2,
  roomPosition: Vector2,
  levelSize: Vector2,
  tileCollision: number[]
) {
  // Generate walls around the room
  for (let x = 0; x < roomSize.x; x++) {
    for (let y = 0; y < roomSize.y; y++) {
      const pos = vec2(roomPosition.x + x, roomPosition.y + y);

      // Check if the position is on the room borders
      const isBorder =
        x === 0 || y === 0 || x === roomSize.x - 1 || y === roomSize.y - 1;

      // Set the appropriate tile type based on whether it's a border or not
      const tileType = isBorder ? tileType_solid : tileType_empty;

      setTile(levelSize, tileCollision, pos, tileType);
    }
  }

  // Recursively generate rooms for child nodes
  if (node.children.length > 0) {
    const childRoomWidth = Math.floor(roomSize.x / node.children.length);
    const childRoomHeight = Math.floor(roomSize.y / node.children.length);

    for (let i = 0; i < node.children.length; i++) {
      const childRoomX =
        roomPosition.x + Math.floor(i % node.children.length) * childRoomWidth;
      const childRoomY =
        roomPosition.y + Math.floor(i / node.children.length) * childRoomHeight;
      const childRoomSize = vec2(childRoomWidth, childRoomHeight);

      generateRoom(
        node.children[i],
        childRoomSize,
        vec2(childRoomX, childRoomY),
        levelSize,
        tileCollision
      );
    }
  }
}
