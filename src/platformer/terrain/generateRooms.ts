import { Vector2 } from "../../../lib/little";
import { Node } from "./Node";
import { TileMap } from "../../../lib/TileMap";
import { RoomPlan } from "./RoomPlan";
import { drawRoom } from "../../../lib/drawRoom";
import { drawLadder } from "../../../lib/drawLadder";
import { getRoomPlan } from "./getRoomPlan";
import { tileType_empty, tileType_solid, tileType_ladder } from "..";

export function generateRooms(
  node: Node,
  levelSize: Vector2,
  tileCollision: number[]
) {
  const tileMap = new TileMap(levelSize, tileCollision);
  const plan = getRoomPlan(node);
  generateRoom(tileMap, plan, new Vector2(10, 10));
}

function generateRoom(tileMap: TileMap, plan: RoomPlan, offset: Vector2) {
  drawRoom(tileMap, plan.size, offset, plan.entrance, {
    empty: tileType_empty,
    solid: tileType_solid,
  });
  if (plan.children.length)
    plan.children.forEach((c, i) => {
      generateRoom(tileMap, c, offset.add(plan.offsets[i]));
      drawLadder(
        tileMap,
        offset.add(plan.offsets[i]).add(c.entrance),
        tileType_ladder
      );
    });
}
