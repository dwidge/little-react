import {
  // Utilities
  PI,
  // More utilities
  vec2,
  Color,
  Timer,
  drawTile,
  setBlendMode,
} from "../../lib/little";
import { GameObject } from "./GameObject";
import { explosion, sound_grenade } from ".";

///////////////////////////////////////////////////////////////////////////////

export class Grenade extends GameObject {
  constructor(pos) {
    super(pos, vec2(0.2), 3, vec2(8));

    this.beepTimer = new Timer(1);
    this.elasticity = 0.3;
    this.friction = 0.9;
    this.angleDamping = 0.96;
    this.renderOrder = 100000000;
    this.setCollision(1);
  }

  update() {
    super.update();

    if (this.getAliveTime() > 3) {
      explosion(this.pos);
      this.destroy();
    } else if (this.beepTimer.elapsed()) {
      sound_grenade.play(this.pos);
      this.beepTimer.set(1);
    }
  }

  render() {
    drawTile(
      this.pos,
      vec2(0.5),
      this.tileIndex,
      this.tileSize,
      this.color,
      this.angle
    );

    // draw additive flash when damaged
    setBlendMode(1);
    const flash = Math.cos(this.getAliveTime() * 2 * PI);
    drawTile(
      this.pos,
      vec2(2),
      0,
      vec2(16),
      new Color(1, 0, 0, 0.2 - 0.2 * flash)
    );
    setBlendMode(0);
  }
}
