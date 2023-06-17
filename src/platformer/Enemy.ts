import {
  isOverlapping,
  // Random
  rand,
  // More utilities
  vec2,
  Color,
  Timer,
  drawTile,
} from "../../lib/little";
import { GameObject } from "./GameObject";
import { sound_jump, score, sound_killEnemy, makeDebris } from ".";
import { level } from ".";

///////////////////////////////////////////////////////////////////////////////

export class Enemy extends GameObject {
  constructor(pos) {
    super(pos, vec2(0.9, 0.9), 8, vec2(16));

    this.drawSize = vec2(1);
    this.color = new Color().setHSLA(rand(), 1, 0.7);
    this.health = 5;
    this.bounceTime = new Timer(rand(1000));
    this.setCollision(1);
  }

  update() {
    super.update();

    if (!level.player) return;
    const { player } = level;

    // jump around randomly
    if (
      this.groundObject &&
      rand() < 0.01 &&
      this.pos.distance(level.player.pos) < 20
    ) {
      this.velocity = vec2(rand(0.1, -0.1), rand(0.4, 0.2));
      sound_jump.play(this.pos);
    }

    // damage level.player if touching
    if (isOverlapping(this.pos, this.size, player.pos, player.size))
      player.damage(1, this);
  }

  kill() {
    if (this.isDestroyed) return;

    ++level.score;
    sound_killEnemy.play(this.pos);
    makeDebris(this.pos, this.color, 300);
    this.destroy();
  }

  render() {
    // bounce by changing size
    const bounceTime = this.bounceTime * 6;
    this.drawSize = vec2(
      1 - 0.1 * Math.sin(bounceTime),
      1 + 0.1 * Math.sin(bounceTime)
    );

    // make bottom flush
    let bodyPos = this.pos;
    bodyPos = bodyPos.add(vec2(0, (this.drawSize.y - this.size.y) / 2));
    drawTile(
      bodyPos,
      this.drawSize,
      this.tileIndex,
      this.tileSize,
      this.color,
      this.angle,
      this.mirror,
      this.additiveColor
    );
  }
}
