"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const PARTICLE_COUNT = 420;
const SPREAD = 14;

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const noise3D = useMemo(() => createNoise3D(), []);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { positions, basePositions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const color1 = new THREE.Color("#3b82f6"); // blue
    const color2 = new THREE.Color("#8b5cf6"); // violet
    const color3 = new THREE.Color("#06b6d4"); // cyan

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Distribute in a disc/sphere shape
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.6) * SPREAD;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * SPREAD * 0.5;
      const z = r * Math.sin(phi) * Math.sin(theta) - 4;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      // Random color blend between blue/violet/cyan
      const t = Math.random();
      const color =
        t < 0.4
          ? color1.clone().lerp(color2, t / 0.4)
          : color2.clone().lerp(color3, (t - 0.4) / 0.6);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 1.5 + 0.4;
    }

    return { positions, basePositions, colors, sizes };
  }, []);

  // Track mouse position
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * 0.15;
    const geometry = meshRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    if (!positionAttr) return;
    const pos = positionAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3] ?? 0;
      const by = basePositions[i3 + 1] ?? 0;
      const bz = basePositions[i3 + 2] ?? 0;

      // Organic noise-based movement
      const noiseX = noise3D(bx * 0.15, by * 0.15, time) * 0.6;
      const noiseY = noise3D(bx * 0.15 + 100, by * 0.15 + 100, time) * 0.6;
      const noiseZ = noise3D(bx * 0.15 + 200, by * 0.15 + 200, time) * 0.3;

      // Mouse parallax influence
      const mouseInfluence = 0.3;
      const mx = mouseRef.current.x * mouseInfluence;
      const my = mouseRef.current.y * mouseInfluence;

      pos[i3] = bx + noiseX + mx;
      pos[i3 + 1] = by + noiseY + my;
      pos[i3 + 2] = bz + noiseZ;
    }

    positionAttr.needsUpdate = true;

    // Slow rotation
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Floating connection lines between nearby particles
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, vertexCount } = useMemo(() => {
    const count = 36;
    const positions = new Float32Array(count * 6); // 2 points per line, 3 components each

    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * SPREAD * 0.8;

      const x1 = r * Math.cos(theta);
      const y1 = (Math.random() - 0.5) * 4;
      const z1 = r * Math.sin(theta) - 4;

      const len = 0.5 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const x2 = x1 + Math.cos(angle) * len;
      const y2 = y1 + (Math.random() - 0.5) * len;
      const z2 = z1 + Math.sin(angle) * len;

      positions[i6] = x1;
      positions[i6 + 1] = y1;
      positions[i6 + 2] = z1;
      positions[i6 + 3] = x2;
      positions[i6 + 4] = y2;
      positions[i6 + 5] = z2;
    }

    return { positions, vertexCount: count * 2 };
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.elapsedTime * 0.1;
    const material = linesRef.current.material as THREE.LineBasicMaterial;
    material.opacity = 0.025 + Math.sin(time * 2) * 0.01;
    linesRef.current.rotation.y = time * 0.3;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={vertexCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.025}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

export function HeroParticles() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
