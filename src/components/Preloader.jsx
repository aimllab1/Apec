import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Minimal 3D background particles
function MinimalParticleRing() {
  const pointsRef = useRef(null);

  const count = 800;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.0 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#9ca3af"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          opacity={0.35}
        />
      </Points>
    </group>
  );
}

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const elementsRef = useRef(null);

  useEffect(() => {
    // Show preloader for 1.6 seconds, then fade elements and morph container out
    const tl = gsap.timeline({
      delay: 1.5,
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    tl.to(elementsRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2');

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* 3D Canvas Background (Minimal Light Stars) */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={1} />
          <MinimalParticleRing />
        </Canvas>
      </div>

      {/* Loading Content */}
      <div 
        ref={elementsRef}
        className="loading-elements relative z-10 flex flex-col items-center max-w-lg px-6 text-center"
      >
        {/* Logo Container with Shared LayoutID for Morph Transition */}
        <div className="relative mb-6 w-28 h-28 flex items-center justify-center">
          <img
            src="./apec-logo.png"
            alt="APEC Logo"
            className="w-24 h-24 object-contain z-10 mix-blend-multiply"
          />
        </div>

        {/* Institution Badge */}
        <span className="px-3 py-1 mb-4 text-[9px] font-bold tracking-widest text-gray-400 uppercase bg-gray-50 border border-gray-200 rounded-full">
          Autonomous Institution
        </span>

        {/* College Name */}
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-1">
          ADHIPARASAKTHI
          <span className="block mt-0.5 text-gray-500 font-medium">
            ENGINEERING COLLEGE
          </span>
        </h1>

        {/* College Motto */}
        <p className="text-[9px] tracking-widest text-gray-400 uppercase mb-8 font-semibold">
          Study • Spirituality • Service
        </p>

        {/* Pulsing indicator line (replaces 0-100 progress numbers) */}
        <div className="w-16 h-0.5 bg-gray-100 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gray-800 rounded-full animate-[loadingLine_1s_infinite_ease-in-out]" />
        </div>
      </div>

      {/* CSS Animations helper inside tailwind style config or inline style */}
      <style>{`
        @keyframes loadingLine {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
