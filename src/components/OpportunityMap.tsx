"use client";

import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Decision, getDecisionColor } from "@/data/properties";
import { PropertyWithCalculations } from "@/lib/calculations";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OpportunityMapProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  center?: [number, number];
  zoom?: number;
}

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function OpportunityMap({
  properties,
  onPropertyClick,
  center = [32.3513, -95.3011], // Tyler, TX
  zoom = 11,
}: OpportunityMapProps) {
  const [filter, setFilter] = useState<Decision | "all">("all");

  const filterOptions: {
    value: Decision | "all";
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "All Deals", color: "#94a3b8" },
    { value: "PASS", label: "PASS", color: "#10b981" },
    { value: "CAUTION", label: "CAUTION", color: "#f59e0b" },
    { value: "HARD_FAIL", label: "HARD_FAIL", color: "#ef4444" },
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => filter === "all" || p.decision === filter);
  }, [properties, filter]);

  const getMarkerIcon = (decision: string) => {
    const color = getDecisionColor(decision as any);
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-950 rounded-sm border border-dark-800 overflow-hidden">
      <div className="p-4 bg-dark-900 border-b border-dark-800 flex justify-between items-center">
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
          Regional Opportunity Map
        </h2>
        <div className="flex gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-tighter transition-all ${
                filter === opt.value
                  ? "bg-white text-dark-950"
                  : "bg-dark-800 text-dark-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ChangeView center={center} zoom={zoom} />
          {filteredProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={getMarkerIcon(property.decision)}
              eventHandlers={{ click: () => onPropertyClick?.(property) }}
            >
              <Popup className="custom-popup">
                <div className="p-2 font-sans">
                  <p className="font-black text-dark-950 uppercase text-[10px] mb-1">
                    {property.address}
                  </p>
                  <p className="text-[10px] font-bold text-dark-600 mb-2">
                    ${property.listPrice.toLocaleString()} • $
                    {property.mao50k.toLocaleString()} MAO
                  </p>
                  <button
                    onClick={() => onPropertyClick?.(property)}
                    className="w-full py-1 bg-dark-950 text-white text-[8px] font-black uppercase tracking-widest rounded-sm"
                  >
                    View Analysis
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
