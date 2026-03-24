"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function GpuMesh({ accent, isMobile, onToggleSpecs }) {
  const rootRef = useRef(null);
  const accentMaterials = useRef([]);
  const targetColor = useMemo(() => new THREE.Color(accent), [accent]);
  const fanBladeAngles = useMemo(
    () => Array.from({ length: isMobile ? 7 : 9 }, (_, index) => (index / (isMobile ? 7 : 9)) * Math.PI * 2),
    [isMobile]
  );
  const finOffsets = useMemo(() => Array.from({ length: 20 }, (_, index) => -2.8 + index * 0.29), []);

  useFrame((_, delta) => {
  const fanBladeAngles = useMemo(() => {
    const blades = isMobile ? 7 : 9;
    return Array.from({ length: blades }, (_, index) => (index / blades) * Math.PI * 2);
  }, [isMobile]);
  const finOffsets = useMemo(() => Array.from({ length: 20 }, (_, index) => -2.8 + index * 0.29), []);
  const screws = useMemo(() => {
    const x = 3.15;
    const y = 1.23;
    const z = 0.44;
    return [
      [x, y, z],
      [-x, y, z],
      [x, -y, z],
      [-x, -y, z],
    ];
  }, []);
      const x = 3.15;
      const y = 1.23;
      const z = 0.44;
    });
  });
      rootRef.current.rotation.y += delta * 0.08;


    for (const material of accentMaterials.current) {
    const x = 2.6;
        <group
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.35}>
      <group
        ref={rootRef}
        onPointerDown={(event) => {
          event.stopPropagation();
          onToggleSpecs();
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7.5, 2.9, 0.98]} />
          <meshStandardMaterial color="#2a2f38" metalness={0.82} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0.52]} castShadow>
          <boxGeometry args={[7.25, 2.62, 0.12]} />
          <meshStandardMaterial color="#11151b" metalness={0.68} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0.94, 0.54]}>
          <boxGeometry args={[7.1, 0.18, 0.07]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material && !accentMaterials.current.includes(material)) accentMaterials.current.push(material);
            }}
            color={accent}
            emissive={accent}
            emissiveIntensity={0.85}
            metalness={0.54}
            roughness={0.23}
          />
        </mesh>

        <mesh position={[0, -1.22, 0.2]} castShadow>
          <boxGeometry args={[6.8, 0.12, 0.34]} />
          <meshStandardMaterial color="#7a8698" metalness={1} roughness={0.18} />
        </mesh>

        <mesh position={[3.82, 0, 0.1]} castShadow>
          <boxGeometry args={[0.32, 2.7, 0.86]} />
          <meshStandardMaterial color="#a6afbe" metalness={1} roughness={0.2} />
        </mesh>

        <mesh position={[-3.58, 0, -0.1]} castShadow>
          <boxGeometry args={[0.42, 2.45, 0.52]} />
          <meshStandardMaterial color="#0d1118" metalness={0.58} roughness={0.44} />
        </mesh>

        {finOffsets.map((x) => (
          <mesh key={`fin-${x}`} position={[x, 0, -0.44]}>
            <boxGeometry args={[0.03, 2.35, 0.12]} />
            <meshStandardMaterial color="#313843" metalness={0.84} roughness={0.22} />
          </mesh>
        ))}

        {[-2.35, 0, 2.35].map((xPos, fanIndex) => (
          <group key={`fan-${xPos}`} position={[xPos, 0, 0.59]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.89, 0.89, 0.22, isMobile ? 34 : 52]} />
              <meshStandardMaterial color="#10151c" metalness={0.7} roughness={0.28} />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
              <ringGeometry args={[0.62, 0.81, isMobile ? 48 : 84]} />
              <meshStandardMaterial
                ref={(material) => {
                  if (material && !accentMaterials.current.includes(material)) accentMaterials.current.push(material);
                }}
                color={accent}
                emissive={accent}
                emissiveIntensity={fanIndex === 1 ? 1.18 : 0.88}
                metalness={0.38}
                roughness={0.22}
              />
            </mesh>

            <group position={[0, 0, 0.09]}>
              {fanBladeAngles.map((angle, index) => (
                <mesh key={`blade-${fanIndex}-${index}`} rotation={[0, 0, angle]} position={[0.34, 0, 0]}>
                  <boxGeometry args={[0.5, 0.09, 0.045]} />
                  <meshStandardMaterial color="#cad2de" metalness={0.88} roughness={0.2} />
                </mesh>
              ))}
            </group>

            <mesh position={[0, 0, 0.11]}>
              <cylinderGeometry args={[0.19, 0.19, 0.12, 20]} />
              <meshStandardMaterial color="#f0f5ff" metalness={1} roughness={0.14} />
            </mesh>
          </group>
        ))}

        {screws.map(([x, y, z], idx) => (
          <mesh key={`screw-${idx}`} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
            <meshStandardMaterial color="#bcc6d3" metalness={1} roughness={0.14} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
      const canvas = document.createElement("canvas");
      const hasWebgl = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
      setSupportsWebgl(hasWebgl);
    } catch {
      setSupportsWebgl(false);
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const sparkleCount = isMobile ? 40 : 120;

  if (!supportsWebgl) {
    return (
      <div className="gpu-viewer-shell gpu-viewer-error" role="alert">
        <p>3D rendering is unavailable on this device/browser.</p>
        <p>Please enable hardware acceleration or try a different browser.</p>
      </div>
    );
  }

  return (
    <div className="gpu-viewer-shell" onClick={(event) => event.target === event.currentTarget && onToggleSpecs(false)}>
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.4, 7.6], fov: 44 }}
      >
        <color attach="background" args={["#06080d"]} />
        <fog attach="fog" args={["#06080d", 7, 15]} />

        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={0.4} color="#f4f8ff" groundColor="#08111f" />
        <directionalLight position={[1.4, 8.5, 5]} intensity={1.45} color="#f8fdff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <pointLight position={[4.2, 0.5, 2]} intensity={2.2} color={product.accent} />
        <pointLight position={[-4.2, -0.5, 2]} intensity={1.3} color="#ff2fcb" />
        <spotLight position={[0, -3, 1]} angle={0.85} penumbra={1} intensity={1.35} color="#3dd9ff" />

        <GpuMesh accent={product.accent} isMobile={isMobile} onToggleSpecs={() => onToggleSpecs()} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
          <circleGeometry args={[8, 64]} />
          <meshPhysicalMaterial
            color="#131723"
            roughness={0.2}
            metalness={0.62}
            transmission={0.1}
            clearcoat={0.8}
            reflectivity={0.86}
          />
        </mesh>

        <Sparkles count={sparkleCount} scale={[10, 4, 8]} size={isMobile ? 0.7 : 1.2} speed={0.32} color={product.accent} />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={5.6}
          maxDistance={10}
          minPolarAngle={Math.PI / 2.7}
          maxPolarAngle={Math.PI / 1.85}
          rotateSpeed={0.62}
          zoomSpeed={0.7}
          autoRotate={!isInteracting}
          autoRotateSpeed={0.5}
          onStart={() => {
            setIsInteracting(true);
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
          }}
          onEnd={() => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            timeoutRef.current = window.setTimeout(() => setIsInteracting(false), 1800);
          }}
        />
      </Canvas>

      <div className="gpu-viewer-hint">Drag to rotate • Scroll to zoom</div>

      <div className={`gpu-specs-tooltip ${showSpecs ? "is-visible" : ""}`}>
        <p className="gpu-specs-tooltip__title">{product.name}</p>
        <div className="gpu-specs-grid">
          <div>
            <span>Clock Speed</span>
            <strong>{product.specs.clock}</strong>
          </div>
          <div>
            <span>VRAM</span>
            <strong>{product.specs.vram}</strong>
          </div>
          <div>
            <span>AI TOPS</span>
            <strong>{product.specs.aiTops}</strong>
          </div>
          <div>
            <span>TDP</span>
            <strong>{product.specs.tdp}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
