"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT_DESKTOP = 600;
const PARTICLE_COUNT_MOBILE = 250;

function Particles() {
  const count =
    typeof window !== "undefined" && window.innerWidth < 768
      ? PARTICLE_COUNT_MOBILE
      : PARTICLE_COUNT_DESKTOP;

  const points = useRef<THREE.Points>(null);
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#00f2ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <color attach="background" args={["transparent"]} />
      <Particles />
    </Canvas>
  );
}
