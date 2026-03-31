/**
 * Druplicon Digital Art Showcase — Home Page
 * Design: Neon Arcade — Cyberpunk Interactive Playground
 * Deep dark backgrounds, neon accents, immersive full-viewport sections
 */
import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import ShowcaseSection from "@/components/ShowcaseSection";

// Lazy load heavy components
const AsciiArtBW = lazy(() => import("@/components/AsciiArtBW"));
const AsciiArtColor = lazy(() => import("@/components/AsciiArtColor"));
const ParticleSystem = lazy(() => import("@/components/ParticleSystem"));
const MatrixRain = lazy(() => import("@/components/MatrixRain"));
const VariableTypoAscii = lazy(() => import("@/components/VariableTypoAscii"));
const NeonSvgDruplicon = lazy(() => import("@/components/NeonSvgDruplicon"));
const GlitchDruplicon = lazy(() => import("@/components/GlitchDruplicon"));
const LineDrawDruplicon = lazy(() => import("@/components/LineDrawDruplicon"));

const HERO_NEON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663270196676/Mb3yn5JntwXPEkRC3WoG2b/01_neon_cyberpunk_c0249428.png";
const HERO_PARTICLE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663270196676/Mb3yn5JntwXPEkRC3WoG2b/03_particle_system_781a1c7c.png";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#00a8ff", borderTopColor: "transparent" }} />
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background images with parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative">
              <img
                src={HERO_NEON}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="w-1/2 h-full relative">
              <img
                src={HERO_PARTICLE}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-15"
              />
            </div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-40 z-[1]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p
              className="text-xs md:text-sm tracking-[0.4em] uppercase mb-6"
              style={{
                fontFamily: "var(--font-mono)",
                color: "#00a8ff",
              }}
            >
              Digital Art Collection
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(135deg, #00a8ff 0%, #ff0080 50%, #00ffcc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Druplicon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            A collection of creative digital interpretations of the iconic Drupal mascot.
            From ASCII art to interactive particle systems, each piece reimagines the
            Druplicon through a different digital lens.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-3 text-[10px] tracking-widest uppercase font-mono text-muted-foreground"
          >
            {["ASCII Art", "Canvas", "SVG", "Particles", "Typographic", "Interactive"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-border/40"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase font-mono text-muted-foreground">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* ===== SECTION 1: B&W ASCII ===== */}
      <ShowcaseSection
        number="01"
        title="Monochrome ASCII"
        subtitle="Black & White Terminal Art"
        description="The Druplicon rendered in pure ASCII characters on a dark terminal. Character density maps to brightness — dense characters like @ and # form the body, while dots and spaces create the lighter areas. A love letter to the command line."
        accentColor="cyan"
        tech="Canvas → Pixel Sampling → ASCII Mapping"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <AsciiArtBW />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 2: Colorful ASCII ===== */}
      <ShowcaseSection
        number="02"
        title="Brand Palette ASCII"
        subtitle="Official Drupal Blues"
        description="Each character inherits its color from the official Druplicon artwork, preserving the body blue, shadow blue, dark outline, and pale highlight instead of a synthetic neon wash. White characters keep the iconic face features crisp."
        accentColor="blue"
        tech="Official Artwork → Per-Pixel Color → Character Sampling"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <AsciiArtColor />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 3: Neon SVG ===== */}
      <ShowcaseSection
        number="03"
        title="Neon Wireframe"
        subtitle="Animated SVG with Glow Filters"
        description="A clean SVG rendering with layered Gaussian blur filters creating an authentic neon tube effect. The outline pulses with an animated gradient that cycles through blue, pink, and cyan. Floating particles orbit the shape."
        accentColor="blue"
        tech="SVG Filters → CSS Animations → Gradient Animation"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <NeonSvgDruplicon />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 4: Line Draw ===== */}
      <ShowcaseSection
        number="04"
        title="Self-Drawing"
        subtitle="Animated Line Art"
        description="Watch the Druplicon draw itself as you scroll into view. The outline traces first, followed by the face features, creating a satisfying reveal animation. Uses SVG stroke-dashoffset animation for the drawing effect."
        accentColor="pink"
        tech="SVG Stroke Animation → Intersection Observer → Phased Reveal"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <LineDrawDruplicon />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 5: Particle System ===== */}
      <ShowcaseSection
        number="05"
        title="Particle Cloud"
        subtitle="Interactive Particle System"
        description="Thousands of particles are positioned to form the Druplicon shape. Move your mouse over the canvas to scatter them — they'll spring back into formation when you move away. Each particle carries color from the original gradient."
        accentColor="cyan"
        tech="Canvas 2D → Spring Physics → Mouse Repulsion"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ParticleSystem />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 6: Matrix Rain ===== */}
      <ShowcaseSection
        number="06"
        title="Code Rain"
        subtitle="Matrix-Style Digital Rain"
        description="Cascading streams of Japanese katakana and hexadecimal characters fall like rain, with the Druplicon shape acting as a brightness mask. Characters inside the shape glow brighter and more intensely, revealing the mascot within the digital downpour."
        accentColor="green"
        tech="Canvas Animation → Brightness Mask → Character Rain"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <MatrixRain />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 7: Glitch ===== */}
      <ShowcaseSection
        number="07"
        title="Glitch Distortion"
        subtitle="Scan Line Displacement"
        description="The Druplicon rendered with horizontal scan line displacement and periodic glitch effects. Move your mouse closer to intensify the chromatic aberration. Random glitch bursts displace horizontal slices of the image, creating a corrupted signal aesthetic."
        accentColor="pink"
        tech="Canvas Slice Rendering → RGB Split → Random Displacement"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <GlitchDruplicon />
        </Suspense>
      </ShowcaseSection>

      {/* ===== SECTION 8: Variable Typographic ASCII ===== */}
      <ShowcaseSection
        number="08"
        title="Variable Typography"
        subtitle="Multi-Weight Typographic ASCII"
        description="Inspired by chenglou.me/pretext — a shared field drives three simultaneous renderings. The source field exposes live particles plus interactive eyes you can steer, the proportional panel uses Georgia with measured glyph widths, and the monospace panel uses a tighter grid so both text renderings keep the Druplicon silhouette intact."
        accentColor="amber"
        tech="Interactive Field → Measured Glyph Width → Proportional + Monospace"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <VariableTypoAscii />
        </Suspense>
      </ShowcaseSection>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-20 px-4">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span
              className="text-3xl md:text-4xl font-bold tracking-tighter"
              style={{
                fontFamily: "var(--font-heading)",
                background: "linear-gradient(135deg, #00a8ff, #ff0080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              8 Versions. 1 Icon.
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
            Each interpretation explores a different digital medium while preserving
            the essence of the Druplicon — the beloved mascot of the Drupal community.
          </p>
          <div className="flex items-center justify-center gap-6 text-[10px] tracking-widest uppercase font-mono text-muted-foreground/50">
            <span>Canvas 2D</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>SVG</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>ASCII</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Particles</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Typography</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
