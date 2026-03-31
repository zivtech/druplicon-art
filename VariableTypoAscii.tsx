/**
 * Variable Typographic ASCII Druplicon
 * Inspired by chenglou.me/pretext/variable-typographic-ascii/
 * Uses the official Druplicon geometry and compensates each text panel for the
 * actual cell size of the rendered font, so the silhouette stays intact.
 */
import { useEffect, useRef } from "react";
import {
  DRUPLICON_ASPECT_RATIO,
  drawOfficialDruplicon,
  getAspectCompensatedColumns,
} from "@/lib/druplicon";

const PROP_CHARS_LIGHT = " .,:;'`";
const PROP_CHARS_MED = "iIlL1tfjr";
const PROP_CHARS_HEAVY = "WMQB#@%&$";
const ALL_PROP = PROP_CHARS_LIGHT + PROP_CHARS_MED + PROP_CHARS_HEAVY;
const MONO_CHARS = " .:-=+*#%@";

const PANEL_W = 280;
const PANEL_H = 340;
const PANEL_PADDING = 18;
const PANEL_BG = "#0a0a12";
const TARGET_CONTENT_RATIO = 0.845;
const SOURCE_ROWS = 92;
const SOURCE_COLS = Math.round(SOURCE_ROWS * DRUPLICON_ASPECT_RATIO);
const PROP_FONT_SIZE = 5.5;
const PROP_LINE_HEIGHT = PROP_FONT_SIZE * 1.15;
const MONO_FONT_SIZE = 5.5;
const MONO_LINE_HEIGHT = MONO_FONT_SIZE * 1.1;
const TEXT_ROWS = Math.max(
  36,
  Math.floor((PANEL_H - PANEL_PADDING * 2) / PROP_LINE_HEIGHT)
);

interface FieldParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  brightness: number;
  vx: number;
  vy: number;
}

interface PropGlyphVariant {
  char: string;
  font: string;
  width: number;
  density: number;
  alpha: number;
  color: string;
}

interface CanvasBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  contentWidth: number;
  contentHeight: number;
  contentRatio: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((char) => char + char).join("")
    : value;
  const int = Number.parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildBrightnessField(cols: number, rows: number) {
  const offscreen = document.createElement("canvas");
  offscreen.width = cols;
  offscreen.height = rows;
  const ctx = offscreen.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, cols, rows);
  drawOfficialDruplicon(ctx, cols, rows);

  const image = ctx.getImageData(0, 0, cols, rows).data;
  const field = new Float32Array(cols * rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = (y * cols + x) * 4;
      const r = image[index];
      const g = image[index + 1];
      const b = image[index + 2];
      const a = image[index + 3];
      field[y * cols + x] =
        ((r * 0.299 + g * 0.587 + b * 0.114) / 255) * (a / 255);
    }
  }

  return field;
}

function buildSourceParticles(cols: number, rows: number) {
  const field = buildBrightnessField(cols, rows);
  const particles: FieldParticle[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const brightness = field[y * cols + x];
      if (brightness > 0.05) {
        particles.push({
          x: x + (Math.random() - 0.5) * 2,
          y: y + (Math.random() - 0.5) * 2,
          targetX: x,
          targetY: y,
          brightness,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
        });
      }
    }
  }

  return particles;
}

function buildPropGlyphs(ctx: CanvasRenderingContext2D) {
  const variants = [
    { chars: PROP_CHARS_LIGHT, weight: "400", style: "normal", color: "#93C5E4", alpha: 0.88 },
    { chars: PROP_CHARS_MED, weight: "400", style: "italic", color: "#0073BA", alpha: 0.96 },
    { chars: PROP_CHARS_MED, weight: "600", style: "italic", color: "#00598E", alpha: 1.02 },
    { chars: PROP_CHARS_HEAVY, weight: "700", style: "normal", color: "#004975", alpha: 1.08 },
  ] as const;

  const rankMap = new Map(
    [...ALL_PROP].map((char, index) => [char, index / (ALL_PROP.length - 1)])
  );
  const glyphs: PropGlyphVariant[] = [];

  for (const variant of variants) {
    for (const char of variant.chars) {
      const font = `${variant.style} ${variant.weight} ${PROP_FONT_SIZE}px Georgia, serif`;
      ctx.font = font;
      glyphs.push({
        char,
        font,
        width: ctx.measureText(char).width,
        density: clamp(
          (rankMap.get(char) ?? 0) +
            (variant.weight === "700" ? 0.12 : variant.weight === "600" ? 0.07 : 0) +
            (variant.style === "italic" ? 0.03 : 0),
          0,
          1
        ),
        alpha: variant.alpha,
        color: variant.color,
      });
    }
  }

  glyphs.sort((left, right) => left.density - right.density);
  return glyphs;
}

function selectPropGlyph(
  glyphs: PropGlyphVariant[],
  brightness: number,
  targetWidth: number
) {
  let bestGlyph = glyphs[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const glyph of glyphs) {
    const densityError = Math.abs(glyph.density - brightness);
    const widthError = Math.abs(glyph.width - targetWidth) / targetWidth;
    const score = densityError * 0.82 + widthError * 0.18;
    if (score < bestScore) {
      bestScore = score;
      bestGlyph = glyph;
    }
  }

  return bestGlyph;
}

function measurePaintedBounds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): CanvasBounds | null {
  const data = ctx.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      const diff =
        Math.abs(r - 10) + Math.abs(g - 10) + Math.abs(b - 18);
      if (a > 0 && diff > 18) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === -1) {
    return null;
  }

  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  return {
    minX,
    minY,
    maxX,
    maxY,
    contentWidth,
    contentHeight,
    contentRatio: contentWidth / contentHeight,
  };
}

function drawScaledToTargetRatio(
  targetCtx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  targetRatio: number
) {
  targetCtx.fillStyle = PANEL_BG;
  targetCtx.fillRect(0, 0, PANEL_W, PANEL_H);

  const sourceCtx = sourceCanvas.getContext("2d")!;
  const bounds = measurePaintedBounds(sourceCtx, PANEL_W, PANEL_H);
  if (!bounds) {
    targetCtx.drawImage(sourceCanvas, 0, 0);
    return;
  }

  const scaleX = clamp(targetRatio / bounds.contentRatio, 0.8, 2.4);
  targetCtx.save();
  targetCtx.translate(PANEL_W / 2, 0);
  targetCtx.scale(scaleX, 1);
  targetCtx.translate(-PANEL_W / 2, 0);
  targetCtx.drawImage(sourceCanvas, 0, 0);
  targetCtx.restore();
}

export default function VariableTypoAscii() {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const propCanvasRef = useRef<HTMLCanvasElement>(null);
  const monoCanvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const sourceCanvas = sourceCanvasRef.current;
    const propCanvas = propCanvasRef.current;
    const monoCanvas = monoCanvasRef.current;
    if (!sourceCanvas || !propCanvas || !monoCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const sourceCtx = sourceCanvas.getContext("2d")!;
    const propCtx = propCanvas.getContext("2d")!;
    const monoCtx = monoCanvas.getContext("2d")!;

    [sourceCanvas, propCanvas, monoCanvas].forEach((canvas) => {
      canvas.width = PANEL_W * dpr;
      canvas.height = PANEL_H * dpr;
      canvas.style.width = `${PANEL_W}px`;
      canvas.style.height = `${PANEL_H}px`;
    });

    [sourceCtx, propCtx, monoCtx].forEach((ctx) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.textBaseline = "middle";
    });

    const sourceParticles = buildSourceParticles(SOURCE_COLS, SOURCE_ROWS);
    const propGlyphs = buildPropGlyphs(propCtx);
    const propCellWidth =
      propGlyphs.reduce((sum, glyph) => sum + glyph.width, 0) / propGlyphs.length;
    const propCols = getAspectCompensatedColumns(
      TEXT_ROWS,
      PROP_LINE_HEIGHT,
      propCellWidth
    );
    const propField = buildBrightnessField(propCols, TEXT_ROWS);

    monoCtx.font = `400 ${MONO_FONT_SIZE}px "Fira Code", monospace`;
    const monoCellWidth =
      monoCtx.measureText("M").width || MONO_FONT_SIZE * 0.6;
    const monoCols = getAspectCompensatedColumns(
      TEXT_ROWS,
      MONO_LINE_HEIGHT,
      monoCellWidth
    );
    const monoField = buildBrightnessField(monoCols, TEXT_ROWS);

    const renderPropPanel = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = PANEL_W;
      offscreen.height = PANEL_H;
      const offscreenCtx = offscreen.getContext("2d")!;
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.fillStyle = PANEL_BG;
      offscreenCtx.fillRect(0, 0, PANEL_W, PANEL_H);

      const offsetX = (PANEL_W - propCols * propCellWidth) / 2;
      const offsetY = (PANEL_H - TEXT_ROWS * PROP_LINE_HEIGHT) / 2 + PROP_FONT_SIZE * 0.5;

      for (let y = 0; y < TEXT_ROWS; y++) {
        for (let x = 0; x < propCols; x++) {
          const brightness = propField[y * propCols + x];
          if (brightness <= 0.04) continue;

          const glyph = selectPropGlyph(propGlyphs, brightness, propCellWidth);
          const drawX =
            x * propCellWidth + offsetX + (propCellWidth - glyph.width) / 2;
          const drawY = y * PROP_LINE_HEIGHT + offsetY;

          offscreenCtx.font = glyph.font;
          offscreenCtx.shadowBlur = 5;
          offscreenCtx.shadowColor = hexToRgba(glyph.color, 0.45);
          offscreenCtx.fillStyle = hexToRgba(
            glyph.color,
            clamp((0.5 + brightness * 0.6) * glyph.alpha, 0, 1)
          );
          offscreenCtx.fillText(glyph.char, drawX, drawY);
        }
      }

      drawScaledToTargetRatio(propCtx, offscreen, TARGET_CONTENT_RATIO);
    };

    const renderMonoPanel = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = PANEL_W;
      offscreen.height = PANEL_H;
      const offscreenCtx = offscreen.getContext("2d")!;
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.fillStyle = PANEL_BG;
      offscreenCtx.fillRect(0, 0, PANEL_W, PANEL_H);

      offscreenCtx.font = `400 ${MONO_FONT_SIZE}px "Fira Code", monospace`;
      const offsetX = (PANEL_W - monoCols * monoCellWidth) / 2;
      const offsetY = (PANEL_H - TEXT_ROWS * MONO_LINE_HEIGHT) / 2 + MONO_FONT_SIZE * 0.5;

      for (let y = 0; y < TEXT_ROWS; y++) {
        for (let x = 0; x < monoCols; x++) {
          const brightness = monoField[y * monoCols + x];
          if (brightness <= 0.04) continue;

          const charIndex = Math.floor(brightness * (MONO_CHARS.length - 1));
          const char = MONO_CHARS[Math.min(charIndex, MONO_CHARS.length - 1)];
          const tone =
            brightness > 0.72
              ? "#004975"
              : brightness > 0.45
                ? "#00598E"
                : brightness > 0.22
                  ? "#0073BA"
                  : "#93C5E4";
          const drawX = x * monoCellWidth + offsetX;
          const drawY = y * MONO_LINE_HEIGHT + offsetY;

          offscreenCtx.shadowBlur = 5;
          offscreenCtx.shadowColor = hexToRgba(tone, 0.42);
          offscreenCtx.fillStyle = hexToRgba(tone, 0.58 + brightness * 0.52);
          offscreenCtx.fillText(char, drawX, drawY);
        }
      }

      drawScaledToTargetRatio(monoCtx, offscreen, TARGET_CONTENT_RATIO);
    };

    renderPropPanel();
    renderMonoPanel();

    const animate = () => {
      const liveField = new Float32Array(SOURCE_COLS * SOURCE_ROWS);

      for (const particle of sourceParticles) {
        particle.vx +=
          (Math.random() - 0.5) * 0.08 + (particle.targetX - particle.x) * 0.024;
        particle.vy +=
          (Math.random() - 0.5) * 0.08 + (particle.targetY - particle.y) * 0.024;
        particle.vx *= 0.94;
        particle.vy *= 0.94;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const fieldX = Math.round(particle.x);
        const fieldY = Math.round(particle.y);
        if (
          fieldX >= 0 &&
          fieldX < SOURCE_COLS &&
          fieldY >= 0 &&
          fieldY < SOURCE_ROWS
        ) {
          const index = fieldY * SOURCE_COLS + fieldX;
          liveField[index] = Math.min(
            1,
            liveField[index] + particle.brightness * 0.8
          );

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = fieldX + dx;
              const ny = fieldY + dy;
              if (nx >= 0 && nx < SOURCE_COLS && ny >= 0 && ny < SOURCE_ROWS) {
                const neighborIndex = ny * SOURCE_COLS + nx;
                liveField[neighborIndex] = Math.min(
                  1,
                  liveField[neighborIndex] + particle.brightness * 0.22
                );
              }
            }
          }
        }
      }

      sourceCtx.fillStyle = "rgba(10, 10, 18, 0.28)";
      sourceCtx.fillRect(0, 0, PANEL_W, PANEL_H);

      const cellW = PANEL_W / SOURCE_COLS;
      const cellH = PANEL_H / SOURCE_ROWS;

      for (let y = 0; y < SOURCE_ROWS; y++) {
        for (let x = 0; x < SOURCE_COLS; x++) {
          const brightness = liveField[y * SOURCE_COLS + x];
          if (brightness <= 0.05) continue;

          const drawX = x * cellW + cellW / 2;
          const drawY = y * cellH + cellH / 2;
          const radius = brightness * Math.min(cellW, cellH) * 0.85;
          const fill =
            brightness > 0.68
              ? "rgba(147, 197, 228, 0.82)"
              : brightness > 0.38
                ? "rgba(0, 115, 186, 0.7)"
                : "rgba(0, 89, 142, 0.56)";
          const glow =
            brightness > 0.55
              ? "rgba(0, 73, 117, 0.22)"
              : "rgba(0, 89, 142, 0.14)";

          sourceCtx.beginPath();
          sourceCtx.arc(drawX, drawY, radius, 0, Math.PI * 2);
          sourceCtx.fillStyle = fill;
          sourceCtx.fill();

          if (brightness > 0.32) {
            sourceCtx.beginPath();
            sourceCtx.arc(drawX, drawY, radius * 2.2, 0, Math.PI * 2);
            sourceCtx.fillStyle = glow;
            sourceCtx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-mono">
            Source Field
          </span>
          <canvas
            ref={sourceCanvasRef}
            className="border border-border/30 rounded"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-[10px] tracking-[0.3em] uppercase font-mono"
            style={{ color: "#00598E" }}
          >
            Proportional &times; Measured Width
          </span>
          <canvas
            ref={propCanvasRef}
            className="border border-border/30 rounded"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-mono">
            Monospace &times; Tight Grid
          </span>
          <canvas
            ref={monoCanvasRef}
            className="border border-border/30 rounded"
          />
        </div>
      </div>
    </div>
  );
}
