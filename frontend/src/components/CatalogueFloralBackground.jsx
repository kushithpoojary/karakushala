import React, { useEffect, useRef } from 'react';

export default function CatalogueFloralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // alpha: true, but NO shadowBlur for buttery smooth 60fps
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = 0;
    let height = 0;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      // Cap DPR to 1 for high-performance fill rate on tall sections
      const dpr = 1;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    updateSize();
    const resizeObserver = new ResizeObserver(() => updateSize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', updateSize, { passive: true });

    // =========================================================================
    // 1. Rich Karnataka Lotus & Floral Mandalas (Kamala Blooms)
    // Lightweight, fast linework with vibrant golden cream colors
    // =========================================================================
    const mandalas = [
      { relX: 0.08, relY: 0.10, radius: 105, speed: 0.007, petals: 12, phase: 0 },
      { relX: 0.90, relY: 0.16, radius: 120, speed: -0.0065, petals: 16, phase: 1.2 },
      { relX: 0.50, relY: 0.28, radius: 95, speed: 0.008, petals: 8, phase: 2.5 },
      { relX: 0.12, relY: 0.48, radius: 115, speed: -0.007, petals: 12, phase: 3.8 },
      { relX: 0.88, relY: 0.55, radius: 110, speed: 0.0075, petals: 16, phase: 4.5 },
      { relX: 0.35, relY: 0.72, radius: 100, speed: -0.008, petals: 8, phase: 5.2 },
      { relX: 0.90, relY: 0.88, radius: 115, speed: 0.007, petals: 12, phase: 0.8 },
      { relX: 0.08, relY: 0.92, radius: 95, speed: -0.0075, petals: 8, phase: 1.9 },
    ];

    // =========================================================================
    // 2. Falling Whole Flowers & Petals (Marigold Blossoms, Jasmine Stars, Lotus Petals)
    // Faster, lively falling speed!
    // =========================================================================
    const fallingItemCount = 32;
    const fallingItems = [];

    for (let i = 0; i < fallingItemCount; i++) {
      const flowerType = i % 4; // 0: marigold, 1: jasmine, 2: lotus petal, 3: saffron petal
      fallingItems.push({
        flowerType,
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 2200),
        size: flowerType === 0 ? 16 + Math.random() * 10 : flowerType === 1 ? 13 + Math.random() * 8 : 12 + Math.random() * 14,
        speedY: flowerType < 2 ? 1.8 + Math.random() * 2.2 : 1.6 + Math.random() * 2.5, // 2x faster, lively drift!
        speedX: (Math.random() - 0.5) * 0.8,
        swaySpeed: 2.0 + Math.random() * 2.5, // brisk sway
        swayAmount: flowerType === 0 ? 12 + Math.random() * 16 : 18 + Math.random() * 25,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12, // faster tumble
        flipSpeed: 2.2 + Math.random() * 3.0,  // faster 3D flip
        opacity: 0.70 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // =========================================================================
    // 3. Glowing Golden Pollen Fireflies - Lightweight
    // =========================================================================
    const fireflyCount = 20;
    const fireflies = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 2200),
        radius: 1.5 + Math.random() * 2.2,
        speedY: 1.0 + Math.random() * 1.5, // faster rising
        speedX: (Math.random() - 0.5) * 0.8,
        pulseSpeed: 3.5 + Math.random() * 4.0, // faster twinkle
        phase: Math.random() * Math.PI * 2
      });
    }

    // Helper: Draw organic curved lotus petal
    const drawLotusPetal = (length, pWidth) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-pWidth, length * 0.5, 0, length);
      ctx.quadraticCurveTo(pWidth, length * 0.5, 0, 0);
      ctx.closePath();
    };

    // Helper: Draw fast full Marigold Flower (ಚೆಂಡುಹೂವು)
    const drawFullMarigold = (size, alpha) => {
      const petalLayers = 3;
      const petalsPerLayer = 8;
      
      for (let l = petalLayers; l >= 1; l--) {
        const layerRadius = (size * l) / petalLayers;
        const layerAlpha = Math.min(1, alpha * (0.65 + l * 0.12));
        ctx.fillStyle = l === 3 
          ? `rgba(245, 158, 11, ${layerAlpha})` 
          : l === 2 
            ? `rgba(251, 191, 36, ${layerAlpha})` 
            : `rgba(254, 240, 138, ${layerAlpha})`;

        for (let p = 0; p < petalsPerLayer; p++) {
          const angle = (p * Math.PI * 2) / petalsPerLayer + (l * 0.25);
          const px = Math.cos(angle) * layerRadius;
          const py = Math.sin(angle) * layerRadius;
          ctx.beginPath();
          ctx.arc(px, py, layerRadius * 0.46, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Center orange pistil button
      ctx.fillStyle = `rgba(180, 83, 9, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    };

    // Helper: Draw Jasmine Star Flower (ಮಲ್ಲಿಗೆ ಹೂವು)
    const drawJasmineFlower = (size, alpha) => {
      const petals = 6;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.98)})`;
      ctx.strokeStyle = `rgba(254, 243, 199, ${alpha * 0.8})`;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-size * 0.28, size * 0.45, 0, size);
        ctx.quadraticCurveTo(size * 0.28, size * 0.45, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Golden center eye
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fill();
    };

    let startTime = performance.now();

    const render = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001;

      // Clear frame (single fast clearRect)
      ctx.clearRect(0, 0, width, height);

      // =====================================================================
      // PASS 1: Sacred Rotating Lotus Mandalas (Faster 2x rotation, zero shadowBlur)
      // =====================================================================
      mandalas.forEach((m) => {
        const cx = m.relX * width;
        const cy = m.relY * height;
        const currentRot = elapsed * m.speed + m.phase;
        const breath = 1 + Math.sin(elapsed * 2.5 + m.phase) * 0.06;
        const r = m.radius * breath;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentRot);

        // Concentric sacred circles (clean high-performance vector stroke)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(254, 240, 138, 0.40)';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
        ctx.stroke();

        // Outer ring of curved lotus petals (golden cream)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
        ctx.lineWidth = 1.2;

        for (let i = 0; i < m.petals; i++) {
          const angle = (i * Math.PI * 2) / m.petals;
          ctx.save();
          ctx.rotate(angle);
          drawLotusPetal(r, r * 0.22);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Inner offset ring of smaller lotus petals (crisp white)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
        ctx.lineWidth = 1.0;
        const innerPetals = Math.floor(m.petals / 2);
        const innerOffset = Math.PI / innerPetals;

        for (let i = 0; i < innerPetals; i++) {
          const angle = (i * Math.PI * 2) / innerPetals + innerOffset;
          ctx.save();
          ctx.rotate(angle);
          drawLotusPetal(r * 0.58, r * 0.16);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Center Pistil jewel
        ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.06, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // =====================================================================
      // PASS 2: Top Decorative Floral Torana (Swaying Garland along border)
      // =====================================================================
      const garlandSpacing = 50;
      const garlandCount = Math.ceil(width / garlandSpacing) + 1;
      ctx.save();
      for (let g = 0; g < garlandCount; g++) {
        const gx = g * garlandSpacing;
        const gy = 12;
        const gBreath = Math.sin(elapsed * 3.5 + g * 0.5) * 3;

        // Scalloped connecting golden cord
        if (g > 0) {
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.55)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(gx - garlandSpacing, gy);
          ctx.quadraticCurveTo(gx - garlandSpacing / 2, gy + 15 + gBreath, gx, gy);
          ctx.stroke();
        }

        // Marigold / Jasmine floral rosette knot
        const isMarigold = g % 2 === 0;
        ctx.fillStyle = isMarigold ? 'rgba(251, 191, 36, 0.95)' : 'rgba(255, 255, 255, 1.0)';
        ctx.beginPath();
        ctx.arc(gx, gy + 4 + gBreath, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = isMarigold ? '#B45309' : '#F59E0B';
        ctx.beginPath();
        ctx.arc(gx, gy + 4 + gBreath, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // =====================================================================
      // PASS 3: Falling Whole Flowers, Jasmine Stars & Tumbling Petals (Faster Speed!)
      // =====================================================================
      for (let i = 0; i < fallingItemCount; i++) {
        const itm = fallingItems[i];

        itm.y += itm.speedY;
        itm.x += itm.speedX;

        // Wrap around
        if (itm.y > height + 35) {
          itm.y = -35;
          itm.x = Math.random() * width;
        }
        if (itm.x < -40) itm.x = width + 40;
        if (itm.x > width + 40) itm.x = -40;

        const sway = Math.sin(elapsed * itm.swaySpeed + itm.phase) * itm.swayAmount;
        const renderX = itm.x + sway;
        const renderY = itm.y;

        ctx.save();
        ctx.translate(renderX, renderY);
        ctx.rotate(itm.rotation + elapsed * itm.rotSpeed);

        if (itm.flowerType === 0) {
          // Full Marigold Blossom (ಚೆಂಡುಹೂವು)
          ctx.scale(Math.cos(elapsed * itm.flipSpeed + itm.phase) * 0.35 + 0.65, 1);
          drawFullMarigold(itm.size, itm.opacity);
        } else if (itm.flowerType === 1) {
          // Jasmine Star Flower (ಮಲ್ಲಿಗೆ ಹೂವು)
          ctx.scale(Math.cos(elapsed * itm.flipSpeed + itm.phase) * 0.4 + 0.6, 1);
          drawJasmineFlower(itm.size, itm.opacity);
        } else if (itm.flowerType === 2) {
          // Lotus Petal (Rose Pink)
          const flipScale = Math.cos(elapsed * itm.flipSpeed + itm.phase);
          ctx.scale(flipScale, 1);
          ctx.fillStyle = `rgba(253, 164, 175, ${itm.opacity * 0.95})`;
          ctx.strokeStyle = `rgba(244, 63, 94, ${itm.opacity})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(0, -itm.size * 0.65);
          ctx.quadraticCurveTo(-itm.size * 0.45, 0, 0, itm.size * 0.65);
          ctx.quadraticCurveTo(itm.size * 0.45, 0, 0, -itm.size * 0.65);
          ctx.fill();
          ctx.stroke();
        } else {
          // Marigold Saffron Petal
          const flipScale = Math.cos(elapsed * itm.flipSpeed + itm.phase);
          ctx.scale(flipScale, 1);
          ctx.fillStyle = `rgba(254, 240, 138, ${itm.opacity * 0.95})`;
          ctx.strokeStyle = `rgba(245, 158, 11, ${itm.opacity})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(0, -itm.size * 0.65);
          ctx.quadraticCurveTo(-itm.size * 0.45, 0, 0, itm.size * 0.65);
          ctx.quadraticCurveTo(itm.size * 0.45, 0, 0, -itm.size * 0.65);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }

      // =====================================================================
      // PASS 4: Glowing Fireflies (Twinkling briskly without shadowBlur)
      // =====================================================================
      for (let i = 0; i < fireflyCount; i++) {
        const ff = fireflies[i];
        ff.y -= ff.speedY;
        ff.x += ff.speedX + Math.sin(elapsed * 2.0 + ff.phase) * 0.4;

        if (ff.y < -15) {
          ff.y = height + 15;
          ff.x = Math.random() * width;
        }

        const pulse = Math.sin(elapsed * ff.pulseSpeed + ff.phase);
        const glowOpacity = Math.max(0.2, pulse * 0.45 + 0.55);

        // Multi-layered clean alpha arc for halo effect without shadowBlur
        ctx.fillStyle = `rgba(254, 240, 138, ${glowOpacity * 0.35})`;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${glowOpacity})`;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
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
