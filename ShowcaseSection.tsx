/**
 * Showcase Section Wrapper
 * Design: Neon Arcade — each section is a full-viewport immersive experience
 * with numbered labels, descriptions, and subtle grid backgrounds
 */
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShowcaseSectionProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  children: ReactNode;
  accentColor?: "blue" | "pink" | "cyan" | "green" | "amber";
  tech?: string;
}

const accentColors = {
  blue: { text: "#00a8ff", glow: "0 0 20px rgba(0, 168, 255, 0.3)" },
  pink: { text: "#ff0080", glow: "0 0 20px rgba(255, 0, 128, 0.3)" },
  cyan: { text: "#00ffcc", glow: "0 0 20px rgba(0, 255, 204, 0.3)" },
  green: { text: "#00ff41", glow: "0 0 20px rgba(0, 255, 65, 0.3)" },
  amber: { text: "#daa520", glow: "0 0 20px rgba(218, 165, 32, 0.3)" },
};

export default function ShowcaseSection({
  number,
  title,
  subtitle,
  description,
  children,
  accentColor = "blue",
  tech,
}: ShowcaseSectionProps) {
  const accent = accentColors[accentColor];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-baseline gap-4 mb-3">
            <span
              className="text-5xl md:text-7xl font-bold tracking-tighter opacity-20"
              style={{
                fontFamily: "var(--font-heading)",
                color: accent.text,
              }}
            >
              {number}
            </span>
            <div>
              <h2
                className="text-2xl md:text-4xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: accent.text,
                  textShadow: accent.glow,
                }}
              >
                {title}
              </h2>
              <p
                className="text-sm md:text-base tracking-widest uppercase mt-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: accent.text,
                  opacity: 0.6,
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
          {tech && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-mono">
                Tech:
              </span>
              <span
                className="text-[10px] tracking-wider font-mono px-2 py-0.5 rounded border"
                style={{
                  color: accent.text,
                  borderColor: `${accent.text}33`,
                  backgroundColor: `${accent.text}0a`,
                }}
              >
                {tech}
              </span>
            </div>
          )}
        </div>

        {/* Demo area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-lg border border-border/30 bg-black/40 backdrop-blur-sm p-6 md:p-10"
          style={{
            boxShadow: `0 0 40px ${accent.text}08, inset 0 0 40px ${accent.text}05`,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
