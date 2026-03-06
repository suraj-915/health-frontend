import React, { useEffect } from "react";
import { useDashboardStore } from "./store/useDashboardStore";
import BedCapacityChart from "./components/BedCapacityChart";
import BloodLiquidityTable from "./components/BloodLiquidityTable";
import AmcTracker from "./components/AmcTracker";
import EmsDiversionMap from "./components/EmsDiversionMap";

function App() {
  const hospitals = useDashboardStore((state) => state.hospitals);
  const progressSimulation = useDashboardStore((state) => state.progressSimulation);
  const moveAmbulances = useDashboardStore((state) => state.moveAmbulances);

  // The Hackathon Magic: Dual Timers for Smooth Animation & Data Sync
  useEffect(() => {
    // Timer 1: Data updates (Oxygen drops, ETA countdown) every 3 seconds
    const dataInterval = setInterval(() => {
      progressSimulation();
    }, 3000); 

    // Timer 2: 60fps-style smooth map movement every 100ms
    const animationInterval = setInterval(() => {
      moveAmbulances();
    }, 100);

    // Cleanup intervals when component unmounts to prevent memory leaks
    return () => {
      clearInterval(dataInterval);
      clearInterval(animationInterval);
    };
  }, [progressSimulation, moveAmbulances]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Swasthya Command Center</h1>
          <p className="text-slate-400 mt-1">Live Tracking: {hospitals.length} Government Facilities (Bengaluru)</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-900 text-emerald-400 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium">eRaktKosh Sync: LIVE</span>
        </div>
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Top Left: EMS Diversion Map */}
        <EmsDiversionMap />

        {/* Top Right: Bed Capacity Chart */}
        <BedCapacityChart />

        {/* Bottom Left: Blood Liquidity Table */}
        <BloodLiquidityTable />

        {/* Bottom Right: AMC Equipment Tracker */}
        <AmcTracker />

      </div>
    </div>
  );
}

export default App;