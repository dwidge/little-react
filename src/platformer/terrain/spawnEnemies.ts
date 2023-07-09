import { rand, vec2, Vector2 } from "../../../lib/little";
import { Enemy } from "../Enemy";

export function spawnEnemies(levelSize: Vector2) {
  for (let enemyCount = 10; enemyCount--; )
    new Enemy(vec2(rand(levelSize.x), rand(levelSize.y)));
}
