/**
 * B&W ASCII Art Druplicon
 * Design: Neon Arcade — monochrome terminal aesthetic
 * Uses the OFFICIAL Druplicon SVG paths rendered to canvas, then density-mapped to ASCII
 * SVG aspect ratio: 681:779 ≈ 0.874:1 — canvas must be taller than wide
 * Monospace chars are ~2x taller than wide, so we double the horizontal resolution
 */
import { useEffect, useRef, useState } from "react";
import {
  drawOfficialDruplicon,
  getAspectCompensatedColumns,
} from "@/lib/druplicon";

const ASCII_CHARS = " .:-=+*#%@";
const ASCII_SCALE_X = 1.67;

export default function AsciiArtBW() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiLines, setAsciiLines] = useState<string[]>([]);
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

    // Match the actual rendered glyph width instead of relying on a hardcoded ratio.
    const charWidth = ctx.measureText("M").width || fontSize * 0.6;
    const ROWS = 70;
    const COLS = getAspectCompensatedColumns(ROWS, fontSize, charWidth);

    const W = COLS;
    const H = ROWS;
    canvas.width = W;
    canvas.height = H;

    // Clear to black
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    // Draw the official Druplicon
    drawOfficialDruplicon(ctx, W, H);

    // Read pixel data and convert to ASCII
    const imageData = ctx.getImageData(0, 0, W, H);
    const lines: string[] = [];

    for (let y = 0; y < H; y++) {
      let line = "";
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);
        const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
        line += ASCII_CHARS[charIndex];
      }
      lines.push(line);
    }

    let minCol = W;
    let maxCol = -1;
    let minRow = H;
    let maxRow = -1;

    lines.forEach((line, row) => {
      const first = line.search(/[^ ]/);
      if (first === -1) return;
      const last =
        line.length -
        1 -
        [...line]
          .reverse()
          .join("")
          .search(/[^ ]/);
      minCol = Math.min(minCol, first);
      maxCol = Math.max(maxCol, last);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
    });

    const croppedLines =
      maxCol >= minCol
        ? lines
            .slice(minRow, maxRow + 1)
            .map((line) => line.slice(minCol, maxCol + 1))
        : lines;

    setAsciiLines(croppedLines);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className="relative flex justify-center overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <pre
        className="inline-block font-mono text-[4px] sm:text-[5.5px] md:text-[7px] leading-[1.0] select-all transition-opacity duration-1000"
        style={{
          color: "#e0e0e0",
          opacity: loaded ? 1 : 0,
          fontFamily: "'Fira Code', monospace",
          whiteSpace: "pre",
          textAlign: "center",
          transform: `scaleX(${ASCII_SCALE_X})`,
          transformOrigin: "center top",
        }}
      >
        {asciiLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </div>
  );
}
