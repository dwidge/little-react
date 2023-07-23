import { Vector2 } from "../../../lib/little";

export type RoomPlan = {
  size: Vector2;
  entrance: Vector2;
  children: RoomPlan[];
  offsets: Vector2[];
};
