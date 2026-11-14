import React, { useEffect, useRef } from 'react';

export default function CatalogueFloralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = 0;
    let height = 0;

    // Interactive mouse tracker for floral breeze & cursor blossom bursts
    let mouseX = -1000;
    let mouseY = -1000;
    let isHovering = false;

    // Interactive blossom sparks spawned at cursor position
    const cursorBlossoms = [];
    const maxCursorBlossoms = 22;

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
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouseX = currentX;
      mouseY = currentY;
      isHovering = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

      // Spawn glowing mini-blossom sparks on mouse move
      if (isHovering && Math.random() < 0.55 && cursorBlossoms.length < maxCursorBlossoms) {
        cursorBlossoms.push({
          x: currentX,
          y: currentY,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -0.5 - Math.random() * 1.5,
          size: 6 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          colorIdx: Math.floor(Math.random() * 3), // 0: marigold, 1: jasmine, 2: saffron
          life: 1.0,
          decay: 0.03 + Math.random() * 0.025
        });
      }
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
    // =========================================================================
    const mandalas = [
      { relX: 0.08, relY: 0.10, radius: 105, speed: 0.003, petals: 12, phase: 0 },
      { relX: 0.88, relY: 0.16, radius: 120, speed: -0.0025, petals: 16, phase: 1.2 },
      { relX: 0.48, relY: 0.28, radius: 95, speed: 0.0035, petals: 8, phase: 2.5 },
      { relX: 0.14, relY: 0.48, radius: 125, speed: -0.0028, petals: 12, phase: 3.8 },
      { relX: 0.85, relY: 0.55, radius: 110, speed: 0.0032, petals: 16, phase: 4.5 },
      { relX: 0.35, relY: 0.70, radius: 100, speed: -0.003, petals: 8, phase: 5.2 },
      { relX: 0.90, relY: 0.85, radius: 120, speed: 0.0028, petals: 12, phase: 0.8 },
      { relX: 0.06, relY: 0.92, radius: 90, speed: -0.0032, petals: 8, phase: 1.9 },
    ];

    // =========================================================================
    // 2. Falling Whole Flowers & Petals (Marigold Blooms & Jasmine Buds)
    // =========================================================================
    const fallingItemCount = 48;
    const fallingItems = [];

    for (let i = 0; i < fallingItemCount; i++) {
      const isWholeFlower = i % 4 === 0; // 25% whole marigolds, 75% petals
      fallingItems.push({
        isWholeFlower,
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 2000),
        size: isWholeFlower ? 16 + Math.random() * 12 : 11 + Math.random() * 15,
        speedY: isWholeFlower ? 0.9 + Math.random() * 1.1 : 0.8 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.45,
        swaySpeed: 1.1 + Math.random() * 1.5,
        swayAmount: isWholeFlower ? 12 + Math.random() * 16 : 18 + Math.random() * 28,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        flipSpeed: isWholeFlower ? 0.8 + Math.random() * 1.0 : 1.3 + Math.random() * 1.8,
        colorIdx: Math.floor(Math.random() * 4),
        opacity: 0.55 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // =========================================================================
    // 3. Glowing Firefly Motes & Golden Pollen Sparkles
    // =========================================================================
    const fireflyCount = 35;
    const fireflies = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 2000),
        radius: 1.4 + Math.random() * 2.4,
        speedY: 0.45 + Math.random() * 0.75,
        speedX: (Math.random() - 0.5) * 0.5,
        pulseSpeed: 1.8 + Math.random() * 2.5,
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

    // Helper: Draw full Marigold Flower (ಚೆಂಡುಹೂವು)
    const drawFullMarigold = (size, alpha) => {
      const petalLayers = 3;
      const petalsPerLayer = 10;
      
      for (let l = petalLayers; l >= 1; l--) {
        const layerRadius = (size * l) / petalLayers;
        const layerAlpha = alpha * (0.5 + l * 0.15);
        ctx.fillStyle = l === 3 
          ? `rgba(245, 158, 11, ${layerAlpha})` 
          : l === 2 
            ? `rgba(251, 191, 36, ${layerAlpha})` 
            : `rgba(254, 240, 138, ${layerAlpha})`;

        for (let p = 0; p < petalsPerLayer; p++) {
          const angle = (p * Math.PI * 2) / petalsPerLayer + (l * 0.2);
          const px = Math.cos(angle) * layerRadius;
          const py = Math.sin(angle) * layerRadius;
          ctx.beginPath();
          ctx.arc(px, py, layerRadius * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Center orange pistil button
      ctx.fillStyle = `rgba(180, 83, 9, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    };

    let startTime = performance.now();

    const render = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // =====================================================================
      // PASS 1: Sacred Rotating Lotus Mandalas (Background Tapestry)
      // =====================================================================
      mandalas.forEach((m) => {
        const cx = m.relX * width;
        const cy = m.relY * height;
        const currentRot = elapsed * m.speed + m.phase;
        const breath = 1 + Math.sin(elapsed * 1.4 + m.phase) * 0.07;
        const r = m.radius * breath;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentRot);

        // Outer halo glow
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(254, 240, 138, 0.4)';

        // Outer concentric sacred circle
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.25)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary inner circle
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
        ctx.stroke();

        // Outer ring of curved lotus petals
        ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.32)';
        ctx.lineWidth = 1.15;

        for (let i = 0; i < m.petals; i++) {
          const angle = (i * Math.PI * 2) / m.petals;
          ctx.save();
          ctx.rotate(angle);
          drawLotusPetal(r, r * 0.22);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Inner offset ring of smaller lotus petals
        ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.35)';
        ctx.lineWidth = 0.95;
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
        ctx.fillStyle = 'rgba(254, 240, 138, 0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // 8 stamen dots around pistil
        ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
        for (let s = 0; s < 8; s++) {
          const sAngle = (s * Math.PI * 2) / 8;
          const sx = Math.cos(sAngle) * (r * 0.2);
          const sy = Math.sin(sAngle) * (r * 0.2);
          ctx.beginPath();
          ctx.arc(sx, sy, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // =====================================================================
      // PASS 2: Top Decorative Floral Torana (Swaying Garland along border)
      // =====================================================================
      const garlandSpacing = 52;
      const garlandCount = Math.ceil(width / garlandSpacing) + 1;
      ctx.save();
      for (let g = 0; g < garlandCount; g++) {
        const gx = g * garlandSpacing;
        const gy = 12;
        const gBreath = Math.sin(elapsed * 2.2 + g * 0.45) * 3;

        // Scalloped connecting golden cord
        if (g > 0) {
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.45)';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(gx - garlandSpacing, gy);
          ctx.quadraticCurveTo(gx - garlandSpacing / 2, gy + 15 + gBreath, gx, gy);
          ctx.stroke();
        }

        // Marigold / Jasmine floral rosette knot
        const isMarigold = g % 2 === 0;
        ctx.fillStyle = isMarigold ? 'rgba(251, 191, 36, 0.9)' : 'rgba(255, 255, 255, 0.95)';
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
      // PASS 3: Falling Whole Marigolds & Tumbling Petals
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

        // Interactive cursor breeze push
        let pushX = 0;
        let pushY = 0;
        if (isHovering) {
          const dx = renderX - mouseX;
          const dy = renderY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (1 - dist / 150) * 22;
            pushX = (dx / dist) * force;
            pushY = (dy / dist) * force;
          }
        }

        ctx.save();
        ctx.translate(renderX + pushX, renderY + pushY);
        ctx.rotate(itm.rotation + elapsed * itm.rotSpeed);

        if (itm.isWholeFlower) {
          // Render full tumbling Marigold Blossom
          ctx.scale(Math.cos(elapsed * itm.flipSpeed + itm.phase) * 0.4 + 0.6, 1);
          drawFullMarigold(itm.size, itm.opacity);
        } else {
          // Render tumbling single petal
          const flipScale = Math.cos(elapsed * itm.flipSpeed + itm.phase);
          ctx.scale(flipScale, 1);

          let fill, stroke;
          if (itm.colorIdx === 0) {
            fill = `rgba(254, 240, 138, ${itm.opacity})`;
            stroke = `rgba(250, 204, 21, ${itm.opacity * 1.1})`;
          } else if (itm.colorIdx === 1) {
            fill = `rgba(251, 146, 60, ${itm.opacity})`;
            stroke = `rgba(234, 88, 12, ${itm.opacity * 1.1})`;
          } else if (itm.colorIdx === 2) {
            fill = `rgba(255, 255, 255, ${itm.opacity * 1.15})`;
            stroke = `rgba(254, 243, 199, ${itm.opacity * 1.2})`;
          } else {
            fill = `rgba(253, 164, 175, ${itm.opacity})`;
            stroke = `rgba(244, 63, 94, ${itm.opacity * 1.1})`;
          }

          ctx.fillStyle = fill;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 0.8;

          ctx.beginPath();
          ctx.moveTo(0, -itm.size * 0.65);
          ctx.quadraticCurveTo(-itm.size * 0.45, 0, 0, itm.size * 0.65);
          ctx.quadraticCurveTo(itm.size * 0.45, 0, 0, -itm.size * 0.65);
          ctx.fill();
          ctx.stroke();

          // Vein line
          ctx.beginPath();
          ctx.moveTo(0, -itm.size * 0.4);
          ctx.lineTo(0, itm.size * 0.4);
          ctx.stroke();
        }

        ctx.restore();
      }

      // =====================================================================
      // PASS 4: Glowing Fireflies (ಮಿಣುಕು ಹುಳುಗಳು)
      // =====================================================================
      for (let i = 0; i < fireflyCount; i++) {
        const ff = fireflies[i];
        ff.y -= ff.speedY;
        ff.x += ff.speedX + Math.sin(elapsed * 1.3 + ff.phase) * 0.35;

        if (ff.y < -15) {
          ff.y = height + 15;
          ff.x = Math.random() * width;
        }

        const pulse = Math.sin(elapsed * ff.pulseSpeed + ff.phase);
        const glowOpacity = Math.max(0.15, pulse * 0.4 + 0.5);

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FDE047';
        ctx.fillStyle = `rgba(254, 240, 138, ${glowOpacity})`;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // =====================================================================
      // PASS 5: Interactive Cursor Blossom Sparks
      // =====================================================================
      for (let b = cursorBlossoms.length - 1; b >= 0; b--) {
        const cb = cursorBlossoms[b];
        cb.x += cb.vx;
        cb.y += cb.vy;
        cb.rotation += cb.rotSpeed;
        cb.life -= cb.decay;

        if (cb.life <= 0) {
          cursorBlossoms.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.translate(cb.x, cb.y);
        ctx.rotate(cb.rotation);

        const cbAlpha = cb.life * 0.9;
        const cbFill = cb.colorIdx === 0
          ? `rgba(254, 240, 138, ${cbAlpha})`
          : cb.colorIdx === 1
            ? `rgba(255, 255, 255, ${cbAlpha})`
            : `rgba(251, 146, 60, ${cbAlpha})`;

        ctx.fillStyle = cbFill;
        // 5-petal star blossom
        for (let p = 0; p < 5; p++) {
          const pAngle = (p * Math.PI * 2) / 5;
          const px = Math.cos(pAngle) * (cb.size * 0.5);
          const py = Math.sin(pAngle) * (cb.size * 0.5);
          ctx.beginPath();
          ctx.arc(px, py, cb.size * 0.32, 0, Math.PI * 2);
          ctx.fill();
        }
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
