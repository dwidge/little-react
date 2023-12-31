/*
    LittleJS Platformer Example
    - A platforming starter game with destructibe terrain
*/

// Copyright DWJ 2023.
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

/*
    MIT License - Copyright 2021 Frank Force
*/

import tilemapImage from "./tiles.png";
import {
  ASSERT,
  // ---------- Custom methods
  setTileSizeDefault,
  setCameraPos,
  setCameraScale,
  setGravity,
  getMainContext,
  getOverlayCanvas,
  getCameraPos,
  getCameraScale,
  getMousePos,
  getMouseWheel,
  getUsingGamepad,
  getTileCollisionSize,
  // ---------- Engine Methods and Variables
  // Globals
  debug,
  enableAsserts,
  debugPointSize,
  showWatermark,
  // Debug
  debugPrimitives,
  debugOverlay,
  debugPhysics,
  debugRaycast,
  debugParticles,
  debugGamepads,
  debugTakeScreenshot,
  //downloadLink,
  //ASSERT,
  debugRect,
  debugCircle,
  debugPoint,
  debugLine,
  debugAABB,
  debugText,
  debugClear,
  debugSaveCanvas,
  debugInit,
  debugUpdate,
  debugRender,
  // Utilities
  PI,
  clamp,
  percent,
  smoothStep,
  nearestPowerOfTwo,
  wave,
  formatTime,
  // Random
  rand,
  randSign,
  randInCircle,
  randVector,
  randSeed, // Add get/set
  // More utilities
  vec2,
  Vector2,
  colorRGBA,
  colorHSLA,
  Color,
  // Settings -- Could all use get/set methods
  canvasMaxSize,
  canvasFixedSize,
  cavasPixelated,
  fontDefault,
  tileSizeDefault,
  tileFixBleedScale,
  enablePhysicsSolver,
  objectDefaultMass,
  objectDefaultDamping,
  objectDefaultAngleDamping,
  objectDefaultElasticity,
  objectDefaultFriction,
  objectMaxSpeed,
  particleEmitRateScale,
  cameraPos,
  cameraScale,
  glOverlay,
  gamepadsEnable,
  gamepadDirectionEmulateStick,
  inputWASDEmulateDirection,
  touchGamepadEnable,
  touchGamepadAnalog,
  touchGamepadSize,
  touchGamepadAlpha,
  vibrateEnable,
  soundVolume,
  soundEnable,
  soundDefaultRange,
  soundDefaultTaper,
  // Draw
  tileImage,
  overlayCanvas,
  overlayContext,
  mainCanvasSize,
  screenToWorld,
  worldToScreen,
  drawRect,
  drawTileScreenSpace,
  drawRectScreenSpace,
  drawLine,
  drawCanvas2D,
  drawTextScreen,
  drawText,
  engineFontImage,
  FontImage,
  isFullscreen,
  toggleFullscreen,
  keyWasPressed,
  keyWasReleased,
  clearInput,
  mouseWasPressed,
  mouseWasReleased,
  mousePos,
  mousePosScreen,
  mouseWheel,
  preventDefaultInput,
  gamepadWasPressed,
  gamepadWasReleased,
  //inputData,
  inputUpdate,
  inputUpdatePost,
  // onkeydown,
  // onkeyup,
  //remapKeyCode,
  // onmousedown,
  // onmouseup,
  // onmousemove,
  // onwheel,
  // oncontextmenu,
  mouseToScreen,
  //stickData,
  gamepadsUpdate,
  vibrate,
  vibrateStop,
  isTouchDevice,
  //touchGamepadTimer,
  touchGamepadCreate,
  touchGamepadRender,
  // sound
  Sound,
  Music,
  playAudioFile,
  speak,
  speakStop,
  getNoteFrequency,
  audioContext,
  playSamples,
  zzfx,
  //zzfxR,
  //zzfxG,
  //zzfxM,
  // tiles
  tileCollision,
  setTileCollisionData,
  getTileCollisionData,
  tileCollisionTest,
  TileLayerData,
  TileLayer,
  // Particles
  ParticleEmitter,
  Particle,
  // Other
  // WebGL
  glCanvas,
  glContext,
  glTileTexture,
  glActiveTexture,
  glShader,
  glPositionData,
  glColorData,
  glBatchCount,
  glBatchAdditive,
  glAdditive,
  glInit,
  glSetBlendMode,
  glSetTexture,
  glCompileShader,
  glCreateProgram,
  glCreateBuffer,
  glCreateTexture,
  glPreRender,
  glFlush,
  glCopyToContext,
  glDraw,
  // Various "gl_" constants (ignored)
  // Engine
  engineName,
  engineVersion,
  engineObjects,
  //engineObjectsCollide,
  frame,
  timeReal,
  paused,
  setPaused,
  //frameTimeLastMS,
  averageFPS,
  //drawCount,
  //styleBody,
  //styleCanvas,
  engineInit,
  enginePreRender,
  engineObjectsCallback,
  Timer,
  tileCollisionSize,
  engineObjectsDestroy,
} from "../../lib/little";
import song from "./music/back";
import { Crate } from "./Crate";
import { Enemy } from "./Enemy";
import buildLevel from "./buildLevel";

export let score = 0,
  deaths = 0;

export type Platformer = { paused: boolean; setPaused: (v: boolean) => void };

export function Platformer(div: HTMLDivElement, statsDisplay: HTMLDivElement) {
  ///////////////////////////////////////////////////////////////////////////////
  function gameInit() {
    // enable touch gamepad on touch devices
    // touchGamepadEnable = 1;

    // setup game
    score = deaths = 0;
    setGravity(-0.01);
    setCameraScale(4 * 16);
    level.gameTimer.set();

    // clear old level
    engineObjectsDestroy();

    const levelSize = vec2(64);
    const terrainBattle = buildTerrain(levelSize);
    const terrainNodes = buildTerrainFromNodes(levelSize, {
      name: "x",
      children: [
        { name: "y", children: [] },
        { name: "y", children: [] },
        {
          name: "y",
          children: [
            {
              name: "x",
              children: [
                { name: "y", children: [] },
                { name: "y", children: [] },
                { name: "y", children: [] },
              ],
            },
          ],
        },
      ],
    });
    const terrain = terrainNodes;

    engineObjects.splice(0, 0, ...terrain.objects);
    Object.assign(level, buildLevel(terrain));
    spawnPlayer();
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameUpdate() {
    // respawn player
    if (level.player.deadTimer > 1) {
      spawnPlayer();
      level.player.velocity = vec2(0, 0.1);
      sound_jump.play();
    }

    // mouse wheel = zoom
    setCameraScale(clamp(cameraScale * (1 - mouseWheel / 10), 1, 1e3));

    // T = drop test crate
    if (keyWasPressed(84)) new Crate(mousePos);

    // E = drop enemy
    if (keyWasPressed(69)) new Enemy(mousePos);

    // X = make explosion
    if (keyWasPressed(88)) explosion(mousePos);

    // M = move level.player to mouse
    if (keyWasPressed(77)) level.player.pos = mousePos;
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameUpdatePost() {
    // move camera to level.player
    if (paused)
      setCameraPos(
        cameraPos
          .lerp(mousePos, 1 / 8)
          .min(new Vector2(0, 0))
          .max(level.levelSize)
      );
    else
      setCameraPos(
        cameraPos.lerp(level.player.pos, clamp(level.player.getAliveTime() / 2))
      );

    // update parallax background relative to camera
    updateParallaxLayers();
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameRender() {
    if (level.sky) {
      drawSky(level.sky);
      drawStars(level.sky);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameRenderPost() {
    // draw to overlay canvas for hud rendering
    const drawText = (text, x, y, size = 50) => {
      overlayContext.textAlign = "center";
      overlayContext.textBaseline = "top";
      overlayContext.font = size + "px arial";
      overlayContext.fillStyle = "#fff";
      overlayContext.lineWidth = 2;
      overlayContext.strokeText(text, x, y);
      overlayContext.fillText(text, x, y);
    };
    //drawText("Score: " + score, (overlayCanvas.width * 1) / 4, 20);
    //drawText("Deaths: " + deaths, (overlayCanvas.width * 3) / 4, 20);
  }

  const music = new Music(song); //.play();

  ///////////////////////////////////////////////////////////////////////////////
  // Startup LittleJS Engine
  engineInit(
    div,
    gameInit,
    gameUpdate,
    gameUpdatePost,
    gameRender,
    gameRenderPost,
    tilemapImage
  );

  setPaused(1);

  return {
    paused: !!paused,
    setPaused(v: boolean) {
      setPaused(v);
      if (!v) music.play();
    },
  } as Platformer;
}

/// effects.ts

/*
    LittleJS Platformer Example - Effects
    - Plays different particle effects which can be persistant
    - Destroys terrain and makes explosions
    - Outlines tiles based on neighbor types
    - Generates parallax background layers
    - Draws moving starfield with plants and suns
    - Tracks zzfx sound effects
*/

///////////////////////////////////////////////////////////////////////////////
// sound effects

export const sound_shoot = new Sound([
  ,
  ,
  90,
  ,
  0.01,
  0.03,
  4,
  ,
  ,
  ,
  ,
  ,
  ,
  9,
  50,
  0.2,
  ,
  0.2,
  0.01,
]);
export const sound_destroyObject = new Sound([
  0.5,
  ,
  1e3,
  0.02,
  ,
  0.2,
  1,
  3,
  0.1,
  ,
  ,
  ,
  ,
  1,
  -30,
  0.5,
  ,
  0.5,
]);
export const sound_die = new Sound([
  0.5,
  0.4,
  126,
  0.05,
  ,
  0.2,
  1,
  2.09,
  ,
  -4,
  ,
  ,
  1,
  1,
  1,
  0.4,
  0.03,
]);
export const sound_jump = new Sound([
  0.4,
  0.2,
  250,
  0.04,
  ,
  0.04,
  ,
  ,
  1,
  ,
  ,
  ,
  ,
  3,
]);
export const sound_dodge = new Sound([
  0.4,
  0.2,
  150,
  0.05,
  ,
  0.05,
  ,
  ,
  -1,
  ,
  ,
  ,
  ,
  4,
  ,
  ,
  ,
  ,
  0.02,
]);
export const sound_walk = new Sound([
  0.3,
  0.1,
  70,
  ,
  ,
  0.01,
  4,
  ,
  ,
  ,
  -9,
  0.1,
  ,
  ,
  ,
  ,
  ,
  0.5,
]);
export const sound_explosion = new Sound([
  2,
  0.2,
  72,
  0.01,
  0.01,
  0.2,
  4,
  ,
  ,
  ,
  ,
  ,
  ,
  1,
  ,
  0.5,
  0.1,
  0.5,
  0.02,
]);
export const sound_grenade = new Sound([
  0.5,
  0.01,
  300,
  ,
  ,
  0.02,
  3,
  0.22,
  ,
  ,
  -9,
  0.2,
  ,
  ,
  ,
  ,
  ,
  0.5,
]);
export const sound_killEnemy = new Sound([
  ,
  ,
  783,
  ,
  0.03,
  0.02,
  1,
  2,
  ,
  ,
  940,
  0.03,
  ,
  ,
  ,
  ,
  0.2,
  0.6,
  ,
  0.06,
]);

///////////////////////////////////////////////////////////////////////////////
// special effects

export const persistentParticleDestroyCallback = (particle) => {
  if (!level.tileLayer) throw new Error("destroyTileE1");
  // copy particle to tile layer on death
  ASSERT(particle.tileIndex < 0); // quick draw to tile layer uses canvas 2d so must be untextured
  if (particle.groundObject)
    level.tileLayer.drawTile(
      particle.pos,
      particle.size,
      particle.tileIndex,
      particle.tileSize,
      particle.color,
      particle.angle,
      particle.mirror
    );
};

export function makeBlood(pos, amount) {
  makeDebris(pos, new Color(1, 0, 0), 50, 0.1, 0);
}
export function makeDebris(
  pos,
  color = new Color(),
  amount = 100,
  size = 0.2,
  elasticity = 0.3
) {
  const color2 = color.lerp(new Color(), 0.5);
  const emitter = new ParticleEmitter(
    pos,
    0,
    1,
    0.1,
    100,
    PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
    undefined,
    undefined, // tileIndex, tileSize
    color,
    color2, // colorStartA, colorStartB
    color,
    color2, // colorEndA, colorEndB
    3,
    size,
    size,
    0.1,
    0.05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
    1,
    0.95,
    0.4,
    PI,
    0, // damping, angleDamping, gravityScale, particleCone, fadeRate,
    0.5,
    1 // randomness, collide, additive, randomColorLinear, renderOrder
  );
  emitter.elasticity = elasticity;
  emitter.particleDestroyCallback = persistentParticleDestroyCallback;
  return emitter;
}

///////////////////////////////////////////////////////////////////////////////

export function explosion(pos, radius = 3) {
  if (!level.tileLayer) return;
  if (!level.tileCollision) return;
  if (!level.levelSize) return;
  if (!level.levelGroundColor) return;
  ASSERT(radius > 0);

  const damage = radius * 2;

  // destroy level
  for (let x = -radius; x < radius; ++x) {
    const h = (radius * radius - x * x) ** 0.5;
    for (let y = -h; y <= h; ++y) destroyTile(pos.add(vec2(x, y)), 0, 0);
  }

  // cleanup neighbors
  const cleanupRadius = radius + 1;
  for (let x = -cleanupRadius; x < cleanupRadius; ++x) {
    const h = (cleanupRadius ** 2 - x ** 2) ** 0.5;
    for (let y = -h; y < h; ++y)
      decorateTile(
        level.tileLayer,
        pos.add(vec2(x, y)).floor(),
        level.tileCollision,
        level.levelSize,
        level.levelGroundColor
      );
  }

  // kill/push objects
  const maxRangeSquared = (radius * 1.5) ** 2;
  engineObjectsCallback(pos, radius * 3, (o) => {
    const d = o.pos.distance(pos);
    if (o.isGameObject) {
      // do damage
      d < radius && o.damage(damage);
    }

    // push
    const p = percent(d, 2 * radius, radius);
    const force = o.pos.subtract(pos).normalize(p * radius * 0.2);
    o.applyForce(force);
    if (o.isDead && o.isDead())
      o.angleVelocity += randSign() * rand((p * radius) / 4, 0.3);
  });

  sound_explosion.play(pos);

  // smoke
  new ParticleEmitter(
    pos,
    0,
    radius / 2,
    0.2,
    50 * radius,
    PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
    0,
    undefined, // tileIndex, tileSize
    new Color(0, 0, 0),
    new Color(0, 0, 0), // colorStartA, colorStartB
    new Color(0, 0, 0, 0),
    new Color(0, 0, 0, 0), // colorEndA, colorEndB
    1,
    0.5,
    2,
    0.1,
    0.05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
    0.9,
    1,
    -0.3,
    PI,
    0.1, // damping, angleDamping, gravityScale, particleCone, fadeRate,
    0.5,
    0,
    0,
    0,
    1e8 // randomness, collide, additive, randomColorLinear, renderOrder
  );

  // fire
  new ParticleEmitter(
    pos,
    0,
    radius / 2,
    0.1,
    100 * radius,
    PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
    0,
    undefined, // tileIndex, tileSize
    new Color(1, 0.5, 0.1),
    new Color(1, 0.1, 0.1), // colorStartA, colorStartB
    new Color(1, 0.5, 0.1, 0),
    new Color(1, 0.1, 0.1, 0), // colorEndA, colorEndB
    0.5,
    0.5,
    2,
    0.1,
    0.05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
    0.9,
    1,
    0,
    PI,
    0.05, // damping, angleDamping, gravityScale, particleCone, fadeRate,
    0.5,
    0,
    1,
    0,
    1e9 // randomness, collide, additive, randomColorLinear, renderOrder
  );
}

///////////////////////////////////////////////////////////////////////////////

export function destroyTile(pos: Vector2, makeSound = 1, cleanNeighbors = 1) {
  if (!level.destructible) return;
  if (!level.tileLayer) throw new Error("destroyTileE1");

  // pos must be an int
  pos = pos.floor();

  // destroy tile
  const tileType = getTileCollisionData(pos);

  if (!tileType) return 1; // empty

  const centerPos = pos.add(vec2(0.5));
  const layerData = level.tileLayer.getData(pos);
  if (layerData) {
    makeDebris(centerPos, layerData.color.mutate());
    makeSound && sound_destroyObject.play(centerPos);

    setTileCollisionData(pos, tileType_empty);
    level.tileLayer.setData(pos, new TileLayerData(), 1); // set and clear tile

    if (!level.tileCollision) return 0;
    if (!level.levelSize) return 0;
    if (!level.levelGroundColor) return 0;
    // cleanup neighbors
    if (cleanNeighbors) {
      for (let i = -1; i <= 1; ++i)
        for (let j = -1; j <= 1; ++j)
          decorateTile(
            level.tileLayer,
            pos.add(vec2(i, j)),
            level.tileCollision,
            level.levelSize,
            level.levelGroundColor
          );
    }
  }

  return 1;
}

///////////////////////////////////////////////////////////////////////////////
// parallax background mountain ranges

let tileParallaxLayers = [];

export function initParallaxLayers(levelColor: Color, sky: Sky) {
  tileParallaxLayers = [];
  for (let i = 3; i--; ) {
    // setup the layer
    const parallaxSize = vec2(600, 300),
      startGroundLevel = rand(99, 120) + i * 30;
    const tileParallaxLayer = (tileParallaxLayers[i] = new TileLayer(
      vec2(),
      parallaxSize
    ));
    tileParallaxLayer.renderOrder = -3e3 + i;
    tileParallaxLayer.canvas.width = parallaxSize.x;

    // create a gradient
    const layerColor = levelColor
      .mutate(0.2)
      .lerp(sky.skyColor, 0.95 - i * 0.15);
    const gradient = (tileParallaxLayer.context.fillStyle =
      tileParallaxLayer.context.createLinearGradient(
        0,
        0,
        0,
        (tileParallaxLayer.canvas.height = parallaxSize.y)
      ));
    gradient.addColorStop(0, layerColor);
    gradient.addColorStop(
      1,
      layerColor.subtract(new Color(1, 1, 1, 0)).mutate(0.1).clamp()
    );

    // draw mountains ranges
    let groundLevel = startGroundLevel,
      groundSlope = rand(-1, 1);
    for (let x = parallaxSize.x; x--; )
      tileParallaxLayer.context.fillRect(
        x,
        (groundLevel += groundSlope =
          rand() < 0.05
            ? rand(1, -1)
            : groundSlope + (startGroundLevel - groundLevel) / 2e3),
        1,
        parallaxSize.y
      );
  }
}

export function updateParallaxLayers() {
  tileParallaxLayers.forEach((tileParallaxLayer, i) => {
    const distance = 4 + i;
    const parallax = vec2(150, 30).scale(i * i + 1);
    const cameraDeltaFromCenter = cameraPos
      .subtract(level.levelSize.scale(0.5))
      .divide(level.levelSize.scale(-0.5).divide(parallax));
    tileParallaxLayer.scale = vec2(distance / cameraScale);
    tileParallaxLayer.pos = cameraPos
      .subtract(
        tileParallaxLayer.size.multiply(tileParallaxLayer.scale).scale(0.5)
      )
      .add(cameraDeltaFromCenter.scale(1 / cameraScale))
      .subtract(vec2(0, 150 / cameraScale));
  });
}

import { Player } from "./player";
import { drawSky, drawStars, skyColor, Sky } from "./drawSky";
import { buildTerrainFromNodes } from "./terrain/buildTerrainFromNodes";
import { buildTerrain } from "./terrain/buildTerrain";
import { decorateTile } from "./decorateTile";

/// level.ts
/*
    LittleJS Platformer Example - Level Generator
    - Procedurally generates level geometry
    - Picks colors for the level and background
    - Creates ladders and spawns enemies and crates

*/

export const tileType_ladder = -1;
export const tileType_empty = 0;
export const tileType_solid = 1;

export type Level = {
  destructible: boolean;
  score: number;
  deaths: number;
  gameTimer: Timer;
  player?: Player;
  playerStartPos: Vector2;
  tileLayer?: TileLayer;
  tileCollision?: number[];
  tileBackground?: number[];
  tileBackgroundLayer?: TileLayer;
  levelSize?: Vector2;
  levelColor?: Color;
  sky?: Sky;
  levelGroundColor?: Color;
  warmup: number;
};

export let level: Level = {
  destructible: true,
  score: 0,
  deaths: 0,
  gameTimer: new Timer(),
  playerStartPos: new Vector2(),
  warmup: 0,
};

export let tileBackground: any[];
export const getTileBackgroundData = (pos: Vector2) =>
  pos.arrayCheck(tileCollisionSize)
    ? level.tileBackground[((pos.y | 0) * tileCollisionSize.x + pos.x) | 0]
    : 0;

export function spawnPlayer() {
  setCameraPos(level.playerStartPos);
  level.player = new Player(level.playerStartPos.add(new Vector2(0.5, 0.5)));
}
