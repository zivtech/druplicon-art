/**
 * Glitch/Scan Druplicon
 * Design: Neon Arcade — the Druplicon rendered with horizontal scan line displacement
 * Uses the OFFICIAL Druplicon SVG paths for pixel-perfect accuracy
 */
import { useEffect, useRef } from "react";
import { drawOfficialDruplicon } from "@/lib/druplicon";

export default function GlitchDruplicon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 400;
    const H = 460;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Pre-render the official Druplicon on dark background
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = W;
    srcCanvas.height = H;
    const srcCtx = srcCanvas.getContext("2d")!;
    srcCtx.fillStyle = "#0a0a14";
    srcCtx.fillRect(0, 0, W, H);
    drawOfficialDruplicon(srcCtx, W, H);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    let glitchTimer = 0;
    let isGlitching = false;

    const animate = () => {
      time += 0.016;
      glitchTimer += 0.016;

      if (glitchTimer > 2 + Math.random() * 3) {
        isGlitching = true;
        glitchTimer = 0;
        setTimeout(() => { isGlitching = false; }, 150 + Math.random() * 200);
      }

      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, W, H);

      const mouse = mouseRef.current;
      const mouseDist = Math.sqrt(
        Math.pow(mouse.x - 0.5, 2) + Math.pow(mouse.y - 0.5, 2)
      );
      const mouseInfluence = Math.max(0, 1 - mouseDist * 2);

      const sliceH = 2;
      for (let y = 0; y < H; y += sliceH) {
        let offsetX = 0;
        let rgbSplit = 0;

        if (isGlitching) {
          if (Math.random() < 0.3) {
            offsetX = (Math.random() - 0.5) * 40;
          }
          rgbSplit = Math.random() * 8;
        } else {
          offsetX = Math.sin(y * 0.02 + time * 2) * (1 + mouseInfluence * 5);
          rgbSplit = mouseInfluence * 3;
        }

        if (rgbSplit > 0.5) {
          ctx.globalCompositeOperation = "lighter";
          ctx.drawImage(
            srcCanvas,
            0, y, W, sliceH,
            offsetX - rgbSplit, y, W, sliceH
          );
          ctx.drawImage(
            srcCanvas,
            0, y, W, sliceH,
            offsetX + rgbSplit, y, W, sliceH
          );
          ctx.globalCompositeOperation = "source-over";
        } else {
          ctx.drawImage(
            srcCanvas,
            0, y, W, sliceH,
            offsetX, y, W, sliceH
          );
        }
      }

      // Scan lines overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      for (let y = 0; y < H; y += 3) {
        ctx.fillRect(0, y, W, 1);
      }

      // Random glitch blocks
      if (isGlitching) {
        for (let i = 0; i < 3; i++) {
          const bx = Math.random() * W;
          const by = Math.random() * H;
          const bw = 20 + Math.random() * 80;
          const bh = 2 + Math.random() * 10;
          ctx.drawImage(
            srcCanvas,
            bx, by, bw, bh,
            bx + (Math.random() - 0.5) * 30, by, bw, bh
          );
        }
      }

      // Vignette
      const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.7);
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        style={{ maxWidth: "400px" }}
      />
    </div>
  );
}
