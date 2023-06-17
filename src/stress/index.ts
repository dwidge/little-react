// Copyright DWJ 2023.
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

/*
    MIT License - Copyright 2021 Frank Force
*/

import {
  Color,
  EngineObject,
  cameraScale,
  clamp,
  engineInit,
  engineObjects,
  glDraw,
  gravity,
  initTileCollision,
  lerp,
  max,
  mouseIsDown,
  mousePos,
  mouseWasPressed,
  mouseWheel,
  rand,
  randColor,
  randInCircle,
  setCameraPos,
  setCameraScale,
  setGravity,
  setTileCollisionData,
  sign,
  tileCollisionSize,
  vec2,
} from "../../lib/little";

export default function Stress(
  div: HTMLDivElement,
  statsDisplay: HTMLDivElement
) {
  // keep our own list of simple sprites and track fps
  let sprites, timeMS, showFPS, spriteColor, spriteAdditiveColor, musicSource;

  ///////////////////////////////////////////////////////////////////////////////

  class TestObject extends EngineObject {
    constructor(pos) {
      super(pos, vec2(1), 0, vec2(16), 0, spriteColor);

      this.additiveColor = spriteAdditiveColor;
      this.setCollision(1, 1);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameInit() {
    // create tile collision
    initTileCollision(vec2(80, 50));
    for (let x = tileCollisionSize.x; x--; )
      setTileCollisionData(vec2(x, 0), 1),
        setTileCollisionData(vec2(x, tileCollisionSize.y - 1), 1);
    for (let y = tileCollisionSize.y; y--; )
      setTileCollisionData(vec2(0, y), 1),
        setTileCollisionData(vec2(tileCollisionSize.x - 1, y), 1);

    // set things up
    setCameraScale(4);
    setCameraPos(tileCollisionSize.scale(0.5));
    sprites = [];
    setGravity(-0.01);
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameUpdate() {
    //if (!musicSource && mouseWasPressed(0)) musicSource = music.play();

    // mouse click = change color
    if (mouseWasPressed(0) || mouseIsDown(2))
      (spriteColor = randColor()),
        (spriteAdditiveColor = randColor(
          new Color(0.5, 0.5, 0.5, 0),
          new Color(0, 0, 0, 0)
        ));

    // right click = drop test object
    if (mouseIsDown(2)) new TestObject(mousePos);

    // mouse hold = add objects
    if (mouseIsDown(0))
      for (let i = 100; i--; )
        sprites.push({
          pos: mousePos.add(randInCircle(2)),
          angle: rand(),
          velocity: randInCircle(0.2),
          color: (spriteColor = spriteColor.mutate()),
          additiveColor: spriteAdditiveColor.mutate(),
        });

    // mouse wheel = zoom
    setCameraScale(clamp(cameraScale * (1 - mouseWheel / 10), 1, 1e3));
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameUpdatePost() {}

  ///////////////////////////////////////////////////////////////////////////////
  function gameRender() {
    // track fps and update stats
    const frameTimeMS = Date.now();
    showFPS = lerp(0.05, showFPS, 1e3 / (frameTimeMS - timeMS || 1));
    timeMS = frameTimeMS;

    const spriteCount = sprites.length;
    const objectCount = engineObjects.length;
    statsDisplay.innerText =
      spriteCount + objectCount
        ? spriteCount +
          " Sprites\n" +
          objectCount +
          " Objects\n" +
          showFPS.toFixed(1) +
          " FPS"
        : "LittleJS Stress Test\nLeft Click = Add Particles\nRight Click = Add Objects";

    const size = vec2(0.5);
    for (const sprite of sprites) {
      // keep sprites above 0
      sprite.pos.y = max(sprite.pos.y, 0);

      // apply gravity
      sprite.velocity.y += gravity;

      // apply velocity
      sprite.pos = sprite.pos.add(sprite.velocity);

      // bounce
      if (sprite.pos.y < 0) sprite.velocity.y = rand(1, 0.5);
      if (sprite.pos.x < 0) (sprite.pos.x = 0), (sprite.velocity.x *= -1);
      if (sprite.pos.x > tileCollisionSize.x)
        (sprite.pos.x = tileCollisionSize.x), (sprite.velocity.x *= -1);

      // rotate sprite
      sprite.angle += 0.01 * sign(sprite.velocity.x);

      // draw the sprite
      glDraw(
        sprite.pos.x,
        sprite.pos.y,
        1,
        1,
        sprite.angle,
        0,
        0,
        1,
        1,
        sprite.color.rgbaInt(),
        sprite.additiveColor.rgbaInt()
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameRenderPost() {}

  ///////////////////////////////////////////////////////////////////////////////
  // load tiles image via url data
  const tilesImageData =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYklEQVR42u2TQQqAQAwDPfg6P5SX+b7VgkpDhNH7DuTSNGFZ6LJv66OTUWoz9M28sCXyw2xLpjc/CiQNQpIVFGaKZa+I538JZ4EDYSgAsCB+Pma5OwtgGWd2ZUCE4xr/6M4d3aFsj7DwoPQAAAAASUVORK5CYII=";

  ///////////////////////////////////////////////////////////////////////////////
  // Startup LittleJS Engine
  engineInit(
    div,
    gameInit,
    gameUpdate,
    gameUpdatePost,
    gameRender,
    gameRenderPost,
    tilesImageData
  );
}
