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
    <div className="w-full h-full flex flex-col bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Institutional Geographic Deal Distribution
        </h2>
        <div className="flex gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={clsx(
                "px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all border",
                filter === opt.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              )}
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
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ChangeView center={center} zoom={zoom} />
          {filteredProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={getMarkerIcon(property.decision)}
            >
              <Popup className="institutional-popup">
                <div className="p-1 font-sans min-w-[180px]">
                  <p className="font-bold text-slate-900 uppercase text-[11px] mb-1 tracking-tight">
                    {property.address}
                  </p>
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>List Price</span>
                      <span className="font-mono font-bold text-slate-900">${property.listPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Target MAO</span>
                      <span className="font-mono font-bold text-info">${property.mao50k.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onPropertyClick?.(property)}
                    className="w-full py-1.5 bg-primary-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-sm hover:bg-primary-700 transition-colors"
                  >
                    View Audit Report
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
