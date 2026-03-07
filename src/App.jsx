import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

// Components
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
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() + timeOffset;

    const currentAngle = startAngle + Math.sin(t * 0.3 * speed) * 0.35;
    const minRadius = 3.5;
    const maxRadius = 4.8;
    const radiusWobble = (Math.sin(t * 0.4 * speed) + 1) / 2;
    const currentRadius = minRadius + radiusWobble * (maxRadius - minRadius);
    const currentZ = Math.sin(t * 0.5) * 1.5 - 0.5;

    const intendedPos = new THREE.Vector3(
      Math.cos(currentAngle) * currentRadius * 1.6, 
      Math.sin(currentAngle) * currentRadius * 0.9, 
      currentZ
    );

    mouseVec.set(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      intendedPos.z
    );

    const dist = intendedPos.distanceTo(mouseVec);
    const dodgeRadius = 2.0; 

    if (dist < dodgeRadius) {
      const dirAway = intendedPos.clone().sub(mouseVec).normalize();
      const force = (dodgeRadius - dist) * 1.5; 
      intendedPos.add(dirAway.multiplyScalar(force));
    }

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
// 1:1 LOVABLE TERMINAL COMPONENT
// ==========================================

function TerminalLogin({ onLogin }) {
  const [officer, setOfficer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officer.trim()) return;
    setLoading(true);
    setTimeout(() => onLogin(officer.trim()), 2500);
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md pointer-events-auto"
      >
        {/* Scanline decoration */}
        <motion.div
          className="mb-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
          <span className="font-display text-[10px] tracking-wide-terminal text-muted-foreground uppercase">
            Secure Access
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
        </motion.div>

        {/* Main card */}
        <div className="glass-panel rounded-lg p-8 glow-primary">
          {/* Icon */}
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <ShieldAlert className="h-10 w-10 text-primary" />
              <div className="absolute inset-0 blur-lg">
                <ShieldAlert className="h-10 w-10 text-primary opacity-60" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="font-display text-sm tracking-terminal text-foreground text-glow mb-2">
              CLINICAL DASHBOARD
            </h1>
            <p className="text-[10px] tracking-wide-terminal text-muted-foreground uppercase">
              Terminal Authentication Required
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-[10px] tracking-terminal text-muted-foreground uppercase mb-2">
                Authorized Medical Officer
              </label>
              <input
                type="text"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                placeholder="ENTER OFFICER ID"
                disabled={loading}
                className="w-full bg-input/50 border border-border rounded px-4 py-3 text-xs font-mono tracking-widest text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !officer.trim()}
              className="w-full relative overflow-hidden bg-primary/10 border border-primary/40 rounded px-4 py-3 font-display text-xs tracking-terminal text-primary hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed glow-primary"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    GETTING DASHBOARD READY
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    INITIATE TERMINAL
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.form>

          {/* Footer decoration */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-2 text-[9px] tracking-terminal text-muted-foreground/50 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
            System Online — Awaiting Credentials
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

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

        {/* 1:1 Lovable Terminal Log in Component Mounted Over Canvas */}
        <TerminalLogin 
          onLogin={(name) => {
            setPersonnelName(name);
            setIsLoggedIn(true);
          }} 
        />
        
        {/* Terminal Scanline Effect Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,18,5,0)_50%,rgba(0,255,100,0.02)_50%)] bg-[length:100%_4px] z-30" />
      </div>
    );
  }

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