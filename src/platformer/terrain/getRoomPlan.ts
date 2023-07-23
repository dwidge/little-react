import { randInt, Vector2 } from "../../../lib/little";
import { Node } from "./Node";
import { RoomPlan } from "./RoomPlan";

export function getRoomPlan(node: Node): RoomPlan {
  const children = node.children.map((node) => getRoomPlan(node));
  const minSize = new Vector2(randInt(8, 4), randInt(8, 4));
  const total = children.reduce(
    (total, child) => ({
      size: new Vector2(
        total.size.x + child.size.x,
        Math.max(total.size.y, child.size.y)
      ),
      offsets: [...total.offsets, new Vector2(total.size.x, minSize.y)],
    }),
    { size: new Vector2(0, 0), offsets: [] } as Pick<
      RoomPlan,
      "size" | "offsets"
    >
  );
  const size = new Vector2(Math.max(minSize.x, total.size.x), minSize.y);
  return {
    size,
    entrance: new Vector2(randInt(size.x - 1, 1), 0),
    children,
    offsets: total.offsets,
  };
}
