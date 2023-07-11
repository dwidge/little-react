import { rand, vec2, Vector2 } from "../../../lib/little";
import { Enemy } from "../Enemy";

export function spawnEnemies(levelSize: Vector2) {
  return Array(10)
    .fill(0)
    .map(() => new Enemy(vec2(rand(levelSize.x), rand(levelSize.y))));
}
