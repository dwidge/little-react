import { rand, vec2, tileCollisionRaycast, Vector2 } from "../../lib/little";

export function findGround(
  levelSize: Vector2,
  startPos = vec2(rand(levelSize.x), levelSize.y)
) {
  const raycastHit = tileCollisionRaycast(startPos, vec2(startPos.x, 0));
  return raycastHit.add(vec2(0, 1));
}
