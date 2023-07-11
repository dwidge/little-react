import {
  min,
  lerp,
  // Random
  rand,
  // More utilities
  vec2,
  Color,
  Timer,
  // Base
  EngineObject,
  // Particles
  ParticleEmitter,
  timeDelta,
} from "../../lib/little";
import { persistentParticleDestroyCallback, sound_shoot } from ".";
import { Bullet } from "./Bullet";

///////////////////////////////////////////////////////////////////////////////

export class Weapon extends EngineObject {
  constructor(pos, parent) {
    super(pos, vec2(0.6), 2, vec2(8));

    // weapon settings
    this.fireRate = 8;
    this.bulletSpeed = 0.5;
    this.bulletSpread = 0.1;
    this.damage = 1;

    // prepare to fire
    this.renderOrder = parent.renderOrder + 1;
    this.fireTimeBuffer = this.localAngle = 0;
    this.recoilTimer = new Timer();
    parent.addChild(this, vec2(0.6, 0));

    // shell effect
    this.addChild(
      (this.shellEmitter = new ParticleEmitter(
        vec2(),
        0,
        0,
        0,
        0,
        0.1,
        undefined,
        undefined,
        new Color(1, 0.8, 0.5),
        new Color(0.9, 0.7, 0.5),
        new Color(1, 0.8, 0.5),
        new Color(0.9, 0.7, 0.5),
        3,
        0.1,
        0.1,
        0.15,
        0.1,
        1,
        0.95,
        1,
        0,
        0,
        0.1,
        1 // randomness, collide, additive, randomColorLinear, renderOrder
      )),
      vec2(0.1, 0),
      -0.8
    );
    this.shellEmitter.elasticity = 0.5;
    this.shellEmitter.particleDestroyCallback =
      persistentParticleDestroyCallback;
  }

  update() {
    super.update();

    // update recoil
    if (this.recoilTimer.active())
      this.localAngle = lerp(this.recoilTimer.getPercent(), 0, this.localAngle);

    this.mirror = this.parent.mirror;
    this.fireTimeBuffer += timeDelta;
    if (false && this.triggerIsDown) {
      // try to fire
      for (
        ;
        this.fireTimeBuffer > 0;
        this.fireTimeBuffer -= 1 / this.fireRate
      ) {
        // create bullet
        sound_shoot.play(this.pos);
        this.localAngle = -rand(0.2, 0.15);
        this.recoilTimer.set(0.4);
        const direction = vec2(this.bulletSpeed * this.getMirrorSign(), 0);
        const velocity = direction.rotate(rand(-1, 1) * this.bulletSpread);
        new Bullet(this.pos, this.parent, velocity, this.damage);

        // spawn shell particle
        this.shellEmitter.emitParticle();
      }
    } else this.fireTimeBuffer = min(this.fireTimeBuffer, 0);
  }
}
