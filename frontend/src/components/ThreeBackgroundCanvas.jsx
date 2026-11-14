import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackgroundCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & WebGL Renderer with Alpha transparency
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 18;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Fully transparent
    container.appendChild(renderer.domElement);

    // 2. Light, Elegant Pastel Colors for Karnataka Heritage Theme
    // Soft champagne gold, pale blush terracotta, delicate coastal mint, light lavender silk
    const lightPalette = [
      new THREE.Color(0xF6E7CA), // Light sandalwood gold
      new THREE.Color(0xFAD9C8), // Soft terracotta blush
      new THREE.Color(0xD9EFE4), // Pale coastal mint
      new THREE.Color(0xEAE4F7), // Soft lavender silk
      new THREE.Color(0xFDF2D6), // Delicate marigold cream
    ];

    // 3. Flowing 3D Silk Wave Surface (Plane Mesh)
    const planeWidth = 38;
    const planeHeight = 24;
    const segmentsX = 40;
    const segmentsY = 30;
    const waveGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);
    
    // Save original vertex positions for wave calculations
    const posAttribute = waveGeometry.attributes.position;
    const originalPositions = new Float32Array(posAttribute.array);

    // Color vertices with soft pastel gradient
    const count = posAttribute.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = lightPalette[i % lightPalette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Elegant, delicate wireframe material with additive vertex colors
    const waveMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.NormalBlending
    });

    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI / 3.2;
    waveMesh.position.y = -3;
    waveMesh.position.z = -2;
    scene.add(waveMesh);

    // 4. Floating Light Craft Constellation Particles (Weave Nodes)
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const pColor = lightPalette[Math.floor(Math.random() * lightPalette.length)];
      particleColors[i * 3] = pColor.r;
      particleColors[i * 3 + 1] = pColor.g;
      particleColors[i * 3 + 2] = pColor.b;

      particleVelocities.push({
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.005,
        vz: (Math.random() - 0.5) * 0.003,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        seed: Math.random() * Math.PI * 2
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Circular particle sprite texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(245, 220, 180, 0.85)');
    gradient.addColorStop(0.8, 'rgba(230, 200, 160, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.75,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // 6. Smooth Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (event) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 7. Responsive Window Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      camera.position.x = mouseX * 1.5;
      camera.position.y = 1 - mouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Undulate 3D Silk Wave Vertices (Silk cloth ripple equation)
      const positions = waveGeometry.attributes.position;
      for (let i = 0; i < posAttribute.count; i++) {
        const u = originalPositions[i * 3];
        const v = originalPositions[i * 3 + 1];

        // Complex undulating silk wave pattern
        const wave1 = Math.sin(u * 0.35 + elapsedTime * 0.9) * 0.7;
        const wave2 = Math.cos(v * 0.45 + elapsedTime * 0.7) * 0.5;
        const wave3 = Math.sin((u + v) * 0.25 + elapsedTime * 0.5) * 0.4;
        
        positions.setZ(i, wave1 + wave2 + wave3);
      }
      positions.needsUpdate = true;

      // Gently rotate wave mesh
      waveMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.06;

      // Animate floating craft nodes (gentle drifting + pulsing)
      const pPositions = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        
        let px = pPositions.getX(i) + vel.vx;
        let py = pPositions.getY(i) + vel.vy + Math.sin(elapsedTime * vel.pulseSpeed + vel.seed) * 0.005;
        let pz = pPositions.getZ(i) + vel.vz;

        // Wrap around bounds softly
        if (px > 18) px = -18;
        if (px < -18) px = 18;
        if (py > 12) py = -12;
        if (py < -12) py = 12;

        pPositions.setXYZ(i, px, py, pz);
      }
      pPositions.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Memory Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      waveGeometry.dispose();
      waveMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-1000"
      style={{ opacity: 0.88 }}
      aria-hidden="true"
    />
  );
}
