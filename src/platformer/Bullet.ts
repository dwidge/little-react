import {
  // Utilities
  PI,
  // More utilities
  vec2,
  Color,
  // Base
  EngineObject,
  // Particles
  ParticleEmitter,
  engineObjectsCallback,
} from "../../lib/little";
import { destroyTile } from ".";

///////////////////////////////////////////////////////////////////////////////

export class Bullet extends EngineObject {
  constructor(pos, attacker, velocity, damage) {
    super(pos, vec2());
    this.color = new Color(1, 1, 0);
    this.velocity = velocity;
    this.attacker = attacker;
    this.damage = damage;
    this.damping = 1;
    this.gravityScale = 0;
    this.renderOrder = 100;
    this.drawSize = vec2(0.2, 0.5);
    this.range = 20;
    this.setCollision(1);
  }

  update() {
    // check if hit someone
    engineObjectsCallback(this.pos, this.size, (o) => {
      if (o.isGameObject) this.collideWithObject(o);
    });

    super.update();

    this.angle = this.velocity.angle();
    this.range -= this.velocity.length();
    if (this.range < 0) this.kill();
  }

  collideWithObject(o) {
    if (o.isGameObject && o != this.attacker) {
      o.damage(this.damage, this);
      o.applyForce(this.velocity.scale(0.1));
    }

    this.kill();
    return 1;
  }

  collideWithTile(data, pos) {
    if (data <= 0) return 0;

    destroyTile(pos);
    this.kill();
    return 1;
  }

  kill() {
    if (this.destroyed) return;
    this.destroy();

    // spark effects
    const emitter = new ParticleEmitter(
      this.pos,
      0,
      0,
      0.1,
      100,
      0.5,
      undefined,
      undefined,
      new Color(1, 1, 0),
      new Color(1, 0, 0),
      new Color(1, 1, 0),
      new Color(1, 0, 0),
      0.2,
      0.2,
      0,
      0.1,
      0.1,
      1,
      1,
      0.5,
      PI,
      0.1,
      0.5,
      1,
      1 // randomness, collide, additive, randomColorLinear, renderOrder
    );
    emitter.trailScale = 1;
    emitter.elasticity = 0.3;
    emitter.angle = this.velocity.angle() + PI;
  }
}
