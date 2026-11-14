import React, { useEffect, useRef } from 'react';

export default function CatalogueFloralBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = 0;
    let height = 0;

    // Track mouse over catalogue section for floral ripple
    let mouseX = -1000;
    let mouseY = -1000;
    let isHovering = false;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateSize();
    const resizeObserver = new ResizeObserver(() => updateSize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', updateSize, { passive: true });

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovering = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // =========================================================================
    // 1. Sacred Karnataka Lotus Mandalas (Kamala Blooms)
    // Distributed across the catalogue background
    // =========================================================================
    const mandalas = [
      { relX: 0.08, relY: 0.12, radius: 95, speed: 0.0025, petals: 12, phase: 0 },
      { relX: 0.88, relY: 0.18, radius: 110, speed: -0.002, petals: 16, phase: 1.2 },
      { relX: 0.50, relY: 0.32, radius: 85, speed: 0.003, petals: 8, phase: 2.5 },
      { relX: 0.15, relY: 0.58, radius: 120, speed: -0.0022, petals: 12, phase: 3.8 },
      { relX: 0.82, relY: 0.65, radius: 100, speed: 0.0028, petals: 16, phase: 4.5 },
      { relX: 0.38, relY: 0.82, radius: 90, speed: -0.0032, petals: 8, phase: 5.2 },
      { relX: 0.92, relY: 0.92, radius: 115, speed: 0.002, petals: 12, phase: 0.8 },
      { relX: 0.05, relY: 0.95, radius: 80, speed: -0.0026, petals: 8, phase: 1.9 },
    ];

    // =========================================================================
    // 2. Falling Marigold & Jasmine Flower Petals (ಚೆಂಡುಹೂವು & ಮಲ್ಲಿಗೆ ಪಕಳೆಗಳು)
    // =========================================================================
    const petalCount = 42;
    const petals = [];
    const petalColors = [
      { fill: 'rgba(254, 240, 138, 0.65)', border: 'rgba(250, 204, 21, 0.75)' }, // Bright Marigold Yellow
      { fill: 'rgba(251, 146, 60, 0.60)', border: 'rgba(234, 88, 12, 0.70)' },   // Saffron Orange
      { fill: 'rgba(255, 255, 255, 0.75)', border: 'rgba(254, 243, 199, 0.85)' }, // Sacred Jasmine White (Mallige)
      { fill: 'rgba(253, 164, 175, 0.55)', border: 'rgba(244, 63, 94, 0.65)' }   // Lotus Blossom Pink
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 1800),
        size: 11 + Math.random() * 15,
        speedY: 0.75 + Math.random() * 1.35,
        speedX: (Math.random() - 0.5) * 0.4,
        swaySpeed: 1.0 + Math.random() * 1.4,
        swayAmount: 18 + Math.random() * 26,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        flipSpeed: 1.2 + Math.random() * 1.8,
        colorIdx: Math.floor(Math.random() * petalColors.length),
        opacity: 0.45 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // =========================================================================
    // 3. Floating Golden Pollen Sparkles
    // =========================================================================
    const pollenCount = 30;
    const pollen = [];
    for (let i = 0; i < pollenCount; i++) {
      pollen.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 1800),
        radius: 1.2 + Math.random() * 2.2,
        speedY: 0.4 + Math.random() * 0.6,
        speedX: (Math.random() - 0.5) * 0.35,
        opacity: 0.3 + Math.random() * 0.5,
        pulseSpeed: 1.5 + Math.random() * 2.0,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Helper: Draw organic lotus petal
    const drawPetal = (length, pWidth) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-pWidth, length * 0.5, 0, length);
      ctx.quadraticCurveTo(pWidth, length * 0.5, 0, 0);
      ctx.closePath();
    };

    let startTime = performance.now();

    const render = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001;

      // Clear previous frame
      ctx.clearRect(0, 0, width, height);

      // =====================================================================
      // PASS 1: Sacred Rotating Lotus Mandalas (Background Tapestry)
      // =====================================================================
      mandalas.forEach((m) => {
        const cx = m.relX * width;
        const cy = m.relY * height;
        const currentRot = elapsed * m.speed + m.phase;
        const breath = 1 + Math.sin(elapsed * 1.2 + m.phase) * 0.06;
        const r = m.radius * breath;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentRot);

        // Outer halo glow
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(254, 240, 138, 0.35)';

        // Outer concentric sacred circle
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.22)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary inner circle
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
        ctx.stroke();

        // Outer ring of curved lotus petals
        ctx.fillStyle = 'rgba(254, 240, 138, 0.07)';
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.28)';
        ctx.lineWidth = 1.1;

        for (let i = 0; i < m.petals; i++) {
          const angle = (i * Math.PI * 2) / m.petals;
          ctx.save();
          ctx.rotate(angle);
          drawPetal(r, r * 0.22);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Inner offset ring of smaller lotus petals
        ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.32)';
        ctx.lineWidth = 0.9;
        const innerPetals = Math.floor(m.petals / 2);
        const innerOffset = Math.PI / innerPetals;

        for (let i = 0; i < innerPetals; i++) {
          const angle = (i * Math.PI * 2) / innerPetals + innerOffset;
          ctx.save();
          ctx.rotate(angle);
          drawPetal(r * 0.58, r * 0.16);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Center Pistil jewel
        ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // 8 stamen dots around pistil
        ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
        for (let s = 0; s < 8; s++) {
          const sAngle = (s * Math.PI * 2) / 8;
          const sx = Math.cos(sAngle) * (r * 0.2);
          const sy = Math.sin(sAngle) * (r * 0.2);
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // =====================================================================
      // PASS 2: Top Decorative Floral Torana (Garland Scallop along border)
      // =====================================================================
      const garlandSpacing = 55;
      const garlandCount = Math.ceil(width / garlandSpacing) + 1;
      ctx.save();
      for (let g = 0; g < garlandCount; g++) {
        const gx = g * garlandSpacing;
        const gy = 12;
        const gBreath = Math.sin(elapsed * 2 + g * 0.4) * 2;

        // Scalloped connecting golden cord
        if (g > 0) {
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(gx - garlandSpacing, gy);
          ctx.quadraticCurveTo(gx - garlandSpacing / 2, gy + 14 + gBreath, gx, gy);
          ctx.stroke();
        }

        // Marigold / Jasmine floral rosette knot
        const isMarigold = g % 2 === 0;
        ctx.fillStyle = isMarigold ? 'rgba(251, 191, 36, 0.85)' : 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(gx, gy + 4 + gBreath, 5, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = isMarigold ? '#B45309' : '#F59E0B';
        ctx.beginPath();
        ctx.arc(gx, gy + 4 + gBreath, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // =====================================================================
      // PASS 3: Falling & Tumbling Flower Petals (ಚೆಂಡುಹೂವು & ಮಲ್ಲಿಗೆ ಪಕಳೆಗಳು)
      // =====================================================================
      for (let i = 0; i < petalCount; i++) {
        const p = petals[i];

        // Move petal down and sway
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around at bottom
        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        // Harmonic sway calculation
        const sway = Math.sin(elapsed * p.swaySpeed + p.phase) * p.swayAmount;
        const renderX = p.x + sway;
        const renderY = p.y;

        // Cursor ripple: petals gently swirl away if cursor is near
        let cursorPushX = 0;
        let cursorPushY = 0;
        if (isHovering) {
          const dx = renderX - mouseX;
          const dy = renderY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (1 - dist / 140) * 18;
            cursorPushX = (dx / dist) * force;
            cursorPushY = (dy / dist) * force;
          }
        }

        ctx.save();
        ctx.translate(renderX + cursorPushX, renderY + cursorPushY);
        ctx.rotate(p.rotation + elapsed * p.rotSpeed);

        // 3D tumbling flip effect
        const flipScale = Math.cos(elapsed * p.flipSpeed + p.phase);
        ctx.scale(flipScale, 1);

        const color = petalColors[p.colorIdx];
        ctx.fillStyle = color.fill;
        ctx.strokeStyle = color.border;
        ctx.lineWidth = 0.8;

        // Draw organic teardrop flower petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.65);
        ctx.quadraticCurveTo(-p.size * 0.45, 0, 0, p.size * 0.65);
        ctx.quadraticCurveTo(p.size * 0.45, 0, 0, -p.size * 0.65);
        ctx.fill();
        ctx.stroke();

        // Delicate petal vein line
        ctx.strokeStyle = color.border;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.45);
        ctx.lineTo(0, p.size * 0.45);
        ctx.stroke();

        ctx.restore();
      }

      // =====================================================================
      // PASS 4: Floating Golden Pollen Sparkles
      // =====================================================================
      for (let i = 0; i < pollenCount; i++) {
        const pl = pollen[i];
        pl.y -= pl.speedY;
        pl.x += pl.speedX + Math.sin(elapsed * 1.2 + pl.phase) * 0.25;

        if (pl.y < -10) {
          pl.y = height + 10;
          pl.x = Math.random() * width;
        }

        const currentOpacity = pl.opacity + Math.sin(elapsed * pl.pulseSpeed + pl.phase) * 0.25;
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FDE047';
        ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.1, currentOpacity)})`;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 select-none w-full h-full"
      aria-hidden="true"
    />
  );
}
