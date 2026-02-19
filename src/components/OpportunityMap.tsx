'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { getDecisionColor, Decision } from '@/data/properties';
import { PropertyWithCalculations } from '@/lib/calculations';

// Fix for default marker icons in Next.js
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Custom cluster icon creator
const createClusterIcon = (cluster: unknown) => {
  const clusterObj = cluster as { getChildCount: () => number; getAllChildMarkers: () => Array<{ options: { title?: string } }> };
  const count = clusterObj.getChildCount();
  const markers = clusterObj.getAllChildMarkers();
  
  // Calculate dominant decision color for cluster
  const decisionCounts: Record<string, number> = {};
  markers.forEach((marker) => {
    const decision = marker.options.title || 'unknown';
    decisionCounts[decision] = (decisionCounts[decision] || 0) + 1;
  });
  
  let dominantColor = '#64748b';
  let maxCount = 0;
  Object.entries(decisionCounts).forEach(([decision, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      dominantColor = getDecisionColor(decision as Decision);
    }
  });
  
  // Size based on count
  let size = 40;
  if (count >= 10) size = 50;
  if (count >= 20) size = 60;
  
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${dominantColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size >= 50 ? '14px' : '12px'};
      ">
        ${count}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to fit bounds to markers
function FitBounds({ properties }: { properties: PropertyWithCalculations[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);
  
  return null;
}

interface OpportunityMapProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

export default function OpportunityMap({ properties, onPropertyClick }: OpportunityMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | 'all'>('all');
  const [mapKey, setMapKey] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    // Clean up any existing map containers with the same ID
    if (mapContainerRef.current) {
      const container = mapContainerRef.current.querySelector('.leaflet-container');
      if (container && (container as any)._leaflet_id) {
        (container as any)._leaflet_id = undefined;
      }
    }
    
    // Use timestamp as unique key
    setMapKey(Date.now());
    setIsMounted(true);
    
    return () => {
      // Cleanup on unmount
      isInitialized.current = false;
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-800 rounded-lg">
        <div className="animate-pulse text-dark-400">Loading map...</div>
      </div>
    );
  }

  const filteredProperties = selectedDecision === 'all' 
    ? properties 
    : properties.filter(p => p.decision === selectedDecision);

  const defaultCenter: [number, number] = [32.5, -94.8];
  const defaultZoom = 9;

  const decisionFilters: { value: Decision | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: '#64748b' },
    { value: 'Pass Platinum', label: 'Platinum', color: '#10b981' },
    { value: 'Pass Gold', label: 'Gold', color: '#f59e0b' },
    { value: 'Pass Silver', label: 'Silver', color: '#f97316' },
    { value: 'Hard Fail', label: 'Hard Fail', color: '#ef4444' },
    { value: 'Caution', label: 'Caution', color: '#8b5cf6' },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Filter Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-dark-800/95 backdrop-blur-sm rounded-lg p-3 border border-dark-600">
        <div className="text-xs font-semibold text-dark-300 mb-2">Filter by Decision</div>
        <div className="flex flex-wrap gap-2">
          {decisionFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedDecision(filter.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDecision === filter.value
                  ? 'ring-2 ring-offset-2 ring-offset-dark-800'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: `${filter.color}20`,
                color: filter.color,
                '--tw-ring-color': filter.color,
              } as React.CSSProperties}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-dark-800/95 backdrop-blur-sm rounded-lg p-3 border border-dark-600">
        <div className="text-xs font-semibold text-dark-300 mb-2">Decision Legend</div>
        <div className="space-y-1.5">
          {decisionFilters.slice(1).map((filter) => (
            <div key={filter.value} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: filter.color }}
              />
              <span className="text-xs text-dark-300">{filter.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full">
        <MapContainer
          key={`map-${mapKey}`}
          center={defaultCenter}
          zoom={defaultZoom}
          className="w-full h-full rounded-lg"
          style={{ background: '#1e293b' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={filteredProperties} />
        
        <MarkerClusterGroup
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {filteredProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={createMarkerIcon(getDecisionColor(property.decision as Decision))}
              title={property.decision}
              eventHandlers={{
                click: () => onPropertyClick?.(property),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-semibold text-white mb-2">{property.address}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Price:</span>
                      <span className="text-emerald-400 font-medium">
                        ${property.listPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Decision:</span>
                      <span 
                        className="font-medium"
                        style={{ color: getDecisionColor(property.decision as Decision) }}
                      >
                        {property.decision}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Strategy:</span>
                      <span className="text-primary-400">{property.strategy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Equity Gap:</span>
                      <span className="text-amber-400">
                        ${property.equityGap.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">SqFt:</span>
                      <span>{property.sqft.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Beds/Baths:</span>
                      <span>{property.bedrooms} / {property.bathrooms}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-dark-600">
                    <div className="text-xs text-dark-400 line-clamp-2">
                      {property.rationale}
                    </div>
                  </div>
                  <a
                     href={property.url ?? '#'}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="mt-3 block text-center text-xs text-primary-400 hover:text-primary-300"
                   >
                     View on Zillow →
                   </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      </div>
    </div>
  );
}
