import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SportCode } from '../../types';
import { Play, Pause, RotateCw, Sparkles, Layers, Eye, Maximize2, Shield, Trophy } from 'lucide-react';

interface Sport3DExperienceProps {
  sportCode: SportCode;
  height?: number | string;
  interactive?: boolean;
  initialMode?: 'STADIUM' | 'BALL' | 'TROPHY';
  className?: string;
  showControls?: boolean;
}

export const Sport3DExperience: React.FC<Sport3DExperienceProps> = ({
  sportCode,
  height = 420,
  interactive = true,
  initialMode = 'STADIUM',
  className = '',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Group container for active 3D models
  const modelGroupRef = useRef<THREE.Group>(new THREE.Group());
  const particlesGroupRef = useRef<THREE.Points | null>(null);
  const scannerMeshRef = useRef<THREE.Mesh | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.35, y: 0.5 });
  const currentRotationRef = useRef({ x: 0.35, y: 0.5 });

  // Component states
  const [active3DMode, setActive3DMode] = useState<'STADIUM' | 'BALL' | 'TROPHY'>(initialMode);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [lightsActive, setLightsActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Helper: Create the 3D Stadium Field & Lights
  const buildStadium3D = useCallback((scene: THREE.Scene, sport: SportCode, isWire: boolean) => {
    const group = new THREE.Group();

    // Sport-specific court surface and line colors
    let surfaceColor = 0x0a4d29;
    let lineColor = 0x00ff88;

    if (sport === 'BALONCESTO') {
      surfaceColor = 0x8c4516; // Polished Hardwood Parquet
      lineColor = 0xffffff;
    } else if (sport === 'ECUAVOLEY') {
      surfaceColor = 0x806230; // Golden Sand / Clay Court
      lineColor = 0xfde047;
    } else if (sport === 'PADEL') {
      surfaceColor = 0x0284c7; // Official WPT Blue Turf
      lineColor = 0xffffff;
    } else if (sport === 'FUTSAL') {
      surfaceColor = 0x1e3a8a; // Indoor Royal Blue
      lineColor = 0xfacc15;
    } else if (sport === 'VOLEIBOL') {
      surfaceColor = 0x9a3412; // FIVB Terracotta Orange
      lineColor = 0x60a5fa;
    } else if (sport === 'BEISBOL') {
      surfaceColor = 0x166534; // Diamond Turf
      lineColor = 0xffffff;
    } else if (sport === 'OTROS') {
      surfaceColor = 0x1e293b; // Graphite High-Tech Octagon Arena
      lineColor = 0x38bdf8;
    }

    // 1. Sport Ground Pitch
    const pitchWidth = 28;
    const pitchLength = 40;
    const pitchGeo = new THREE.PlaneGeometry(pitchWidth, pitchLength, 24, 24);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: surfaceColor,
      roughness: 0.6,
      metalness: 0.2,
      wireframe: isWire
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.receiveShadow = true;
    group.add(pitch);

    // 2. Glowing Pitch Lines (Center Circle, Borders, Penalty Boxes)
    const lineMat = new THREE.LineBasicMaterial({ 
      color: lineColor, 
      linewidth: 2, 
      transparent: true, 
      opacity: 0.88 
    });

    // Pitch perimeter
    const borderPoints = [
      new THREE.Vector3(-pitchWidth / 2 + 1, 0.05, -pitchLength / 2 + 1),
      new THREE.Vector3(pitchWidth / 2 - 1, 0.05, -pitchLength / 2 + 1),
      new THREE.Vector3(pitchWidth / 2 - 1, 0.05, pitchLength / 2 - 1),
      new THREE.Vector3(-pitchWidth / 2 + 1, 0.05, pitchLength / 2 - 1),
      new THREE.Vector3(-pitchWidth / 2 + 1, 0.05, -pitchLength / 2 + 1),
    ];
    const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderLine = new THREE.Line(borderGeo, lineMat);
    group.add(borderLine);

    // Halfway line
    const halfLinePoints = [
      new THREE.Vector3(-pitchWidth / 2 + 1, 0.05, 0),
      new THREE.Vector3(pitchWidth / 2 - 1, 0.05, 0)
    ];
    const halfLineGeo = new THREE.BufferGeometry().setFromPoints(halfLinePoints);
    const halfLine = new THREE.Line(halfLineGeo, lineMat);
    group.add(halfLine);

    // Center circle
    const centerCircleGeo = new THREE.RingGeometry(4.8, 5.0, 48);
    const centerCircleMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.85 
    });
    const centerCircle = new THREE.Mesh(centerCircleGeo, centerCircleMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.y = 0.06;
    group.add(centerCircle);

    // Center point
    const centerPointGeo = new THREE.CircleGeometry(0.5, 24);
    const centerPoint = new THREE.Mesh(centerPointGeo, centerCircleMat);
    centerPoint.rotation.x = -Math.PI / 2;
    centerPoint.position.y = 0.07;
    group.add(centerPoint);

    // Goal Boxes (North & South)
    const penaltyBoxes = [-1, 1];
    penaltyBoxes.forEach(dir => {
      const zOffset = dir * (pitchLength / 2 - 1);
      const pBoxPoints = [
        new THREE.Vector3(-8, 0.05, zOffset),
        new THREE.Vector3(-8, 0.05, zOffset - dir * 8),
        new THREE.Vector3(8, 0.05, zOffset - dir * 8),
        new THREE.Vector3(8, 0.05, zOffset)
      ];
      const pBoxGeo = new THREE.BufferGeometry().setFromPoints(pBoxPoints);
      group.add(new THREE.Line(pBoxGeo, lineMat));

      // 3D Goal Posts (Arcos)
      const goalGroup = new THREE.Group();
      const goalPostMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.8, 
        roughness: 0.2,
        wireframe: isWire 
      });
      const postRadius = 0.25;
      const postHeight = 3.5;
      const postWidth = 7;

      // Left post
      const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, postHeight), goalPostMat);
      leftPost.position.set(-postWidth / 2, postHeight / 2, zOffset);
      goalGroup.add(leftPost);

      // Right post
      const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, postHeight), goalPostMat);
      rightPost.position.set(postWidth / 2, postHeight / 2, zOffset);
      goalGroup.add(rightPost);

      // Crossbar
      const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, postWidth), goalPostMat);
      crossbar.rotation.z = Math.PI / 2;
      crossbar.position.set(0, postHeight, zOffset);
      goalGroup.add(crossbar);

      // Goal net wireframe
      const netGeo = new THREE.BoxGeometry(postWidth, postHeight, 3);
      const netMat = new THREE.MeshBasicMaterial({ 
        color: 0x44ffaa, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.35 
      });
      const net = new THREE.Mesh(netGeo, netMat);
      net.position.set(0, postHeight / 2, zOffset + dir * 1.5);
      goalGroup.add(net);

      group.add(goalGroup);
    });

    // 3. Stadium Bleachers & Grandstands (Surrounding Oval)
    const bleacherMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.7,
      metalness: 0.4,
      wireframe: isWire
    });

    for (let ring = 1; ring <= 4; ring++) {
      const ringWidth = pitchWidth + ring * 4.5;
      const ringLength = pitchLength + ring * 4.5;
      const stepHeight = ring * 1.6;

      const standGeo = new THREE.BoxGeometry(ringWidth, 1.2, ringLength);
      const standMesh = new THREE.Mesh(standGeo, bleacherMat);
      standMesh.position.y = -1.5 + stepHeight * 0.5;
      group.add(standMesh);
    }

    // 4. Stadium Perimeter Floodlight Towers (Torres de Iluminación)
    const lightTowersPositions = [
      { x: -pitchWidth / 2 - 5, z: -pitchLength / 2 - 4 },
      { x: pitchWidth / 2 + 5, z: -pitchLength / 2 - 4 },
      { x: -pitchWidth / 2 - 5, z: pitchLength / 2 + 4 },
      { x: pitchWidth / 2 + 5, z: pitchLength / 2 + 4 },
    ];

    const towerMat = new THREE.MeshStandardMaterial({ 
      color: 0x374151, 
      metalness: 0.85, 
      roughness: 0.3,
      wireframe: isWire
    });
    const lightHeadMat = new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8 
    });

    lightTowersPositions.forEach(pos => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 16, 8), towerMat);
      tower.position.set(pos.x, 8, pos.z);
      group.add(tower);

      // Light beam head
      const head = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 1.5), lightHeadMat);
      head.position.set(pos.x, 16.5, pos.z);
      head.lookAt(0, 0, 0);
      group.add(head);

      // Volumetric Light Cone
      const coneGeo = new THREE.ConeGeometry(8, 22, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: lightsActive ? 0.08 : 0.01,
        side: THREE.DoubleSide
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(pos.x, 9, pos.z);
      cone.lookAt(0, 0, 0);
      cone.rotateX(Math.PI / 2);
      group.add(cone);
    });

    // 5. Tactical Radar Ring Floating Above Center
    const radarGeo = new THREE.RingGeometry(8, 8.4, 64);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const radar = new THREE.Mesh(radarGeo, radarMat);
    radar.rotation.x = -Math.PI / 2;
    radar.position.y = 8;
    group.add(radar);

    // 6. Dynamic Laser Scanline across pitch
    const scanGeo = new THREE.PlaneGeometry(pitchWidth, 0.45);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const scanMesh = new THREE.Mesh(scanGeo, scanMat);
    scanMesh.rotation.x = -Math.PI / 2;
    scanMesh.position.y = 0.12;
    group.add(scanMesh);
    scannerMeshRef.current = scanMesh;

    return group;
  }, [lightsActive]);

  // Helper: Create the 3D Sport-Specific Ball
  const buildBall3D = useCallback((scene: THREE.Scene, sport: SportCode, isWire: boolean) => {
    const group = new THREE.Group();

    if (sport === 'BALONCESTO') {
      // 🏀 3D Basketball with seam ribs
      const ballRadius = 6.2;
      const sphereGeo = new THREE.SphereGeometry(ballRadius, 48, 48);
      const ballMat = new THREE.MeshStandardMaterial({
        color: 0xd9531e, // Deep Basketball Orange
        roughness: 0.8,
        metalness: 0.1,
        wireframe: isWire
      });
      const ballMesh = new THREE.Mesh(sphereGeo, ballMat);
      group.add(ballMesh);

      // Black Ribbing Seams
      const seamMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(ballRadius + 0.05, 0.16, 16, 64), seamMat);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(ballRadius + 0.05, 0.16, 16, 64), seamMat);
      ring2.rotation.x = Math.PI / 2;
      const ring3 = new THREE.Mesh(new THREE.TorusGeometry(ballRadius + 0.05, 0.16, 16, 64), seamMat);
      ring3.rotation.y = Math.PI / 2;

      group.add(ring1);
      group.add(ring2);
      group.add(ring3);
    } else if (sport === 'PADEL') {
      // 🎾 3D Padel / Tennis Ball
      const ballRadius = 5.8;
      const ballGeo = new THREE.SphereGeometry(ballRadius, 40, 40);
      const feltMat = new THREE.MeshStandardMaterial({
        color: 0xc8ff00, // Optic Yellow Felt
        roughness: 0.95,
        metalness: 0.05,
        wireframe: isWire
      });
      const ballMesh = new THREE.Mesh(ballGeo, feltMat);
      group.add(ballMesh);

      // Curved seam
      const seamGeo = new THREE.TorusGeometry(ballRadius + 0.04, 0.15, 12, 64);
      const seamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const seam = new THREE.Mesh(seamGeo, seamMat);
      seam.rotation.x = Math.PI / 4;
      seam.rotation.y = Math.PI / 4;
      group.add(seam);
    } else if (sport === 'ECUAVOLEY' || sport === 'VOLEIBOL') {
      // 🏐 3D Volleyball with Tri-color Panels
      const ballRadius = 6.0;
      const ballGeo = new THREE.SphereGeometry(ballRadius, 36, 36);
      const ballMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Vibrant Blue
        roughness: 0.5,
        metalness: 0.15,
        wireframe: isWire
      });
      const ballMesh = new THREE.Mesh(ballGeo, ballMat);
      group.add(ballMesh);

      // Yellow & White Accent Stripes
      const ringYellow = new THREE.Mesh(
        new THREE.TorusGeometry(ballRadius + 0.06, 0.7, 16, 64),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
      );
      ringYellow.rotation.y = Math.PI / 3;
      group.add(ringYellow);

      const ringWhite = new THREE.Mesh(
        new THREE.TorusGeometry(ballRadius + 0.06, 0.7, 16, 64),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
      );
      ringWhite.rotation.x = Math.PI / 3;
      group.add(ringWhite);
    } else {
      // ⚽ 3D Soccer Ball (Fútbol 11 & Fútsal)
      const ballRadius = 6.0;
      // Polyhedron / Icosahedron faceted geometry for soccer ball effect
      const icosaGeo = new THREE.IcosahedronGeometry(ballRadius, 2);
      const leatherMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.35,
        metalness: 0.25,
        wireframe: isWire,
        flatShading: true
      });
      const ballMesh = new THREE.Mesh(icosaGeo, leatherMat);
      group.add(ballMesh);

      // Inner Core Pentagonal Black Patterns
      const pentagonGeo = new THREE.DodecahedronGeometry(ballRadius + 0.08, 0);
      const pentagonMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.3,
        metalness: 0.4,
        wireframe: isWire,
        flatShading: true
      });
      const pentagons = new THREE.Mesh(pentagonGeo, pentagonMat);
      group.add(pentagons);

      // Outer Glowing Sci-Fi Ring Orbiting the Ball
      const orbitGeo = new THREE.TorusGeometry(ballRadius * 1.45, 0.12, 16, 80);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.75
      });
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
      orbitRing.rotation.x = Math.PI / 3;
      group.add(orbitRing);
    }

    // Dynamic pedestal stand
    const standGeo = new THREE.CylinderGeometry(4.5, 6.0, 1.8, 32);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: isWire
    });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = -7.5;
    group.add(stand);

    // Glowing Pedestal Ring
    const pedRingGeo = new THREE.RingGeometry(5.8, 6.4, 40);
    const pedRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide
    });
    const pedRing = new THREE.Mesh(pedRingGeo, pedRingMat);
    pedRing.rotation.x = -Math.PI / 2;
    pedRing.position.y = -6.5;
    group.add(pedRing);

    return group;
  }, []);

  // Helper: Create the 3D Championship Trophy
  const buildTrophy3D = useCallback((scene: THREE.Scene, isWire: boolean) => {
    const group = new THREE.Group();

    // Gold Material with rich metallic sheen
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffb800,
      metalness: 0.92,
      roughness: 0.18,
      wireframe: isWire
    });

    const darkBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.3,
      wireframe: isWire
    });

    // 1. Trophy Pedestal Base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 6.2, 2.5, 8), darkBaseMat);
    base1.position.y = -8.0;
    group.add(base1);

    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.8, 2.0, 16), goldMat);
    base2.position.y = -6.0;
    group.add(base2);

    // 2. Trophy Stem & Central Knot
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 4.5, 24), goldMat);
    stem.position.y = -3.2;
    group.add(stem);

    const knot = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), goldMat);
    knot.position.y = -1.2;
    group.add(knot);

    // 3. Chalice Cup
    const cupOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(5.4, 2.0, 7.5, 32, 1, true),
      goldMat
    );
    cupOuter.position.y = 3.0;
    group.add(cupOuter);

    const cupBase = new THREE.Mesh(new THREE.SphereGeometry(2.1, 32, 16), goldMat);
    cupBase.position.y = -0.6;
    group.add(cupBase);

    // 4. Elegant Handles (Asas del Trofeo)
    const handleGeo = new THREE.TorusGeometry(3.2, 0.45, 16, 48, Math.PI * 1.2);
    const leftHandle = new THREE.Mesh(handleGeo, goldMat);
    leftHandle.position.set(-4.6, 3.2, 0);
    leftHandle.rotation.z = Math.PI / 1.1;
    group.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMat);
    rightHandle.position.set(4.6, 3.2, 0);
    rightHandle.rotation.z = -Math.PI / 1.1;
    group.add(rightHandle);

    // 5. Crown Star Crest atop Trophy
    const starCrown = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.1
      })
    );
    starCrown.position.y = 7.8;
    group.add(starCrown);

    // Floating Halo around trophy
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(6.5, 7.0, 48),
      new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 6.2;
    group.add(halo);

    return group;
  }, []);

  // Main Three.js Initialization & Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 600;
    const heightPx = typeof height === 'number' ? height : container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 18, 38);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(20, 40, 20);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.4);
    dirLight2.position.set(-20, 30, -20);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 50);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    // 5. Ambient Floating Particles (Stardust)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = Math.random() * 35;
      positions[i + 2] = (Math.random() - 0.5) * 60;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.45,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesGroupRef.current = particles;

    // 6. Assemble Active Model Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Load selected 3D geometry
    let activeMesh: THREE.Group;
    if (active3DMode === 'STADIUM') {
      activeMesh = buildStadium3D(scene, sportCode, wireframeMode);
      camera.position.set(0, 24, 38);
    } else if (active3DMode === 'BALL') {
      activeMesh = buildBall3D(scene, sportCode, wireframeMode);
      camera.position.set(0, 4, 26);
    } else {
      activeMesh = buildTrophy3D(scene, wireframeMode);
      camera.position.set(0, 4, 28);
    }
    camera.lookAt(0, 0, 0);
    modelGroup.add(activeMesh);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp rotation towards target
      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.4;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      modelGroup.rotation.x = currentRotationRef.current.x;
      modelGroup.rotation.y = currentRotationRef.current.y;

      // Floating gentle bounce animation & Stadium Scanner
      if (active3DMode === 'BALL') {
        modelGroup.position.y = Math.sin(elapsedTime * 2.5) * 0.8;
      } else if (active3DMode === 'TROPHY') {
        modelGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.5;
      } else {
        modelGroup.position.y = 0;
        if (scannerMeshRef.current) {
          scannerMeshRef.current.position.z = Math.sin(elapsedTime * 1.8) * 18;
        }
      }

      // Rotate particle dust
      if (particlesGroupRef.current) {
        particlesGroupRef.current.rotation.y += delta * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
      scene.clear();
    };
  }, [active3DMode, sportCode, wireframeMode, buildStadium3D, buildBall3D, buildTrophy3D, autoRotate, height]);

  // Mouse & Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    // Clamp vertical angle to prevent flipping
    targetRotationRef.current.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 2.2, targetRotationRef.current.x));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!interactive || !isDraggingRef.current || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.01;
    targetRotationRef.current.x += deltaY * 0.01;
    targetRotationRef.current.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 2.2, targetRotationRef.current.x));

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0c1410] via-[#090d0b] to-[#050505] border border-white/10 shadow-2xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
      }}
    >
      {/* Dynamic 3D Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-[#050505]/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
            Motor WebGL 3D • 60 FPS
          </span>
          <span className="text-[10px] text-white/40 border-l border-white/10 pl-2">
            {active3DMode === 'STADIUM' ? '🏟️ Cancha Oficial' : active3DMode === 'BALL' ? '⚽ Balón Oficial' : '🏆 Trofeo de Finales'}
          </span>
        </div>

        {/* 3D Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-[#050505]/85 backdrop-blur-md p-1 rounded-2xl border border-white/10 pointer-events-auto shadow-xl">
          <button
            type="button"
            onClick={() => setActive3DMode('STADIUM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              active3DMode === 'STADIUM'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏟️</span>
            <span className="hidden sm:inline">Estadio 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setActive3DMode('BALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              active3DMode === 'BALL'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⚽</span>
            <span className="hidden sm:inline">Balón 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setActive3DMode('TROPHY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              active3DMode === 'TROPHY'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏆</span>
            <span className="hidden sm:inline">Trofeo 3D</span>
          </button>
        </div>
      </div>

      {/* HUD Corner Tech Crosshairs & Cybernetic Brackets */}
      <div className="corner-bracket-tl"></div>
      <div className="corner-bracket-br"></div>
      <div className="absolute top-2 left-2 pointer-events-none text-emerald-400/60 font-mono text-[9px] select-none tracking-widest flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        CAM_LIVE // DEPORVERSO_SPATIAL_V3
      </div>
      <div className="absolute top-2 right-2 pointer-events-none text-cyan-400/60 font-mono text-[9px] select-none tracking-widest hidden sm:block">
        RAYTRACING: FAST_APPROX • VERTICES: 12.4K
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none text-emerald-400/50 font-mono text-[9px] select-none tracking-widest hidden sm:block">
        R2_LATENCY: 14MS • SHADOWS: PCF_SOFT
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none text-cyan-400/50 font-mono text-[9px] select-none tracking-widest hidden sm:block">
        DIM: {sportCode === 'FUTBOL' ? '105m x 68m FIFA' : sportCode === 'BALONCESTO' ? '28m x 15m FIBA' : sportCode === 'PADEL' ? '20m x 10m WPT' : sportCode === 'ECUAVOLEY' ? '18m x 9m RED ALTA' : 'OFICIAL FED'}
      </div>

      {/* Main Interactive 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none"
        onClick={() => {
          targetRotationRef.current.y += 0.65;
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Floating Instructions & Camera Presets Pill */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white/70 shadow-lg">
        <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
        <span className="hidden sm:inline">Cámara 360°:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { targetRotationRef.current = { x: 0.35, y: 0.5 }; }}
            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-[10px] font-bold text-white cursor-pointer transition-colors"
          >
            TV
          </button>
          <button
            type="button"
            onClick={() => { targetRotationRef.current = { x: 1.15, y: 0.0 }; }}
            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-[10px] font-bold text-white cursor-pointer transition-colors"
          >
            Táctica
          </button>
          <button
            type="button"
            onClick={() => { targetRotationRef.current = { x: 0.08, y: 0.85 }; }}
            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-[10px] font-bold text-white cursor-pointer transition-colors"
          >
            Cancha
          </button>
          <button
            type="button"
            onClick={() => { targetRotationRef.current = { x: 0.18, y: -0.75 }; }}
            className="px-2 py-0.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-[10px] font-bold text-red-300 border border-red-500/30 cursor-pointer transition-colors"
          >
            VAR 4K
          </button>
        </div>
      </div>

      {/* Visual Quick Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-[#0a0a0a]/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              autoRotate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/60 hover:text-white'
            }`}
            title={autoRotate ? 'Pausar auto-rotación' : 'Activar auto-rotación'}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              wireframeMode ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/60 hover:text-white'
            }`}
            title="Alternar Vista Holográfica / Wireframe"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              targetRotationRef.current = { x: 0.35, y: 0.5 };
            }}
            className="p-2 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-all cursor-pointer"
            title="Reiniciar Cámara 3D"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
