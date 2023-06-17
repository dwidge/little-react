import {
  // Utilities
  PI,
  // Random
  rand,
  randInt,
  // More utilities
  vec2,
  Color,
  objectDefaultSize,
} from "../../lib/little";
import { GameObject } from "./GameObject";
import { sound_destroyObject, makeDebris } from ".";

///////////////////////////////////////////////////////////////////////////////

export class Crate extends GameObject {
  constructor(pos) {
    super(pos, objectDefaultSize, 2, vec2(16), (randInt(4) * PI) / 2);

    this.color = new Color().setHSLA(rand(), 1, 0.8);
    this.health = 5;

    // make it a solid object for collision
    this.setCollision(1, 1);
  }

  kill() {
    if (this.isDestroyed) return;

    sound_destroyObject.play(this.pos);
    makeDebris(this.pos, this.color);
    this.destroy();
  }
}
