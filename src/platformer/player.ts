import {
  // More utilities
  vec2,
  // Input
  keyIsDown,
  mouseIsDown,
  isUsingGamepad,
  gamepadIsDown,
  gamepadStick,
} from "../../lib/little";
import { Character } from "./Character";
import { level } from ".";

///////////////////////////////////////////////////////////////////////////////

export class Player extends Character {
  update() {
    // player controls
    this.holdingJump = keyIsDown(38) || gamepadIsDown(0);
    this.holdingShoot = mouseIsDown(0) || keyIsDown(90) || gamepadIsDown(2);
    this.pressingThrow = mouseIsDown(1) || keyIsDown(67) || gamepadIsDown(1);
    this.pressedDodge = mouseIsDown(2) || keyIsDown(88) || gamepadIsDown(3);

    // movement control
    this.moveInput = isUsingGamepad
      ? gamepadStick(0)
      : vec2(keyIsDown(39) - keyIsDown(37), keyIsDown(38) - keyIsDown(40));

    super.update();
  }

  kill() {
    ++level.deaths;
    super.kill();
  }
}
