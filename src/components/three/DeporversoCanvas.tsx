import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import { SPORTS_WEBP_CATALOG } from '../../data/sportsWebp';

interface DeporversoCanvasProps {
  progress: number; // 0 to 1
  activeAct: 1 | 2 | 3 | 4;
}

interface SportsCardItem {
  mesh: THREE.Mesh;
  initialPos: THREE.Vector3;
  digitalPos: THREE.Vector3;
  multiversePos: THREE.Vector3;
  speed: number;
  rotSpeed: number;
  floatOffset: number;
  initialRotX: number;
  initialRotY: number;
  initialRotZ: number;
}

export const DeporversoCanvas: React.FC<DeporversoCanvasProps> = ({ progress, activeAct }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier, isWebGLAvailable, maxParticles } = usePerformanceMode();
  const [webglFailed, setWebglFailed] = useState(false);

  // Store references for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!isWebGLAvailable || !canvasRef.current) {
      setWebglFailed(true);
      return;
    }

    const canvas = canvasRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create scene with deep atmospheric fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.022);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 20);
    cameraRef.current = camera;

    // Create renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: tier !== 'LOW',
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'HIGH' ? 2 : 1.25));
      renderer.setSize(width, height);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D background:', e);
      setWebglFailed(true);
      return;
    }

    // Helper: Circular ember sprite texture for soft golden dust particles
    const createCircularTexture = () => {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      if (ctx) {
        const radGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        radGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.8)');
        radGrad.addColorStop(0.7, 'rgba(217, 119, 6, 0.3)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(c);
    };

    const emberTexture = createCircularTexture();

    // 1. DYNAMIC WEBP SPORTS CARDS SYSTEM (Replaces bare square blocks with authentic athlete action WebP images)
    const textureLoader = new THREE.TextureLoader();
    const sportTextures: THREE.Texture[] = [];
    const sportMaterials: THREE.MeshBasicMaterial[] = [];

    SPORTS_WEBP_CATALOG.forEach((sport) => {
      const texture = textureLoader.load(sport.url);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      sportTextures.push(texture);

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
      sportMaterials.push(mat);
    });

    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // Geometry shared across all square sports cards (1.35x1.35 units matching perspective)
    const cardGeometry = new THREE.PlaneGeometry(1.35, 1.35);

    // Number of floating WebP cards based on device tier
    const cardCount = tier === 'HIGH' ? 120 : tier === 'MEDIUM' ? 84 : 48;
    const cards: SportsCardItem[] = [];

    for (let i = 0; i < cardCount; i++) {
      const sportIdx = i % SPORTS_WEBP_CATALOG.length;
      const material = sportMaterials[sportIdx];
      const mesh = new THREE.Mesh(cardGeometry, material);

      // Act 1 (The Origin): Floating distributed across perspective space around text
      // Spread across width, height, and depth matching the screenshot's perspective distribution
      const spreadX = (Math.random() - 0.5) * 38;
      const spreadY = Math.random() * 14 - 2.5;
      const spreadZ = (Math.random() - 0.5) * 34;
      const initialPos = new THREE.Vector3(spreadX, spreadY, spreadZ);

      // Act 2 (Digital Awakening): Floating cyber matrix wave
      const col = (i % 24) - 12;
      const row = Math.floor(i / 24) - 2;
      const digitalPos = new THREE.Vector3(
        col * 1.8,
        Math.sin(col * 0.4) * 2.2 + row * 1.5,
        row * 2.5 - 5
      );

      // Act 4 (Multiverse): Spherical cosmic galaxy
      const radius = 9 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const multiversePos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      // Set initial position
      mesh.position.copy(initialPos);

      // Subtle 3D perspective orientation tilts
      const initialRotX = (Math.random() - 0.5) * 0.4;
      const initialRotY = (Math.random() - 0.5) * 0.6;
      const initialRotZ = (Math.random() - 0.5) * 0.3;
      mesh.rotation.set(initialRotX, initialRotY, initialRotZ);

      // Subtle scaling variation for depth richness (0.7x to 1.35x)
      const scale = 0.75 + Math.random() * 0.6;
      mesh.scale.set(scale, scale, 1);

      cardGroup.add(mesh);

      cards.push({
        mesh,
        initialPos,
        digitalPos,
        multiversePos,
        speed: 0.8 + Math.random() * 0.8,
        rotSpeed: 0.3 + Math.random() * 0.4,
        floatOffset: Math.random() * Math.PI * 2,
        initialRotX,
        initialRotY,
        initialRotZ
      });
    }

    // 2. SOFT AMBIENT GOLDEN EMBER PARTICLES (Circular stardust between cards)
    const ambientParticleCount = Math.min(maxParticles || 1200, 800);
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(ambientParticleCount * 3);
    const particleColors = new Float32Array(ambientParticleCount * 3);

    const earthColor = new THREE.Color(0xf59e0b);
    const cyberColor = new THREE.Color(0x38bdf8);

    for (let p = 0; p < ambientParticleCount; p++) {
      const p3 = p * 3;
      particlePositions[p3] = (Math.random() - 0.5) * 44;
      particlePositions[p3 + 1] = Math.random() * 16 - 3;
      particlePositions[p3 + 2] = (Math.random() - 0.5) * 40;

      particleColors[p3] = earthColor.r;
      particleColors[p3 + 1] = earthColor.g;
      particleColors[p3 + 2] = earthColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: tier === 'HIGH' ? 0.35 : 0.25,
      map: emberTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const ambientPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(ambientPoints);

    // 3. DIGITAL GRID FOR ACT 2 & 3
    const gridHelper = new THREE.GridHelper(60, 40, 0x2563eb, 0x172554);
    gridHelper.position.y = -2;
    // @ts-ignore
    gridHelper.material.transparent = true;
    // @ts-ignore
    gridHelper.material.opacity = 0.15;
    scene.add(gridHelper);

    // 4. STADIUM / MULTIVERSE RINGS
    const ringsGroup = new THREE.Group();
    for (let r = 0; r < 4; r++) {
      const ringGeo = new THREE.RingGeometry(12 + r * 6, 12.1 + r * 6, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x38bdf8 : 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -1.8;
      ringsGroup.add(ringMesh);
    }
    scene.add(ringsGroup);

    // 5. AMBIENT & POINT LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.7);
    scene.add(ambientLight);

    const warmFloodLight = new THREE.PointLight(0xf59e0b, 2.5, 45);
    warmFloodLight.position.set(-15, 12, 10);
    scene.add(warmFloodLight);

    const cyberLight = new THREE.PointLight(0x00ffff, 3, 50);
    cyberLight.position.set(15, 10, -10);
    scene.add(cyberLight);

    // MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // RESIZE HANDLER
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const p = progressRef.current; // 0.0 to 1.0

      // Transition weights between acts
      const t12 = Math.min(1, Math.max(0, (p - 0.15) / 0.25)); // transition Act 1 -> 2
      const t34 = Math.min(1, Math.max(0, (p - 0.68) / 0.25)); // transition Act 3 -> 4

      // Update WebP Sports Cards in 3D space
      cards.forEach((card, idx) => {
        const mesh = card.mesh;

        // Base target position according to scroll act
        let targetX = card.initialPos.x;
        let targetY = card.initialPos.y;
        let targetZ = card.initialPos.z;

        if (t12 > 0) {
          targetX = THREE.MathUtils.lerp(targetX, card.digitalPos.x, t12);
          targetY = THREE.MathUtils.lerp(targetY, card.digitalPos.y, t12);
          targetZ = THREE.MathUtils.lerp(targetZ, card.digitalPos.z, t12);
        }

        if (t34 > 0) {
          targetX = THREE.MathUtils.lerp(targetX, card.multiversePos.x, t34);
          targetY = THREE.MathUtils.lerp(targetY, card.multiversePos.y, t34);
          targetZ = THREE.MathUtils.lerp(targetZ, card.multiversePos.z, t34);
        }

        // Floating harmonic bobbing
        const floatY = Math.sin(elapsedTime * card.speed + card.floatOffset) * 0.35;
        const floatX = Math.cos(elapsedTime * (card.speed * 0.7) + card.floatOffset) * 0.15;

        // Smooth position interpolation
        mesh.position.x += (targetX + floatX - mesh.position.x) * 0.06;
        mesh.position.y += (targetY + floatY - mesh.position.y) * 0.06;
        mesh.position.z += (targetZ - mesh.position.z) * 0.06;

        // Subtle 3D tilting and drifting rotation
        mesh.rotation.y = card.initialRotY + Math.sin(elapsedTime * card.rotSpeed + idx) * 0.25;
        mesh.rotation.x = card.initialRotX + Math.cos(elapsedTime * (card.rotSpeed * 0.8) + idx) * 0.15;
        mesh.rotation.z = card.initialRotZ + Math.sin(elapsedTime * 0.2 + idx) * 0.08;
      });

      // Ambient golden dust slow drift
      ambientPoints.rotation.y = elapsedTime * 0.03 + p * Math.PI * 0.5;
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < ambientParticleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime * 0.8 + i) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Group subtle global rotation
      cardGroup.rotation.y = Math.sin(elapsedTime * 0.08) * 0.05 + p * 0.2;

      // Grid opacity and movement
      if (gridHelper) {
        // @ts-ignore
        gridHelper.material.opacity = 0.08 + t12 * 0.35 - t34 * 0.25;
        gridHelper.position.z = (elapsedTime * 1.5) % 3 - 2;
      }

      // Stadium rings rotation
      if (ringsGroup) {
        ringsGroup.rotation.z = elapsedTime * 0.1;
        ringsGroup.position.y = -2 + Math.sin(elapsedTime * 0.5) * 0.2;
      }

      // Camera scrollytelling path
      const targetCamY = 3 + p * 8 + mouseY * -1.5;
      const targetCamZ = 22 - p * 12;
      const targetCamX = Math.sin(p * Math.PI) * 4 + mouseX * 2;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);

      // Lighting updates
      warmFloodLight.intensity = Math.max(0, 2.5 - p * 3);
      cyberLight.intensity = Math.min(3.5, p * 4);

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      renderer.dispose();
      cardGeometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      emberTexture.dispose();

      sportTextures.forEach((tex) => tex.dispose());
      sportMaterials.forEach((mat) => mat.dispose());
    };
  }, [isWebGLAvailable, tier, maxParticles]);

  if (webglFailed || !isWebGLAvailable) {
    // 2D Fallback: CSS 3D Perspective Floating WebP Sports Cards
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden [perspective:1000px]">
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            activeAct === 1
              ? 'bg-gradient-to-b from-[#18110b] via-[#24170d] to-[#080503]'
              : activeAct === 2
              ? 'bg-gradient-to-b from-[#0b1020] via-[#0f172a] to-[#04060b]'
              : activeAct === 3
              ? 'bg-gradient-to-b from-[#051119] via-[#091e2b] to-[#020609]'
              : 'bg-gradient-to-b from-[#09061c] via-[#110c2e] to-[#030209]'
          }`}
        />
        {/* Ambient radial glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-1000"
          style={{
            backgroundColor:
              activeAct === 1
                ? '#d6a15b'
                : activeAct === 2
                ? '#38bdf8'
                : activeAct === 3
                ? '#10b981'
                : '#818cf8'
          }}
        />

        {/* 2D Floating WebP Sports Grid in Perspective */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-6 p-8 opacity-45">
          {SPORTS_WEBP_CATALOG.slice(0, 18).map((sport, i) => (
            <div
              key={sport.id}
              className="w-16 h-16 rounded-xl border border-amber-500/40 shadow-lg shadow-amber-950/50 overflow-hidden transition-transform duration-700 animate-pulse"
              style={{
                transform: `rotate(${((i % 7) - 3) * 6}deg) translateY(${Math.sin(i) * 12}px)`
              }}
            >
              <img
                src={sport.url}
                alt={sport.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(4,6,11,0.7)_100%)] pointer-events-none" />
    </div>
  );
};
