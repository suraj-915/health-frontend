import React, { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Capsule } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Biohazard, Skull, Activity, ShieldAlert } from "lucide-react";

// Existing Store & Components
import { useDashboardStore } from "./store/useDashboardStore";
import BedCapacityChart from "./components/BedCapacityChart";
import BloodLiquidityTable from "./components/BloodLiquidityTable";
import AmcTracker from "./components/AmcTracker";
import EmsDiversionMap from "./components/EmsDiversionMap";

// ==========================================
// 3D MODULES: PATHOGENS & INTERACTION
// ==========================================

const PathogenPhysics = ({ children, startAngle = 0, speed = 1 }) => {
  const groupRef = useRef();
  const mouseVec = useMemo(() => new THREE.Vector3(), []);
  
  // Give each pathogen a randomized time offset so their breathing/bobbing isn't synced
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() + timeOffset;

    // 1. Sector-Locked Wandering
    // Instead of orbiting endlessly, they swing back and forth around their starting angle.
    // This mathematically prevents them from ever crossing into another pathogen's space.
    const currentAngle = startAngle + Math.sin(t * 0.3 * speed) * 0.35;

    // Radii bounds to keep them visible but away from the center terminal
    const minRadius = 3.5;
    const maxRadius = 4.8;
    const radiusWobble = (Math.sin(t * 0.4 * speed) + 1) / 2; // 0.0 to 1.0
    const currentRadius = minRadius + radiusWobble * (maxRadius - minRadius);

    // Subtle Z-depth floating
    const currentZ = Math.sin(t * 0.5) * 1.5 - 0.5;

    // Squashed elliptical spread (wider horizontally to fit the screen)
    const intendedPos = new THREE.Vector3(
      Math.cos(currentAngle) * currentRadius * 1.6, 
      Math.sin(currentAngle) * currentRadius * 0.9, 
      currentZ
    );

    // 2. Mouse Repulsion Logic
    mouseVec.set(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      intendedPos.z
    );

    const dist = intendedPos.distanceTo(mouseVec);
    const dodgeRadius = 2.0; 

    // If mouse gets close, calculate a vector away from the mouse and apply it
    if (dist < dodgeRadius) {
      const dirAway = intendedPos.clone().sub(mouseVec).normalize();
      const force = (dodgeRadius - dist) * 1.5; 
      intendedPos.add(dirAway.multiplyScalar(force));
    }

    // Smooth, sluggish lerp to the final position
    groupRef.current.position.lerp(intendedPos, delta * 1.5);
  });

  return <group ref={groupRef}>{children}</group>;
};

const VirusNode = ({ scale = 1, color = "#059669" }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={0}>
      <mesh ref={meshRef} scale={scale}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial color={color} envMapIntensity={0.4} clearcoat={0.8} clearcoatRoughness={0} roughness={0.2} metalness={0.8} distort={0.4} speed={2} />
        </Sphere>
        {[...Array(15)].map((_, i) => (
          <group key={i} rotation={[Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0]}>
            <mesh position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.03, 0.08, 0.4, 8]} />
              <meshStandardMaterial color="#022c22" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </mesh>
    </Float>
  );
};

const BacteriaNode = ({ scale = 1, color = "#047857" }) => {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={0}>
      <group scale={scale}>
        <Capsule args={[0.4, 1.2, 16, 32]}>
          <MeshDistortMaterial color={color} distort={0.2} speed={3} roughness={0.3} />
        </Capsule>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -0.8, 0]} rotation={[0.4, i * 1.2, 0]}>
            <torusGeometry args={[0.4, 0.02, 16, 32, Math.PI / 1.5]} />
            <meshStandardMaterial color="#022c22" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

const SuspendedParticles = () => {
  const count = 300;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return p;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#10b981" transparent opacity={0.4} sizeAttenuation={true} />
    </points>
  );
};

// ==========================================
// UI COMPONENTS (Isolated State)
// ==========================================

const LoginOverlay = ({ onAuthorize }) => {
  const [localName, setLocalName] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!localName.trim()) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      onAuthorize(localName);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="z-20 w-full max-w-md px-6 pointer-events-auto"
    >
      <div className="bg-[#010805]/80 border border-emerald-900/50 backdrop-blur-md shadow-[0_0_50px_rgba(5,150,105,0.2)] p-8">
        <div className="text-center space-y-4 mb-8">
          <Biohazard className={`w-16 h-16 mx-auto text-emerald-500 ${isAuthenticating ? 'animate-spin' : 'animate-pulse'}`} />
          <div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-emerald-400 uppercase">CLINICAL DASHBOARD</h1>
            <p className="text-emerald-700 text-xs tracking-widest mt-1">TERMINAL</p>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-800 to-transparent" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">Authorized Medical Officer</label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              disabled={isAuthenticating}
              className="w-full bg-[#022c22]/30 border border-emerald-900/60 p-3 text-emerald-300 focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-900/60 uppercase tracking-wider disabled:opacity-50"
              placeholder="ENTER SURNAME OR ID"
            />
          </div>
          
          <button 
            type="submit"
            disabled={!localName.trim() || isAuthenticating}
            className="w-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-800 text-emerald-300 font-black tracking-[0.2em] h-12 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {isAuthenticating ? "SEQUENCING DNA..." : "INITIATE TERMINAL"}
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-emerald-800 font-black pt-6 mt-6 border-t border-emerald-950">
          <span className="flex items-center gap-1"><ShieldAlert size={12}/> ENCRYPTED</span>
          <span className="flex items-center gap-1"><Skull size={12}/> THREAT LEVEL: SEVERE</span>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [personnelName, setPersonnelName] = useState("");
  
  const hospitals = useDashboardStore((state) => state.hospitals);
  const progressSimulation = useDashboardStore((state) => state.progressSimulation);
  const moveAmbulances = useDashboardStore((state) => state.moveAmbulances);

  useEffect(() => {
    if (!isLoggedIn) return;
    const dataInterval = setInterval(() => progressSimulation(), 3000);
    const animInterval = setInterval(() => moveAmbulances(), 100);
    return () => { clearInterval(dataInterval); clearInterval(animInterval); };
  }, [isLoggedIn, progressSimulation, moveAmbulances]);

  // --- VIEW: LOGIN TERMINAL ---
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#010805] font-mono">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#064e3b_0%,_#010805_100%)] opacity-80" />
        
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} color="#10b981" intensity={3} />
            <pointLight position={[-5, -5, -5]} color="#ffffff" intensity={0.5} />
            
            <SuspendedParticles />
            
            {/* The 4 pathogens are now strictly assigned to specific PI angles (Corners) */}
            <PathogenPhysics startAngle={Math.PI * 0.85} speed={0.8}>
              <VirusNode scale={1.2} color="#059669" />
            </PathogenPhysics>
            
            <PathogenPhysics startAngle={Math.PI * 1.85} speed={1.1}>
              <BacteriaNode scale={1.1} color="#047857" />
            </PathogenPhysics>
            
            <PathogenPhysics startAngle={Math.PI * 0.15} speed={0.9}>
              <VirusNode scale={0.9} color="#10b981" />
            </PathogenPhysics>
            
            <PathogenPhysics startAngle={Math.PI * 1.15} speed={1.2}>
              <BacteriaNode scale={1.2} color="#022c22" />
            </PathogenPhysics>
          </Canvas>
        </div>

        <LoginOverlay 
          onAuthorize={(name) => {
            setPersonnelName(name);
            setIsLoggedIn(true);
          }} 
        />
        
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,18,5,0)_50%,rgba(0,255,100,0.02)_50%)] bg-[length:100%_4px] z-30" />
      </div>
    );
  }

  // --- VIEW: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#010805] text-emerald-50 p-6 font-mono selection:bg-emerald-900 selection:text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_#022c22_0%,_#010805_100%)] z-0" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-emerald-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-emerald-500 uppercase flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
            PATHOGEN_COMMAND_CTR
          </h1>
          <p className="text-emerald-800 text-xs font-bold mt-2 tracking-[0.2em]">
            CMDR: <span className="text-emerald-400">{personnelName.toUpperCase()}</span> // NODES: {hospitals.length} // SECTOR: BLR
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black tracking-widest uppercase">VIRAL_LOAD_SYNC: LIVE</span>
        </div>
      </div>
      
      <div className="relative z-10 grid grid-cols-12 gap-6">
        <EmsDiversionMap />
        <BedCapacityChart />
        <BloodLiquidityTable />
        <AmcTracker />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,18,5,0)_50%,rgba(0,255,100,0.01)_50%)] bg-[length:100%_4px] z-50" />
    </div>
  );
}