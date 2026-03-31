/**
 * Neon SVG Druplicon
 * Design: Neon Arcade — glowing SVG outline with animated pulse
 * Uses the OFFICIAL Druplicon SVG paths for pixel-perfect accuracy
 */
import { useEffect, useState } from "react";
import { getSvgPaths } from "@/lib/druplicon";

export default function NeonSvgDruplicon() {
  const [mounted, setMounted] = useState(false);
  const paths = getSvgPaths();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <svg
        viewBox={paths.viewBox}
        className="w-full max-w-[400px] transition-opacity duration-1000"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <defs>
          {/* Blue neon glow */}
          <filter id="neonBlue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cyan glow for features */}
          <filter id="neonCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cyan glow for smile (same as eyes) */}
          <filter id="neonPink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated gradient */}
          <linearGradient id="outlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00a8ff">
              <animate attributeName="stop-color" values="#00a8ff;#ff0080;#00ffcc;#00a8ff" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#ff0080">
              <animate attributeName="stop-color" values="#ff0080;#00ffcc;#00a8ff;#ff0080" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#00ffcc">
              <animate attributeName="stop-color" values="#00ffcc;#00a8ff;#ff0080;#00ffcc" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Very subtle body fill */}
        <path d={paths.body} fill="rgba(0, 168, 255, 0.04)" />

        {/* Body outline with neon glow */}
        <path
          d={paths.body}
          fill="none"
          stroke="url(#outlineGrad)"
          strokeWidth="5"
          filter="url(#neonBlue)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate attributeName="stroke-width" values="5;6.5;5" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Highlight reflection */}
        <path
          d={paths.highlight}
          fill="none"
          stroke="#93C5E4"
          strokeWidth="3"
          opacity="0.4"
          filter="url(#neonCyan)"
        >
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.5s" repeatCount="indefinite" />
        </path>

        {/* Eyes — neon cyan */}
        <path
          d={paths.eyes}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="4"
          filter="url(#neonCyan)"
        />

        {/* Smile — neon cyan (same as eyes) */}
        <path
          d={paths.smile}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#neonCyan)"
        >
          <animate attributeName="stroke-width" values="3.5;4.5;3.5" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Grin — neon cyan (same as eyes) */}
        <path
          d={paths.grin}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#neonCyan)"
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 360 + (i % 3) * 30;
          const cx = 340 + Math.cos(angle) * radius;
          const cy = 400 + Math.sin(angle) * radius;
          const delay = i * 0.4;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4"
              fill={i % 3 === 0 ? "#ff0080" : i % 3 === 1 ? "#00a8ff" : "#00ffcc"}
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.8;0"
                dur="3s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="3;6;3"
                dur="3s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
