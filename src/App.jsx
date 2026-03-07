import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

// Components
import { useDashboardStore } from "./store/useDashboardStore";
import BedCapacityChart from "./components/BedCapacityChart";
import BloodLiquidityTable from "./components/BloodLiquidityTable";
import AmcTracker from "./components/AmcTracker";
import EmsDiversionMap from "./components/EmsDiversionMap";
import TerminalLogin from "./components/TerminalLogin";
import PathogenScene from "./components/PathogenScene";

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
        
        {/* Render the advanced 3D pathogen scene behind the login */}
        <PathogenScene />

        {/* Terminal Login Component Mounted Over Canvas */}
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