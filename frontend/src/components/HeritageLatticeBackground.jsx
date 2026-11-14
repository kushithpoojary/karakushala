import React, { useEffect, useRef, useState } from 'react';
import { Palette, Moon, Sun, Sparkles } from 'lucide-react';

export default function HeritageLatticeBackground() {
  const canvasRef = useRef(null);

  // Background theme: 'sandalwood' (Image 1: Warm Sandalwood/Peach/Terracotta)
  // or 'twilight' (Image 2: Dusk Indigo to Twilight Copper Bronze)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('karakushala_bg_theme') || 'sandalwood';
    } catch {
      return 'sandalwood';
    }
  });

  const [showThemeControls, setShowThemeControls] = useState(false);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('karakushala_bg_theme', newTheme);
    } catch {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let width = 0;
    let height = 0;

    // Mouse tracking with smooth relaxed inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / (width || 1) - 0.5) * 42;
      targetMouseY = (e.clientY / (height || 1) - 0.5) * 42;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Floating subtle thread particles (ambient craft silk dust)
    const particleCount = 28;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        radius: 1 + Math.random() * 2,
        speedY: 0.18 + Math.random() * 0.28,
        speedX: (Math.random() - 0.5) * 0.18,
        opacity: 0.18 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2
      });
    }

    let startTime = performance.now();

    const render = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001; // elapsed seconds

      // Medium-relaxed mouse damping (0.045 = smooth, fluid tracking)
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      // 1. Draw Background Gradient according to active reference theme
      if (theme === 'twilight') {
        // Image 2: Dusk Indigo to Warm Twilight Bronze / Burnt Sienna
        const bgGrad = ctx.createLinearGradient(0, 0, width, height * 0.85);
        bgGrad.addColorStop(0, '#212338');    // Deep dusk indigo (left)
        bgGrad.addColorStop(0.42, '#342938'); // Twilight amethyst
        bgGrad.addColorStop(0.75, '#523c39'); // Warm copper brown
        bgGrad.addColorStop(1, '#66453c');    // Burnt sienna bronze (right)
        ctx.fillStyle = bgGrad;
      } else {
        // Image 1: Warm Sandalwood / Blush Peach / Terracotta
        const bgGrad = ctx.createLinearGradient(0, 0, width * 0.35, height);
        bgGrad.addColorStop(0, '#F9EDE3');    // Soft cream blush
        bgGrad.addColorStop(0.35, '#F6DEC9'); // Sandalwood peach
        bgGrad.addColorStop(0.7, '#F1CEB3');  // Warm terracotta undertone
        bgGrad.addColorStop(1, '#E9C0A2');    // Golden clay base
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(0, 0, width, height);

      // Medium-relaxed speed parameters:
      // Breathing wave: ~18 second period
      const breathingWave = Math.sin(elapsed * 0.35) * 0.035 + 1;
      const gentleDriftX = Math.sin(elapsed * 0.25) * 7 + mouseX;
      const gentleDriftY = Math.cos(elapsed * 0.20) * 7 + mouseY;
      const lineGlowPulse = Math.sin(elapsed * 0.45) * 0.08 + 0.30;

      // 2. Exact Sacred Geometric Kasuti Mandala Lattice Grid
      // Cell size: responsive ~130px to 165px
      const baseSpacing = Math.max(130, Math.min(160, width / 8));
      const spacing = baseSpacing * breathingWave;
      const radius = spacing * 0.44; // Outer circle radius

      const startCol = Math.floor(-gentleDriftX / spacing) - 1;
      const endCol = Math.ceil((width - gentleDriftX) / spacing) + 1;
      const startRow = Math.floor(-gentleDriftY / spacing) - 1;
      const endRow = Math.ceil((height - gentleDriftY) / spacing) + 1;

      // Color palette for linework
      let strokeColor, secondaryStroke, dotColor, particleColor;
      if (theme === 'twilight') {
        strokeColor = `rgba(238, 198, 158, ${lineGlowPulse * 1.15})`;
        secondaryStroke = `rgba(215, 172, 132, ${lineGlowPulse * 0.85})`;
        dotColor = `rgba(255, 218, 175, ${lineGlowPulse * 1.6})`;
        particleColor = 'rgba(238, 198, 158, ';
      } else {
        strokeColor = `rgba(196, 128, 80, ${lineGlowPulse})`;
        secondaryStroke = `rgba(212, 149, 107, ${lineGlowPulse * 0.8})`;
        dotColor = `rgba(188, 118, 72, ${lineGlowPulse * 1.5})`;
        particleColor = 'rgba(212, 149, 107, ';
      }

      ctx.save();
      ctx.translate(gentleDriftX, gentleDriftY);

      // --- Pass 1: Connecting Inter-cell Diagonal Lines (Sacred Grid Weave) ---
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = secondaryStroke;
      ctx.beginPath();

      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cx = c * spacing;
          const cy = r * spacing;

          // Connect center to diagonal neighbors
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + spacing, cy + spacing);
          ctx.moveTo(cx + spacing, cy);
          ctx.lineTo(cx, cy + spacing);

          // Horizontal & vertical center connectors
          ctx.moveTo(cx - radius, cy);
          ctx.lineTo(cx + radius, cy);
          ctx.moveTo(cx, cy - radius);
          ctx.lineTo(cx, cy + radius);
        }
      }
      ctx.stroke();

      // --- Pass 2: Main Geometric Units (Concentric Diamonds + Inscribed Circles + Knot Dots) ---
      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cx = c * spacing;
          const cy = r * spacing;

          // Gentle cell micro-oscillation (medium-relaxed speed)
          const cellPhase = (c * 17 + r * 23) * 0.1;
          const cellRot = Math.sin(elapsed * 0.30 + cellPhase) * 0.035;
          const r1 = radius;
          const r2 = radius * 0.62; // Inner concentric diamond
          const rInnerCircle = radius * 0.28; // Center small circle

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(cellRot);

          // 1. Outer Circumscribed Circle
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(0, 0, r1, 0, Math.PI * 2);
          ctx.stroke();

          // 2. Outer Diamond (Rotated Square - vertices touching the circle)
          ctx.lineWidth = 1.35;
          ctx.beginPath();
          ctx.moveTo(0, -r1);
          ctx.lineTo(r1, 0);
          ctx.lineTo(0, r1);
          ctx.lineTo(-r1, 0);
          ctx.closePath();
          ctx.stroke();

          // 3. Inner Concentric Diamond
          ctx.strokeStyle = secondaryStroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(0, -r2);
          ctx.lineTo(r2, 0);
          ctx.lineTo(0, r2);
          ctx.lineTo(-r2, 0);
          ctx.closePath();
          ctx.stroke();

          // 4. Central Inner Circle
          ctx.beginPath();
          ctx.arc(0, 0, rInnerCircle, 0, Math.PI * 2);
          ctx.stroke();

          // 5. Node / Knot Dots at Diamond Vertices (Exact detail from User Uploaded Reference)
          ctx.fillStyle = dotColor;
          const dotRadius = 2.4;

          // Outer diamond 4 corner dots
          const outerDots = [
            [0, -r1], [r1, 0], [0, r1], [-r1, 0]
          ];
          for (let i = 0; i < outerDots.length; i++) {
            ctx.beginPath();
            ctx.arc(outerDots[i][0], outerDots[i][1], dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          // Inner diamond 4 corner dots
          const innerDots = [
            [0, -r2], [r2, 0], [0, r2], [-r2, 0]
          ];
          for (let i = 0; i < innerDots.length; i++) {
            ctx.beginPath();
            ctx.arc(innerDots[i][0], innerDots[i][1], dotRadius * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      ctx.restore();

      // 3. Floating Light Craft Particles (Silk Dust Drift)
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(elapsed * 0.35 + p.phase) * 0.22;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity + Math.sin(elapsed * 0.85 + p.phase) * 0.1;
        ctx.fillStyle = `${particleColor}${Math.max(0, currentOpacity)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 select-none transition-opacity duration-1000"
        style={{ opacity: theme === 'twilight' ? 0.96 : 0.92 }}
        aria-hidden="true"
      />

      {/* Floating Theme Controller Pill (Allows toggling between both uploaded image styles) */}
      <aside 
        aria-label="Heritage lattice animation theme controls"
        className="fixed bottom-5 right-5 z-40"
      >
        <div className="relative group">
          {showThemeControls ? (
            <div className="bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-2xl rounded-2xl p-3 flex flex-col gap-2 min-w-[210px] animate-popBounce">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200/60">
                <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-terracotta-600" />
                  Lattice Animation Theme
                </span>
                <button
                  type="button"
                  onClick={() => setShowThemeControls(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs px-1"
                  aria-label="Close theme options"
                >
                  ✕
                </button>
              </div>

              {/* Theme 1: Sandalwood Silk (Image 1) */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme('sandalwood');
                  setShowThemeControls(false);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'sandalwood'
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#F9EDE3] via-[#F6DEC9] to-[#E9C0A2] border border-amber-400 shadow-xs flex-shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Sandalwood Silk</p>
                  <p className="text-[10px] text-stone-500 font-normal">Warm Peach (Image 1)</p>
                </div>
              </button>

              {/* Theme 2: Twilight Dusk (Image 2) */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme('twilight');
                  setShowThemeControls(false);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  theme === 'twilight'
                    ? 'bg-indigo-100/90 text-indigo-950 border border-indigo-300 shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#212338] via-[#523c39] to-[#66453c] border border-amber-300 shadow-xs flex-shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Twilight Dusk</p>
                  <p className="text-[10px] text-stone-500 font-normal">Indigo Bronze (Image 2)</p>
                </div>
              </button>

              <div className="pt-1 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  Speed: Medium-Relaxed
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowThemeControls(true)}
              className="bg-white/85 hover:bg-white backdrop-blur-xl border border-stone-300/80 hover:border-amber-400 text-stone-800 shadow-lg hover:shadow-xl rounded-full px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 group"
              title="Change Background Animation Theme (Image 1 vs Image 2)"
              aria-label="Change Background Animation Theme"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <Palette className="w-3.5 h-3.5 text-terracotta-600 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">
                {theme === 'twilight' ? 'Twilight Dusk' : 'Sandalwood Silk'}
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
