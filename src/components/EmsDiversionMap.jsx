import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Navigation } from 'lucide-react';

// Scaled down glowing Blue Hospital SVG Icon
const hospitalIcon = L.divIcon({
  className: 'bg-transparent border-none',
  html: `<div style="color: #60A5FA; filter: drop-shadow(0 0 8px #3B82F6); display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Scaled down glowing Red Ambulance SVG Icon
const ambulanceIcon = L.divIcon({
  className: 'bg-transparent border-none',
  html: `<div class="animate-pulse" style="color: #F87171; filter: drop-shadow(0 0 8px #EF4444); display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/>
            <path d="M14 8h5l3 5v5h-2"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="18" r="2"/>
          </svg>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export default function EmsDiversionMap({ onHospitalSelect }) {
  const hospitals = useDashboardStore((state) => state.hospitals);
  const ambulances = useDashboardStore((state) => state.ambulances);
  const setSelectedHospital = useDashboardStore((state) => state.setSelectedHospital);

  const centerCoordinates = [12.9600, 77.5900];

  return (
    // Changed to h-full, w-full, and flex-1 to stretch dynamically
    <Card className="h-full w-full flex-1 bg-[#010805] border-emerald-900/30 text-emerald-50 flex flex-col overflow-hidden">
      <CardHeader className="pb-2 border-b border-emerald-900/20 shrink-0">
        <CardTitle className="text-xl flex items-center gap-2 text-emerald-500 uppercase tracking-widest">
          <Navigation className="text-blue-400 h-5 w-5 animate-pulse" />
          Active EMS Diversion
        </CardTitle>
      </CardHeader>
      
      {/* Replaced fixed min-h with flex-1 w-full h-full so it takes 100% of the remaining area */}
      <CardContent className="flex-1 p-0 relative w-full h-full">
        <MapContainer 
          center={centerCoordinates} 
          zoom={12} 
          style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />

          {hospitals.map((hosp) => (
            <Marker 
              key={hosp.id} 
              position={hosp.coordinates} 
              icon={hospitalIcon}
              eventHandlers={{
                click: () => {
                  setSelectedHospital(hosp.id);
                  if (onHospitalSelect) onHospitalSelect();
                }
              }}
            >
              <Popup className="text-slate-900 font-bold font-mono">
                {hosp.name} <br/> ICU Beds: {hosp.beds.icu.total - hosp.beds.icu.occupied} Available
              </Popup>
            </Marker>
          ))}

          {ambulances.map((amb) => (
            <Marker key={amb.id} position={amb.coordinates} icon={ambulanceIcon}>
              <Popup className="text-slate-900 font-bold font-mono">
                {amb.id} ({amb.type}) <br/> Dest: {amb.destination} <br/> ETA: {amb.etaMins} mins
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}