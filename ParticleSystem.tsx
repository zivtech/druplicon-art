/**
 * Interactive Particle System Druplicon
 * Design: Neon Arcade — thousands of particles form the Druplicon shape
 * Uses the OFFICIAL Druplicon SVG paths for pixel-perfect particle placement
 */
import { useCallback, useEffect, useRef } from "react";
import { drawGradientDruplicon } from "@/lib/druplicon";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export default function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const offscreen = document.createElement("canvas");
    const W = 340;
    const H = 390;
    offscreen.width = W;
    offscreen.height = H;
    const ctx = offscreen.getContext("2d")!;

    // Create neon gradient
    const grad = ctx.createRadialGradient(
      W * 0.4, H * 0.3, 0,
      W * 0.5, H * 0.5, W * 0.55
    );
    grad.addColorStop(0, "#00e5ff");
    grad.addColorStop(0.4, "#0088ff");
    grad.addColorStop(0.7, "#0044cc");
    grad.addColorStop(1, "#001155");

    drawGradientDruplicon(ctx, W, H, grad);

    const imageData = ctx.getImageData(0, 0, W, H);
    const particles: Particle[] = [];
    const step = 2;

    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        const a = imageData.data[i + 3];
        if (a > 30) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          const canvasX = (x / W) * canvas.width;
          const canvasY = (y / H) * canvas.height;

          particles.push({
            x: canvasX + (Math.random() - 0.5) * canvas.width,
            y: canvasY + (Math.random() - 0.5) * canvas.height,
            targetX: canvasX,
            targetY: canvasY,
            vx: 0,
            vy: 0,
            size: 1 + Math.random() * 1.5,
            color: `rgb(${r},${g},${b})`,
            alpha: (a / 255) * 0.8 + 0.2,
          });
        }
      }
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, 500);
      canvas.width = size * dpr;
      canvas.height = size * 1.15 * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size * 1.15}px`;
      initParticles(canvas);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.fillStyle = "rgba(8, 8, 20, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const mouseRadius = 60 * (window.devicePixelRatio || 1);

      for (const p of particlesRef.current) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius;
          p.vx += (dx / dist) * force * 3;
          p.vy += (dy / dist) * force * 3;
        }

        const tx = p.targetX - p.x;
        const ty = p.targetY - p.y;
        p.vx += tx * 0.03;
        p.vy += ty * 0.03;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        if (p.alpha > 0.7) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.1;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <div className="flex items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        style={{ maxWidth: "500px", maxHeight: "575px" }}
      />
    </div>
  );
}
