/**
 * Official Druplicon SVG path data and shared canvas rendering utilities.
 * All paths are from the official Druplicon.vector.svg (Wikimedia Commons / drupal.org).
 * ViewBox: 0 0 681.167 778.583
 *
 * Every visual component should use these functions instead of hand-drawn bezier curves.
 */

// ─── Official SVG Paths ─────────────────────────────────────────────
// Colors: st0=#93C5E4, st1=#FFF, st2=none, st3=#004975, st4=#00598E, st5=#0073BA

/** Main body fill (medium dark blue #00598E) */
export const PATH_BODY =
  "M510.167,144.833c-39.75-24.75-77.25-34.5-114.75-59.25c-23.25-15.75-55.5-53.25-82.5-85.5c-5.25,51.75-21,72.75-39,87.75c-38.25,30-62.25,39-95.25,57c-27.75,14.25-178.5,104.25-178.5,297.75s162.75,336,343.5,336s337.5-131.25,337.5-330S534.167,159.833,510.167,144.833z";

/** Left body shade (medium blue #0073BA) */
export const PATH_SHADE =
  "M141,639c57-0.75,67.5-10.5,117.75-33c271.5-121.5,321.75-232.5,331.5-258s24-66.75,9-112.5c-2.896-8.832-5.006-15.924-6.53-21.63c-36.079-40.343-71.898-62.357-82.72-69.12c-39-24.75-77.25-34.5-114.75-59.25c-23.25-15-55.5-53.25-82.5-85.5c-5.25,51.75-20.25,73.5-39,87.75c-38.25,30-62.25,39-95.25,57C150.75,159.75,0,249,0,442.5c0,61.78,16.593,118.361,45.063,166.766L52.5,609C68.25,623.25,93,639.75,141,639z";

/** Dark outline with inner cutout (dark blue #004975) */
export const PATH_OUTLINE =
  "M510,144.75c-39-24.75-77.25-34.5-114.75-59.25c-23.25-15-55.5-53.25-82.5-85.5c-5.25,51.75-20.25,73.5-39,87.75c-38.25,30-62.25,39-95.25,57C150.75,159.75,0,249,0,442.5c0,61.78,16.593,118.361,45.063,166.766C105.763,712.467,220.46,778.5,343.5,778.5c180.75,0,337.5-131.25,337.5-330c0-109.146-44.332-185.488-88.28-234.63C556.641,173.527,520.82,151.513,510,144.75z M601.164,232.547c49.242,61.564,74.211,134.221,74.211,215.953c0,47.428-9.033,92.23-26.849,133.165c-16.9,38.831-41.236,73.233-72.333,102.254c-61.47,57.364-144.107,88.956-232.693,88.956c-43.826,0-86.832-8.371-127.824-24.882c-40.263-16.217-76.547-39.438-107.843-69.02C41.923,616.678,5.625,532.696,5.625,442.5c0-80.336,26.076-151.72,77.503-212.167c39.289-46.18,81.655-71.774,98.047-80.634c7.958-4.341,15.423-8.172,22.643-11.877c22.63-11.615,44.005-22.586,73.404-45.645c15.677-11.914,32.377-30.785,39.489-78.702c24.774,29.466,53.522,62.579,75.49,76.752c19.5,12.87,39.501,21.888,58.844,30.61c18.298,8.25,37.219,16.781,55.942,28.663c0.031,0.021,0.702,0.438,0.702,0.438C562.421,184.11,591.581,220.566,601.164,232.547z";

/** Light blue highlight on top-left (#93C5E4) */
export const PATH_HIGHLIGHT =
  "M316.5,15c10.5,30.75,9,46.5,9,53.25S321.75,93,309.75,102c-5.25,3.75-6.75,6.75-6.75,7.5c0,3,6.75,5.25,6.75,12c0,8.25-3.75,24.75-43.5,64.5s-96.75,75-141,96.75S60,303,54,292.5s2.25-33.75,30-64.5s115.5-75,115.5-75L309,76.5l6-29.25";

/** White highlight / drop reflection */
export const PATH_WHITE_HIGHLIGHT =
  "M316.5,14.25c-6.75,49.5-21.75,64.5-42,80.25c-33.75,25.5-66.75,41.25-74.25,45c-19.5,9.75-90,48.75-126.75,105c-11.25,17.25,0,24,2.25,25.5s27.75,4.5,82.5-28.5S237,189,267.75,156.75c16.5-17.25,18.75-27,18.75-31.5c0-5.25-3.75-7.5-9.75-9c-3-0.75-3.75-2.25,0-4.5S296.25,102,300,99s21.75-15,22.5-34.5S321.75,31.5,316.5,14.25L316.5,14.25z";

/** Eyes / face mask (white) — the iconic infinity-like shape */
export const PATH_EYES =
  "M147.75,559.5c0.75-58.5,55.5-113.25,124.5-114c87.75-0.75,148.5,87,192.75,86.25c37.5-0.75,109.5-74.25,144.75-74.25c37.5,0,48,39,48,62.25s-7.5,65.25-25.5,91.5s-29.25,36-50.25,34.5c-27-2.25-81-86.25-115.5-87.75c-43.5-1.5-138,90.75-212.25,90.75c-45,0-58.5-6.75-73.5-16.5C158.25,616.5,147,592.5,147.75,559.5L147.75,559.5z";

/** Smile line (white) */
export const PATH_SMILE =
  "M449.25,610.5c12,0,24.75,0.75,33.75,6.75s14.25,19.5,17.25,27s0,12-6,15c-5.25,3-6,1.5-11.25-8.25s-9.75-19.5-36-19.5s-34.5,9-47.25,19.5s-17.25,14.25-21.75,8.25s-3-12,5.25-19.5s21.75-19.5,34.5-24.75S437.25,610.5,449.25,610.5L449.25,610.5z";

/** Lower smile / grin (white) */
export const PATH_GRIN =
  "M324.75,696c15,12,37.5,21.75,85.5,21.75S492,704.25,507,693c6.75-5.25,9.75-0.75,10.5,2.25s2.25,7.5-3,12.75c-3.75,3.75-38.25,27.75-78.75,31.5s-95.25,6-128.25-24c-5.25-5.25-3.75-12.75,0-15.75s6.75-5.25,11.25-5.25S322.5,694.5,324.75,696L324.75,696z";

// ─── Shared Rendering Utilities ─────────────────────────────────────

const SVG_W = 681.167;
const SVG_H = 778.583;
export const DRUPLICON_ASPECT_RATIO = SVG_W / SVG_H;

export function getAspectCompensatedColumns(
  rowCount: number,
  lineHeight: number,
  charWidth: number
) {
  const safeWidth = Math.max(charWidth, 0.01);
  return Math.max(
    1,
    Math.round(rowCount * DRUPLICON_ASPECT_RATIO * (lineHeight / safeWidth))
  );
}

/**
 * Draw the official full-color Druplicon on a canvas context.
 * Automatically scales and centers within the given width/height.
 */
export function drawOfficialDruplicon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options?: {
    padding?: number;
    colorOverride?: string; // single flat color for the body (for masks etc.)
    whiteFeatures?: boolean; // draw eyes/smile in white (default true)
    outline?: boolean; // draw the dark outline ring (default true)
    highlight?: boolean; // draw the highlight reflections (default true)
  }
) {
  const padding = options?.padding ?? 0.05;
  const whiteFeatures = options?.whiteFeatures ?? true;
  const drawOutline = options?.outline ?? true;
  const drawHighlight = options?.highlight ?? true;

  ctx.save();

  // Scale to fit
  const availW = w * (1 - padding * 2);
  const availH = h * (1 - padding * 2);
  const scale = Math.min(availW / SVG_W, availH / SVG_H);
  const offsetX = (w - SVG_W * scale) / 2;
  const offsetY = (h - SVG_H * scale) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // 1. Main body (#00598E)
  const bodyPath = new Path2D(PATH_BODY);
  ctx.fillStyle = options?.colorOverride ?? "#00598E";
  ctx.fill(bodyPath);

  if (!options?.colorOverride) {
    // 2. Left shade (#0073BA)
    const shadePath = new Path2D(PATH_SHADE);
    ctx.fillStyle = "#0073BA";
    ctx.fill(shadePath);

    // 3. Outline ring (#004975)
    if (drawOutline) {
      const outlinePath = new Path2D(PATH_OUTLINE);
      ctx.fillStyle = "#004975";
      ctx.fill(outlinePath);
    }

    // 4. Highlight (#93C5E4)
    if (drawHighlight) {
      const hlPath = new Path2D(PATH_HIGHLIGHT);
      ctx.fillStyle = "#93C5E4";
      ctx.fill(hlPath);

      const whlPath = new Path2D(PATH_WHITE_HIGHLIGHT);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill(whlPath);
    }
  }

  // 5. White face features
  if (whiteFeatures) {
    const eyesPath = new Path2D(PATH_EYES);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill(eyesPath);

    const smilePath = new Path2D(PATH_SMILE);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill(smilePath);

    const grinPath = new Path2D(PATH_GRIN);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill(grinPath);
  }

  ctx.restore();
}

/**
 * Draw a flat single-color silhouette of the Druplicon (for masks, particles, etc.)
 */
export function drawDrupliconMask(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color = "rgba(255,255,255,0.7)"
) {
  ctx.save();

  const scale = Math.min(w / SVG_W, h / SVG_H) * 0.9;
  const offsetX = (w - SVG_W * scale) / 2;
  const offsetY = (h - SVG_H * scale) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Body silhouette
  const bodyPath = new Path2D(PATH_BODY);
  ctx.fillStyle = color;
  ctx.fill(bodyPath);

  // Eyes (brighter)
  const eyesPath = new Path2D(PATH_EYES);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill(eyesPath);

  // Smile
  const smilePath = new Path2D(PATH_SMILE);
  ctx.fill(smilePath);

  const grinPath = new Path2D(PATH_GRIN);
  ctx.fill(grinPath);

  ctx.restore();
}

/**
 * Draw the Druplicon with a custom gradient fill (for colorful ASCII, particles, etc.)
 */
export function drawGradientDruplicon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gradient: CanvasGradient
) {
  ctx.save();

  const scale = Math.min(w / SVG_W, h / SVG_H) * 0.9;
  const offsetX = (w - SVG_W * scale) / 2;
  const offsetY = (h - SVG_H * scale) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Body with gradient
  const bodyPath = new Path2D(PATH_BODY);
  ctx.fillStyle = gradient;
  ctx.fill(bodyPath);

  // Highlight
  const hlPath = new Path2D(PATH_HIGHLIGHT);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill(hlPath);

  const whlPath = new Path2D(PATH_WHITE_HIGHLIGHT);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill(whlPath);

  // White features
  const eyesPath = new Path2D(PATH_EYES);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill(eyesPath);

  const smilePath = new Path2D(PATH_SMILE);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill(smilePath);

  const grinPath = new Path2D(PATH_GRIN);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill(grinPath);

  ctx.restore();
}

/**
 * Draw a brightness-field version (grayscale) for typographic / ASCII mapping.
 */
export function drawBrightnessField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  ctx.save();

  const scale = Math.min(w / SVG_W, h / SVG_H) * 0.9;
  const offsetX = (w - SVG_W * scale) / 2;
  const offsetY = (h - SVG_H * scale) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Body with radial gradient brightness
  const grad = ctx.createRadialGradient(340, 300, 0, 340, 400, 500);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.5, "rgba(200,200,200,0.8)");
  grad.addColorStop(1, "rgba(100,100,100,0.5)");

  const bodyPath = new Path2D(PATH_BODY);
  ctx.fillStyle = grad;
  ctx.fill(bodyPath);

  // Eyes — bright white
  const eyesPath = new Path2D(PATH_EYES);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill(eyesPath);

  // Smile
  const smilePath = new Path2D(PATH_SMILE);
  ctx.fill(smilePath);
  const grinPath = new Path2D(PATH_GRIN);
  ctx.fill(grinPath);

  ctx.restore();
}

/**
 * Get the SVG path strings for use in SVG elements (for neon/line-draw components).
 * Returns paths already in the official 681×779 coordinate space.
 */
export function getSvgPaths() {
  return {
    body: PATH_BODY,
    shade: PATH_SHADE,
    outline: PATH_OUTLINE,
    highlight: PATH_HIGHLIGHT,
    whiteHighlight: PATH_WHITE_HIGHLIGHT,
    eyes: PATH_EYES,
    smile: PATH_SMILE,
    grin: PATH_GRIN,
    viewBox: `0 0 ${SVG_W} ${SVG_H}`,
    width: SVG_W,
    height: SVG_H,
  };
}

// ─── ASCII Utilities ─────────────────────────────────────────────────

export const ASCII_CHARS_DENSE = "@#W$9876543210?!abc;:+=-,._ ";
export const ASCII_CHARS_SIMPLE = "@%#*+=-:. ";
export const ASCII_CHARS_BLOCKS = "█▓▒░ ";
