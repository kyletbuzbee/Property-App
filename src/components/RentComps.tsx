'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface RentCompsProps {
  property: PropertyWithCalculations | null;
  onClose?: () => void;
}

// Sample rent comparable data (in real app, would come from API like RentCast/Zillow)
interface RentComp {
  id: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  distance: number;
  source: string;
  dateAdded: Date;
}

// Generate sample rent comps for demo
const generateSampleComps = (property: PropertyWithCalculations): RentComp[] => {
  const baseRent = property.estimatedRent || 1500;
  return [
    {
      id: '1',
      address: `${Math.floor(Math.random() * 9000) + 1000} Oak Street`,
      city: property.city,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      rent: Math.round(baseRent * (0.9 + Math.random() * 0.2)),
      distance: Math.random() * 0.5,
      source: 'Zillow',
      dateAdded: new Date(),
    },
    {
      id: '2',
      address: `${Math.floor(Math.random() * 9000) + 1000} Maple Ave`,
      city: property.city,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      rent: Math.round(baseRent * (0.9 + Math.random() * 0.2)),
      distance: Math.random() * 0.5,
      source: 'RentCast',
      dateAdded: new Date(),
    },
    {
      id: '3',
      address: `${Math.floor(Math.random() * 9000) + 1000} Pine Road`,
      city: property.city,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: Math.round(property.sqft * 0.9),
      rent: Math.round(baseRent * (0.85 + Math.random() * 0.2)),
      distance: Math.random() * 0.5,
      source: 'Manual',
      dateAdded: new Date(),
    },
    {
      id: '4',
      address: `${Math.floor(Math.random() * 9000) + 1000} Cedar Lane`,
      city: property.city,
      bedrooms: property.bedrooms + 1,
      bathrooms: property.bathrooms,
      sqft: Math.round(property.sqft * 1.1),
      rent: Math.round(baseRent * (1.0 + Math.random() * 0.25)),
      distance: Math.random() * 0.5,
      source: 'Zillow',
      dateAdded: new Date(),
    },
    {
      id: '5',
      address: `${Math.floor(Math.random() * 9000) + 1000} Elm Court`,
      city: property.city,
      bedrooms: property.bedrooms - 1,
      bathrooms: property.bathrooms,
      sqft: Math.round(property.sqft * 0.85),
      rent: Math.round(baseRent * (0.8 + Math.random() * 0.2)),
      distance: Math.random() * 0.5,
      source: 'RentCast',
      dateAdded: new Date(),
    },
  ];
};

export default function RentComps({ property, onClose }: RentCompsProps) {
  const [selectedComp, setSelectedComp] = useState<RentComp | null>(null);

  // Generate sample comps for selected property
  const comps = useMemo(() => {
    if (!property) return [];
    return generateSampleComps(property);
  }, [property]);

  // Calculate rent analysis
  const rentAnalysis = useMemo(() => {
    if (comps.length === 0) return null;

    const rents = comps.map(c => c.rent);
    const avgRent = rents.reduce((a, b) => a + b, 0) / rents.length;
    const minRent = Math.min(...rents);
    const maxRent = Math.max(...rents);
    const medianRent = rents.sort((a, b) => a - b)[Math.floor(rents.length / 2)];

    return {
      avgRent: Math.round(avgRent),
      minRent,
      maxRent,
      medianRent,
      propertyRent: property?.estimatedRent || 0,
      variance: avgRent - (property?.estimatedRent || 0),
      variancePercent: ((avgRent - (property?.estimatedRent || 0)) / avgRent) * 100,
    };
  }, [comps, property]);

  if (!property) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900 rounded-lg">
        <div className="text-center text-dark-400">
          <p className="text-lg mb-2">No property selected</p>
          <p className="text-sm">Select a property to view rent comparables</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">Rent Comparables</h2>
          <p className="text-sm text-dark-400">{property.address}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Rent Analysis Summary */}
        {rentAnalysis && (
          <div className="bg-dark-800 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
              Rent Analysis
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-dark-500">Your Estimate</p>
                <p className="text-xl font-bold text-white">${rentAnalysis.propertyRent.toLocaleString()}/mo</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Market Average</p>
                <p className="text-xl font-bold text-primary-400">${rentAnalysis.avgRent.toLocaleString()}/mo</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-400">${rentAnalysis.minRent.toLocaleString()}</span>
                  <span className="text-dark-400">Range</span>
                  <span className="text-dark-400">${rentAnalysis.maxRent.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="relative h-full">
                    <div 
                      className="absolute h-full bg-primary-500"
                      style={{ 
                        left: `${((rentAnalysis.propertyRent - rentAnalysis.minRent) / (rentAnalysis.maxRent - rentAnalysis.minRent)) * 100}%`,
                        width: '4px',
                        transform: 'translateX(-50%)'
                      }}
                    />
                    <div 
                      className="absolute h-full bg-dark-600 rounded-full"
                      style={{ left: 0, right: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={clsx(
              'mt-3 text-sm text-center py-2 rounded',
              rentAnalysis.variance >= 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
            )}>
              {rentAnalysis.variance >= 0 
                ? `Your estimate is $${Math.abs(rentAnalysis.variance).toLocaleString()} below market (${Math.abs(rentAnalysis.variancePercent).toFixed(1)}%)`
                : `Your estimate is $${Math.abs(rentAnalysis.variance).toLocaleString()} above market (${Math.abs(rentAnalysis.variancePercent).toFixed(1)}%)`
              }
            </div>
          </div>
        )}

        {/* Comparable Properties */}
        <div>
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Comparable Rentals ({comps.length})
          </h3>
          
          <div className="space-y-2">
            {comps.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setSelectedComp(comp)}
                className={clsx(
                  'bg-dark-800 rounded-lg p-4 cursor-pointer transition-colors',
                  selectedComp?.id === comp.id ? 'ring-2 ring-primary-500' : 'hover:bg-dark-700'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{comp.address}</p>
                    <p className="text-sm text-dark-400">{comp.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-400">${comp.rent.toLocaleString()}/mo</p>
                    <p className="text-xs text-dark-500">{comp.distance.toFixed(1)} mi away</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-2 text-sm text-dark-400">
                  <span>{comp.bedrooms} bed</span>
                  <span>{comp.bathrooms} bath</span>
                  <span>{comp.sqft.toLocaleString()} sqft</span>
                  <span className="ml-auto bg-dark-700 px-2 py-0.5 rounded text-xs">
                    {comp.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Comp Details */}
      {selectedComp && (
        <div className="p-4 border-t border-dark-700 bg-dark-800">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white">{selectedComp.address}</h3>
              <p className="text-sm text-dark-400">{selectedComp.city}</p>
            </div>
            <button
              onClick={() => setSelectedComp(null)}
              className="text-dark-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <p className="text-dark-500">Monthly Rent</p>
              <p className="text-white font-medium">${selectedComp.rent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-dark-500">Price/SqFt</p>
              <p className="text-white font-medium">${(selectedComp.rent / selectedComp.sqft).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-dark-500">Distance</p>
              <p className="text-white font-medium">{selectedComp.distance.toFixed(2)} mi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
