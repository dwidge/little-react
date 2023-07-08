import {
  setRandSeed,
  // Random
  rand,
  randColor, // Add get/set
  randSeeded,
  // More utilities
  vec2,
  Color,
  mainCanvas,
  mainContext,
  time,
} from "../../lib/little";

///////////////////////////////////////////////////////////////////////////////
// sky with background gradient, stars, and planets

export type Sky = {
  skySeed: number;
  skyColor: Color;
  horizonColor: Color;
};

export function initSky(): Sky {
  const skySeed = rand(1000000000);
  const skyColor = randColor(
    new Color(0.5, 0.5, 0.5),
    new Color(0.9, 0.9, 0.9)
  );
  const horizonColor = skyColor
    .subtract(new Color(0.05, 0.05, 0.05))
    .mutate(0.3)
    .clamp();
  return { skySeed, skyColor, horizonColor };
}

export function drawSky(sky: Sky) {
  // fill background with a gradient
  const gradient = (mainContext.fillStyle = mainContext.createLinearGradient(
    0,
    0,
    0,
    mainCanvas.height
  ));
  gradient.addColorStop(0, sky.skyColor.toString());
  gradient.addColorStop(1, sky.horizonColor.toString());
  mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
}

export function drawStars(sky: Sky) {
  // draw stars and planets
  setRandSeed(sky.skySeed);
  const largeStarCount = 9;
  for (let i = 1000; i--; ) {
    let size = randSeeded(6, 1);
    let speed = randSeeded() < 0.9 ? randSeeded(5) : randSeeded(99, 9);
    let color = new Color().setHSLA(
      randSeeded(0.2, -0.3),
      randSeeded() ** 9,
      randSeeded(1, 0.5),
      randSeeded(0.9, 0.3)
    );
    if (i < largeStarCount) {
      // large planets and suns
      size = randSeeded() ** 3 * 99 + 9;
      speed = randSeeded(5);
      color = new Color()
        .setHSLA(randSeeded(), randSeeded(), randSeeded(1, 0.5))
        .add(sky.skyColor.scale(0.5))
        .clamp();
    }

    const extraSpace = 200;
    const w = mainCanvas.width + 2 * extraSpace,
      h = mainCanvas.height + 2 * extraSpace;
    const screenPos = vec2(
      ((randSeeded(w) + time * speed) % w) - extraSpace,
      ((randSeeded(h) + time * speed * randSeeded()) % h) - extraSpace
    );

    mainContext.fillStyle = color.toString();
    if (size < 9) mainContext.fillRect(screenPos.x, screenPos.y, size, size);
    else {
      mainContext.beginPath();
      mainContext.arc(screenPos.x, screenPos.y, size, 0, 9);
      mainContext.fill();
    }
  }
}
