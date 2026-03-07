import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function VirusNode({ position, scale = 1 }) {
  const groupRef = useRef(null);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + timeOffset;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.3;
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.z = Math.cos(t * 0.12) * 0.2;
  });

  const spikePositions = useMemo(() => {
    const positions = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.52 * scale;
      positions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return positions;
  }, [scale]);

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Core body */}
        <mesh>
          <sphereGeometry args={[0.5 * scale, 64, 64]} />
          <meshPhysicalMaterial
            color="#0a3d2a"
            roughness={0.3}
            metalness={0.1}
            transmission={0.15}
            thickness={1.5}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            envMapIntensity={0.5}
          />
        </mesh>
        {/* Spikes */}
        {spikePositions.map((pos, i) => {
          const dir = new THREE.Vector3(...pos).normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir
          );
          return (
            <group key={i} position={pos} quaternion={quat}>
              <mesh>
                <cylinderGeometry args={[0.008 * scale, 0.025 * scale, 0.18 * scale, 6]} />
                <meshPhysicalMaterial
                  color="#0d5e3f"
                  roughness={0.4}
                  metalness={0.05}
                />
              </mesh>
              <mesh position={[0, 0.1 * scale, 0]}>
                <sphereGeometry args={[0.03 * scale, 8, 8]} />
                <meshPhysicalMaterial
                  color="#15a06a"
                  roughness={0.3}
                  emissive="#0a5e3a"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </Float>
  );
}

function BacteriaNode({ position, scale = 1 }) {
  const groupRef = useRef(null);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + timeOffset;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.4;
    groupRef.current.rotation.z = t * 0.06;
  });

  const flagella = useMemo(() => {
    const curves = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const points = [];
      for (let j = 0; j < 12; j++) {
        const t = j / 11;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * (0.15 + t * 0.6) * scale,
            (Math.random() - 0.5) * 0.1 * scale + Math.sin(t * 4) * 0.08 * scale,
            Math.sin(angle) * (0.15 + t * 0.6) * scale
          )
        );
      }
      curves.push(new THREE.CatmullRomCurve3(points));
    }
    return curves;
  }, [scale]);

  return (
    <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} position={position}>
        {/* Capsule body */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.2 * scale, 0.6 * scale, 32, 64]} />
          <meshPhysicalMaterial
            color="#0b4430"
            roughness={0.35}
            metalness={0.05}
            transmission={0.1}
            thickness={2}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
        {/* Flagella */}
        {flagella.map((curve, i) => (
          <mesh key={i}>
            <tubeGeometry args={[curve, 30, 0.008 * scale, 5, false]} />
            <meshPhysicalMaterial
              color="#0d5e3f"
              roughness={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Particles() {
  const count = 200;
  const ref = useRef(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sz[i] = Math.random() * 0.03 + 0.005;
    }
    return [pos, sz];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#1a7a52"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function MouseLight() {
  const lightRef = useRef(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    lightRef.current.position.set(x, y, 3);
  });

  return <pointLight ref={lightRef} intensity={2} color="#15a06a" distance={10} />;
}

export default function PathogenScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#010805]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#010805']} />
        <fog attach="fog" args={['#010805', 5, 18]} />

        <ambientLight intensity={0.15} color="#0a3d2a" />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#1a8a5a" />
        <directionalLight position={[-5, -3, 3]} intensity={0.3} color="#0d5040" />
        <MouseLight />

        {/* Viruses */}
        <VirusNode position={[-3.5, 1.5, -2]} scale={1.2} />
        <VirusNode position={[3, -1, -3]} scale={0.9} />
        <VirusNode position={[1, 2.5, -4]} scale={0.7} />
        <VirusNode position={[-1.5, -2.5, -1]} scale={1.0} />

        {/* Bacteria */}
        <BacteriaNode position={[2.5, 1.5, -1.5]} scale={1.1} />
        <BacteriaNode position={[-2, -1, -3.5]} scale={0.8} />
        <BacteriaNode position={[0, -3, -2]} scale={0.9} />

        <Particles />
      </Canvas>
    </div>
  );
}