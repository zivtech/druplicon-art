/**
 * Line Draw Druplicon
 * Design: Neon Arcade — SVG path that draws itself with a neon trail
 * Uses the OFFICIAL Druplicon SVG paths for pixel-perfect accuracy
 */
import { useEffect, useRef, useState } from "react";
import { getSvgPaths } from "@/lib/druplicon";

export default function LineDrawDruplicon() {
  const [phase, setPhase] = useState(0); // 0=waiting, 1=drawing outline, 2=drawing face, 3=done
  const containerRef = useRef<HTMLDivElement>(null);
  const paths = getSvgPaths();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && phase === 0) {
          setPhase(1);
          setTimeout(() => setPhase(2), 2500);
          setTimeout(() => setPhase(3), 4000);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [phase]);

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full">
      <svg viewBox={paths.viewBox} className="w-full max-w-[400px]">
        <defs>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Body outline — draws itself */}
        <path
          d={paths.body}
          fill="none"
          stroke="#00a8ff"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 3000,
            strokeDashoffset: phase >= 1 ? 0 : 3000,
            transition: "stroke-dashoffset 2.5s ease-in-out",
          }}
        />

        {/* Subtle fill that fades in */}
        <path
          d={paths.body}
          fill="rgba(0, 168, 255, 0.06)"
          stroke="none"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />

        {/* Highlight reflection */}
        <path
          d={paths.highlight}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="3"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 1500,
            strokeDashoffset: phase >= 2 ? 0 : 1500,
            transition: "stroke-dashoffset 1s ease-in-out 0.2s",
            opacity: 0.5,
          }}
        />

        {/* Eyes — draws after body, same cyan as smile/grin */}
        <path
          d={paths.eyes}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="4"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: phase >= 2 ? 0 : 2000,
            transition: "stroke-dashoffset 1.2s ease-in-out",
          }}
        />

        {/* Eyes fill that fades in */}
        <path
          d={paths.eyes}
          fill="#00ffcc"
          stroke="none"
          style={{
            opacity: phase >= 3 ? 0.15 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />

        {/* Smile — same cyan as eyes */}
        <path
          d={paths.smile}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 800,
            strokeDashoffset: phase >= 2 ? 0 : 800,
            transition: "stroke-dashoffset 0.8s ease-in-out 0.5s",
          }}
        />

        {/* Grin — same cyan as eyes */}
        <path
          d={paths.grin}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: phase >= 2 ? 0 : 600,
            transition: "stroke-dashoffset 0.6s ease-in-out 0.8s",
          }}
        />
      </svg>
    </div>
  );
}
