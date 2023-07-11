import { randInt, vec2, Vector2 } from "../../../lib/little";
import { Crate } from "../Crate";

export function spawnCrates(levelSize: Vector2) {
  return Array(100)
    .fill(0)
    .map(
      () => new Crate(vec2(randInt(levelSize.x) + 0.5, randInt(levelSize.y)))
    );
}
