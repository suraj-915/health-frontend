import React, { useEffect, useState } from "react";
import { Activity, Map as MapIcon, Bed, Droplets, AlertTriangle, LogOut } from "lucide-react";

// Components
import { useDashboardStore } from "./store/useDashboardStore";
import BedCapacityChart from "./components/BedCapacityChart";
import BloodLiquidityTable from "./components/BloodLiquidityTable";
import AmcTracker from "./components/AmcTracker";
import EmsDiversionMap from "./components/EmsDiversionMap";
import TerminalLogin from "./components/TerminalLogin";
import PathogenScene from "./components/PathogenScene";

// ==========================================
// ROLE-BASED MENU CONFIGURATION
// ==========================================
const MENU_CONFIG = [
  { id: 'map', label: 'EMS DIVERSION', icon: MapIcon, roles: ['ADMIN', 'MEDICAL_OFFICER', 'LOGISTICS'] },
  { id: 'beds', label: 'BED CAPACITY', icon: Bed, roles: ['ADMIN', 'MEDICAL_OFFICER'] },
  { id: 'blood', label: 'BLOOD INVENTORY', icon: Droplets, roles: ['ADMIN', 'LOGISTICS'] },
  { id: 'amc', label: 'AMC TRACKER', icon: AlertTriangle, roles: ['ADMIN'] },
];

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [personnelName, setPersonnelName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeTab, setActiveTab] = useState("map");
  
  const hospitals = useDashboardStore((state) => state.hospitals);
  const progressSimulation = useDashboardStore((state) => state.progressSimulation);
  const moveAmbulances = useDashboardStore((state) => state.moveAmbulances);

  useEffect(() => {
    if (!isLoggedIn) return;
    const dataInterval = setInterval(() => progressSimulation(), 3000);
    const animInterval = setInterval(() => moveAmbulances(), 100);
    return () => { clearInterval(dataInterval); clearInterval(animInterval); };
  }, [isLoggedIn, progressSimulation, moveAmbulances]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPersonnelName("");
    setUserRole("");
    setActiveTab("map");
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#010805] font-mono">
        
        {/* Render the advanced 3D pathogen scene behind the login */}
        <PathogenScene />

        {/* Terminal Login Component Mounted Over Canvas */}
        <TerminalLogin 
          onLogin={(name, role) => {
            setPersonnelName(name);
            setUserRole(role);
            setIsLoggedIn(true);
          }} 
        />
        
        {/* Terminal Scanline Effect Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,18,5,0)_50%,rgba(0,255,100,0.02)_50%)] bg-[length:100%_4px] z-30" />
      </div>
    );
  }

  // Determine which menu items the current user is allowed to see
  const allowedMenus = MENU_CONFIG.filter(menu => menu.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-[#010805] text-emerald-50 p-6 font-mono selection:bg-emerald-900 selection:text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_#022c22_0%,_#010805_100%)] z-0" />

      {/* HEADER BAR */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-emerald-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-emerald-500 uppercase flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
           DASHBOARD
          </h1>
          <p className="text-emerald-800 text-xs font-bold mt-2 tracking-[0.2em]">
            CMDR: <span className="text-emerald-400">{personnelName.toUpperCase()}</span> // 
            ROLE: <span className="text-emerald-400">{userRole}</span> // 
            NODES: {hospitals.length} // SECTOR: BLR
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest uppercase">VIRAL_LOAD_SYNC: LIVE</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-colors"
          >
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      </div>
      
      {/* NAVIGATION TABS (ROLE FILTERED) */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-6 border-b border-emerald-900/20 pb-4">
        {allowedMenus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeTab === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-[0.15em] transition-all border ${
                isActive 
                  ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'bg-[#03150d] border-emerald-900/30 text-emerald-700 hover:bg-emerald-900/20 hover:text-emerald-500'
              }`}
            >
              <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
              {menu.label}
            </button>
          );
        })}
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <div className="relative z-10 flex-1 w-full">
        {activeTab === 'map' && <EmsDiversionMap />}
        {activeTab === 'beds' && <BedCapacityChart />}
        {activeTab === 'blood' && <BloodLiquidityTable />}
        {activeTab === 'amc' && <AmcTracker />}
      </div>

      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,18,5,0)_50%,rgba(0,255,100,0.01)_50%)] bg-[length:100%_4px] z-50" />
    </div>
  );
}