/**
 * Matrix Code Rain Druplicon
 * Design: Neon Arcade — falling green characters reveal the Druplicon shape
 * Uses the OFFICIAL Druplicon SVG paths as a brightness mask
 * Approach: Two-layer rendering — background rain everywhere, but chars inside the
 * Druplicon silhouette are much brighter/larger. Face features (eyes/smile/grin)
 * get an extra-bright white-green treatment so they're clearly legible.
 */
import { useEffect, useRef } from "react";
import {
  PATH_BODY,
  PATH_EYES,
  PATH_SMILE,
  PATH_GRIN,
} from "@/lib/druplicon";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

const SVG_W = 681.167;
const SVG_H = 778.583;

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = 550;
    const displayH = 600;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Build a high-res mask with 3 zones: 0=outside, 1=body, 2=face features
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = displayW;
    maskCanvas.height = displayH;
    const maskCtx = maskCanvas.getContext("2d")!;

    const scale = Math.min(displayW / SVG_W, displayH / SVG_H) * 0.88;
    const ox = (displayW - SVG_W * scale) / 2;
    const oy = (displayH - SVG_H * scale) / 2;

    // Draw body as zone 1 (red channel = 128)
    maskCtx.save();
    maskCtx.translate(ox, oy);
    maskCtx.scale(scale, scale);
    maskCtx.fillStyle = "rgb(128, 0, 0)";
    maskCtx.fill(new Path2D(PATH_BODY));
    // Draw face features as zone 2 (red channel = 255)
    maskCtx.fillStyle = "rgb(255, 0, 0)";
    maskCtx.fill(new Path2D(PATH_EYES));
    maskCtx.fill(new Path2D(PATH_SMILE));
    maskCtx.fill(new Path2D(PATH_GRIN));
    maskCtx.restore();

    const maskData = maskCtx.getImageData(0, 0, displayW, displayH);

    function getZone(x: number, y: number): number {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      if (ix < 0 || ix >= displayW || iy < 0 || iy >= displayH) return 0;
      const r = maskData.data[(iy * displayW + ix) * 4];
      if (r > 200) return 2; // face features
      if (r > 50) return 1; // body
      return 0; // outside
    }

    // Create rain columns
    const fontSize = 13;
    const colW = fontSize * 0.65;
    const numCols = Math.ceil(displayW / colW);

    interface RainDrop {
      y: number;
      speed: number;
      length: number;
      chars: string[];
    }

    const columns: RainDrop[] = [];
    for (let i = 0; i < numCols; i++) {
      const length = 8 + Math.floor(Math.random() * 18);
      const chars: string[] = [];
      for (let j = 0; j < length; j++) {
        chars.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
      }
      columns.push({
        y: Math.random() * displayH * 2 - displayH,
        speed: 1.5 + Math.random() * 3.5,
        length,
        chars,
      });
    }

    let frame = 0;

    const animate = () => {
      frame++;

      // Fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, displayW, displayH);

      ctx.textBaseline = "top";

      for (let col = 0; col < numCols; col++) {
        const drop = columns[col];
        const x = col * colW;

        drop.y += drop.speed;
        if (drop.y - drop.length * fontSize > displayH) {
          drop.y = -drop.length * fontSize;
          drop.speed = 1.5 + Math.random() * 3.5;
        }

        // Randomize a char occasionally
        if (frame % 4 === 0) {
          const idx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        for (let j = 0; j < drop.length; j++) {
          const charY = drop.y + j * fontSize;
          if (charY < -fontSize || charY > displayH + fontSize) continue;

          const zone = getZone(x + colW / 2, charY);
          const isHead = j === drop.length - 1;
          const trail = 1 - (drop.length - 1 - j) / drop.length;

          if (zone === 2) {
            // Face features — bright white-green, very visible
            if (isHead) {
              ctx.font = `bold ${fontSize + 2}px "Fira Code", monospace`;
              ctx.fillStyle = "rgba(255, 255, 255, 1)";
              ctx.shadowColor = "#00ff88";
              ctx.shadowBlur = 12;
            } else {
              ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
              ctx.fillStyle = `rgba(180, 255, 200, ${0.5 + trail * 0.5})`;
              ctx.shadowColor = "#00ff88";
              ctx.shadowBlur = 6;
            }
          } else if (zone === 1) {
            // Body — bright green
            if (isHead) {
              ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
              ctx.fillStyle = "rgba(100, 255, 120, 1)";
              ctx.shadowColor = "#00ff41";
              ctx.shadowBlur = 8;
            } else {
              ctx.font = `${fontSize}px "Fira Code", monospace`;
              ctx.fillStyle = `rgba(0, ${Math.floor(160 + trail * 95)}, ${Math.floor(30 + trail * 40)}, ${0.35 + trail * 0.55})`;
              ctx.shadowBlur = 0;
            }
          } else {
            // Outside — very dim
            if (isHead) {
              ctx.font = `${fontSize - 1}px "Fira Code", monospace`;
              ctx.fillStyle = "rgba(0, 100, 0, 0.3)";
              ctx.shadowBlur = 0;
            } else {
              ctx.font = `${fontSize - 1}px "Fira Code", monospace`;
              ctx.fillStyle = `rgba(0, ${Math.floor(40 + trail * 30)}, 0, ${trail * 0.08})`;
              ctx.shadowBlur = 0;
            }
          }

          ctx.fillText(drop.chars[j], x, charY);
          ctx.shadowBlur = 0;
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
    <div className="flex items-center justify-center w-full">
      <canvas ref={canvasRef} style={{ maxWidth: "550px" }} />
    </div>
  );
}
