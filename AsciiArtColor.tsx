/**
 * Colorful ASCII Art Druplicon
 * Design: Neon Arcade — vibrant gradient colors mapped to character density
 * Uses the OFFICIAL Druplicon SVG paths rendered with a neon gradient, then per-pixel color ASCII
 * SVG aspect ratio: 681:779 ≈ 0.874:1 — canvas must be taller than wide
 * Monospace chars are ~2x taller than wide, so we double the horizontal resolution
 */
import { useEffect, useRef, useState } from "react";
import {
  drawOfficialDruplicon,
  getAspectCompensatedColumns,
} from "@/lib/druplicon";

const ASCII_CHARS = " .,:;i1tfLCG08@";
const ASCII_SCALE_X = 1.67;

interface ColorChar {
  char: string;
  color: string;
}

export default function AsciiArtColor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiGrid, setAsciiGrid] = useState<ColorChar[][]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const fontSize = window.matchMedia("(min-width: 768px)").matches
      ? 7
      : window.matchMedia("(min-width: 640px)").matches
        ? 5.5
        : 4;
    ctx.font = `${fontSize}px "Fira Code", monospace`;

    const charWidth = ctx.measureText("M").width || fontSize * 0.6;
    const ROWS = 70;
    const COLS = getAspectCompensatedColumns(ROWS, fontSize, charWidth);

    const W = COLS;
    const H = ROWS;
    canvas.width = W;
    canvas.height = H;

    drawOfficialDruplicon(ctx, W, H);

    const imageData = ctx.getImageData(0, 0, W, H);
    const grid: ColorChar[][] = [];

    for (let y = 0; y < H; y++) {
      const row: ColorChar[] = [];
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];

        if (a < 10) {
          row.push({ char: " ", color: "transparent" });
          continue;
        }

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);
        const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
        const char = ASCII_CHARS[charIndex];

        row.push({
          char,
          color: `rgb(${r},${g},${b})`,
        });
      }
      grid.push(row);
    }

    let minCol = W;
    let maxCol = -1;
    let minRow = H;
    let maxRow = -1;

    grid.forEach((row, rowIndex) => {
      const first = row.findIndex((cell) => cell.char !== " ");
      if (first === -1) return;
      const last =
        row.length -
        1 -
        [...row]
          .reverse()
          .findIndex((cell) => cell.char !== " ");
      minCol = Math.min(minCol, first);
      maxCol = Math.max(maxCol, last);
      minRow = Math.min(minRow, rowIndex);
      maxRow = Math.max(maxRow, rowIndex);
    });

    const croppedGrid =
      maxCol >= minCol
        ? grid
            .slice(minRow, maxRow + 1)
            .map((row) => row.slice(minCol, maxCol + 1))
        : grid;

    setAsciiGrid(croppedGrid);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className="relative flex justify-center overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <pre
        className="inline-block text-[4px] sm:text-[5.5px] md:text-[7px] leading-[1.0] select-all transition-opacity duration-1000"
        style={{
          opacity: loaded ? 1 : 0,
          fontFamily: "'Fira Code', monospace",
          whiteSpace: "pre",
          textAlign: "center",
          transform: `scaleX(${ASCII_SCALE_X})`,
          transformOrigin: "center top",
        }}
      >
        {asciiGrid.map((row, y) => (
          <div key={y} style={{ display: "flex", justifyContent: "center" }}>
            {row.map((cell, x) => (
              <span
                key={x}
                style={{
                  color: cell.color,
                  textShadow:
                    cell.char !== " "
                      ? `0 0 4px ${cell.color}`
                      : "none",
                }}
              >
                {cell.char}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}
