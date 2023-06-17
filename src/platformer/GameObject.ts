import {
  ASSERT,
  max,
  percent,
  Color,
  Timer,
  // Base
  EngineObject,
} from "../../lib/little";
import { level } from ".";

/// objects.ts
/*
    LittleJS Platformer Example - Objects
    - Base GameObject class for objects with health
    - Crate object collides with player, can be destroyed.
    - Weapon is held by player and fires bullets with some settings.
    - Bullet is the projectile launched by a weapon.
*/

export class GameObject extends EngineObject {
  constructor(pos, size, tileIndex, tileSize, angle) {
    super(pos, size, tileIndex, tileSize, angle);
    this.health = 0;
    this.isGameObject = 1;
    this.damageTimer = new Timer();
  }

  update() {
    super.update();
    const { warmup } = level;

    // flash white when damaged
    if (!this.isDead() && this.damageTimer.isSet()) {
      const a = 0.5 * percent(this.damageTimer, 0.15, 0);
      this.additiveColor = new Color(a, a, a, 0);
    } else this.additiveColor = new Color(0, 0, 0, 0);

    // kill if below level
    if (!this.isDead() && this.pos.y < -9)
      warmup ? this.destroy() : this.kill();
  }

  damage(damage, damagingObject) {
    ASSERT(damage >= 0);
    if (this.isDead()) return 0;

    // set damage timer;
    this.damageTimer.set();
    for (const child of this.children)
      child.damageTimer && child.damageTimer.set();

    // apply damage and kill if necessary
    const newHealth = max(this.health - damage, 0);
    if (!newHealth) this.kill(damagingObject);

    // set new health and return amount damaged
    return this.health - (this.health = newHealth);
  }

  isDead() {
    return !this.health;
  }
  kill(damagingObject) {
    this.destroy();
  }
}
