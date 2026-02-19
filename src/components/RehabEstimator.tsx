'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface RehabEstimatorProps {
  property: PropertyWithCalculations | null;
  onClose?: () => void;
}

// Rehab categories with typical cost ranges
interface RehabCategory {
  name: string;
  icon: string;
  items: RehabItemTemplate[];
}

interface RehabItemTemplate {
  name: string;
  unit: string;
  lowCost: number;
  highCost: number;
  avgCost: number;
}

const REHAB_CATEGORIES: RehabCategory[] = [
  {
    name: 'Kitchen',
    icon: '🍳',
    items: [
      { name: 'Cabinet Refinish', unit: 'linear ft', lowCost: 30, highCost: 60, avgCost: 45 },
      { name: 'New Cabinets', unit: 'linear ft', lowCost: 150, highCost: 400, avgCost: 275 },
      { name: 'Countertop (Laminate)', unit: 'sq ft', lowCost: 20, highCost: 40, avgCost: 30 },
      { name: 'Countertop (Granite)', unit: 'sq ft', lowCost: 50, highCost: 100, avgCost: 75 },
      { name: 'Appliances', unit: 'unit', lowCost: 500, highCost: 2000, avgCost: 1200 },
      { name: 'Sink & Faucet', unit: 'unit', lowCost: 200, highCost: 600, avgCost: 400 },
      { name: 'Flooring', unit: 'sq ft', lowCost: 3, highCost: 10, avgCost: 6 },
    ],
  },
  {
    name: 'Bathroom',
    icon: '🚿',
    items: [
      { name: 'Full Bath Remodel', unit: 'unit', lowCost: 3000, highCost: 10000, avgCost: 6500 },
      { name: 'Shower/Tub', unit: 'unit', lowCost: 800, highCost: 3000, avgCost: 1900 },
      { name: 'Vanity & Sink', unit: 'unit', lowCost: 400, highCost: 1500, avgCost: 950 },
      { name: 'Toilet', unit: 'unit', lowCost: 200, highCost: 500, avgCost: 350 },
      { name: 'Tile (Floor)', unit: 'sq ft', lowCost: 5, highCost: 15, avgCost: 10 },
      { name: 'Tile (Shower)', unit: 'sq ft', lowCost: 10, highCost: 25, avgCost: 17 },
    ],
  },
  {
    name: 'Flooring',
    icon: '🏠',
    items: [
      { name: 'Hardwood', unit: 'sq ft', lowCost: 6, highCost: 14, avgCost: 10 },
      { name: 'Laminate', unit: 'sq ft', lowCost: 3, highCost: 8, avgCost: 5 },
      { name: 'Carpet', unit: 'sq ft', lowCost: 2, highCost: 6, avgCost: 4 },
      { name: 'Tile', unit: 'sq ft', lowCost: 5, highCost: 15, avgCost: 10 },
      { name: 'Vinyl Plank', unit: 'sq ft', lowCost: 3, highCost: 8, avgCost: 5 },
    ],
  },
  {
    name: 'HVAC',
    icon: '❄️',
    items: [
      { name: 'AC Unit', unit: 'unit', lowCost: 2000, highCost: 5000, avgCost: 3500 },
      { name: 'Furnace', unit: 'unit', lowCost: 2000, highCost: 5000, avgCost: 3500 },
      { name: 'Ductwork', unit: 'linear ft', lowCost: 10, highCost: 25, avgCost: 17 },
      { name: 'Thermostat', unit: 'unit', lowCost: 100, highCost: 300, avgCost: 200 },
      { name: 'Vent Cleaning', unit: 'unit', lowCost: 200, highCost: 500, avgCost: 350 },
    ],
  },
  {
    name: 'Electrical',
    icon: '⚡',
    items: [
      { name: 'Panel Upgrade', unit: 'unit', lowCost: 1500, highCost: 4000, avgCost: 2750 },
      { name: 'Outlets/Switches', unit: 'unit', lowCost: 100, highCost: 200, avgCost: 150 },
      { name: 'Lighting', unit: 'unit', lowCost: 50, highCost: 200, avgCost: 125 },
      { name: 'Ceiling Fan', unit: 'unit', lowCost: 150, highCost: 400, avgCost: 275 },
      { name: 'GFCI Installation', unit: 'unit', lowCost: 100, highCost: 200, avgCost: 150 },
    ],
  },
  {
    name: 'Plumbing',
    icon: '🔧',
    items: [
      { name: 'Water Heater', unit: 'unit', lowCost: 800, highCost: 2000, avgCost: 1400 },
      { name: 'Repipe', unit: 'linear ft', lowCost: 3, highCost: 8, avgCost: 5 },
      { name: 'Fixtures', unit: 'unit', lowCost: 100, highCost: 400, avgCost: 250 },
      { name: 'Sump Pump', unit: 'unit', lowCost: 500, highCost: 1500, avgCost: 1000 },
    ],
  },
  {
    name: 'Exterior',
    icon: '🏡',
    items: [
      { name: 'Siding', unit: 'sq ft', lowCost: 4, highCost: 12, avgCost: 8 },
      { name: 'Roofing', unit: 'sq ft', lowCost: 5, highCost: 15, avgCost: 10 },
      { name: 'Paint (Exterior)', unit: 'sq ft', lowCost: 2, highCost: 5, avgCost: 3 },
      { name: 'Landscaping', unit: 'lot', lowCost: 1000, highCost: 5000, avgCost: 3000 },
      { name: 'Driveway', unit: 'sq ft', lowCost: 3, highCost: 8, avgCost: 5 },
      { name: 'Fencing', unit: 'linear ft', lowCost: 20, highCost: 50, avgCost: 35 },
    ],
  },
  {
    name: 'Windows & Doors',
    icon: '🪟',
    items: [
      { name: 'Window Replacement', unit: 'unit', lowCost: 300, highCost: 800, avgCost: 550 },
      { name: 'Entry Door', unit: 'unit', lowCost: 300, highCost: 1000, avgCost: 650 },
      { name: 'Interior Doors', unit: 'unit', lowCost: 150, highCost: 400, avgCost: 275 },
      { name: 'Garage Door', unit: 'unit', lowCost: 500, highCost: 1500, avgCost: 1000 },
    ],
  },
  {
    name: 'Finishing',
    icon: '🎨',
    items: [
      { name: 'Interior Paint', unit: 'sq ft', lowCost: 1, highCost: 3, avgCost: 2 },
      { name: 'Drywall Repair', unit: 'sq ft', lowCost: 2, highCost: 5, avgCost: 3 },
      { name: 'Trim & Molding', unit: 'linear ft', lowCost: 3, highCost: 10, avgCost: 6 },
      { name: 'Closet Systems', unit: 'unit', lowCost: 500, highCost: 2000, avgCost: 1250 },
    ],
  },
];

interface SelectedItem {
  categoryIndex: number;
  itemIndex: number;
  quantity: number;
}

export default function RehabEstimator({ property, onClose }: RehabEstimatorProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');

  // Add item to estimate
  const addItem = (categoryIndex: number, itemIndex: number) => {
    setSelectedItems(prev => {
      const existing = prev.find(
        i => i.categoryIndex === categoryIndex && i.itemIndex === itemIndex
      );
      if (existing) {
        return prev.map(i => 
          i.categoryIndex === categoryIndex && i.itemIndex === itemIndex
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { categoryIndex, itemIndex, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedItems(prev => prev.map((item, i) => 
        i === index ? { ...item, quantity } : item
      ));
    }
  };

  // Remove item
  const removeItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate totals based on quality
  const costEstimate = useMemo(() => {
    let lowTotal = 0;
    let highTotal = 0;
    let avgTotal = 0;

    const itemDetails = selectedItems.map(selection => {
      const category = REHAB_CATEGORIES[selection.categoryIndex];
      const item = category.items[selection.itemIndex];
      
      // Apply quality multiplier
      const qualityMultiplier = {
        low: 0.7,
        medium: 1.0,
        high: 1.3,
      }[quality];

      const itemLow = item.lowCost * selection.quantity * qualityMultiplier;
      const itemHigh = item.highCost * selection.quantity * qualityMultiplier;
      const itemAvg = item.avgCost * selection.quantity * qualityMultiplier;

      lowTotal += itemLow;
      highTotal += itemHigh;
      avgTotal += itemAvg;

      return {
        category: category.name,
        item: item.name,
        quantity: selection.quantity,
        unit: item.unit,
        low: itemLow,
        high: itemHigh,
        avg: itemAvg,
      };
    });

    return {
      lowTotal,
      highTotal,
      avgTotal,
      itemDetails,
    };
  }, [selectedItems, quality]);

  // Get the property's existing renovation budget
  const existingBudget = property?.renovationBudget || 0;

  if (!property) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900 rounded-lg">
        <div className="text-center text-dark-400">
          <p className="text-lg mb-2">No property selected</p>
          <p className="text-sm">Select a property to estimate rehab costs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">Rehab Cost Estimator</h2>
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
        {/* Property Info */}
        <div className="bg-dark-800 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-dark-500">Property Size</p>
              <p className="text-white font-medium">{property.sqft.toLocaleString()} sq ft</p>
            </div>
            <div>
              <p className="text-dark-500">Bed/Bath</p>
              <p className="text-white font-medium">{property.bedrooms} bed / {property.bathrooms} bath</p>
            </div>
            <div>
              <p className="text-dark-500">Existing Budget</p>
              <p className="text-amber-400 font-medium">${existingBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quality Selection */}
        <div className="mb-4">
          <label className="text-sm text-dark-400 block mb-2">Quality Level</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={clsx(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                  quality === q
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">
            Select Items
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {REHAB_CATEGORIES.map((category, categoryIndex) => (
              <div key={category.name} className="bg-dark-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-white text-sm">{category.name}</span>
                </div>
                <div className="space-y-1">
                  {category.items.slice(0, 3).map((item, itemIndex) => (
                    <button
                      key={item.name}
                      onClick={() => addItem(categoryIndex, itemIndex)}
                      className="w-full text-left text-xs text-dark-400 hover:text-white hover:bg-dark-700 px-2 py-1 rounded transition-colors"
                    >
                      {item.name} (${item.avgCost}/{item.unit})
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">
              Selected Items ({selectedItems.length})
            </h3>
            <div className="space-y-2">
              {costEstimate.itemDetails.map((detail, index) => (
                <div key={index} className="bg-dark-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{detail.item}</p>
                    <p className="text-xs text-dark-500">{detail.category} • {detail.quantity} {detail.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white font-medium">${Math.round(detail.avg).toLocaleString()}</p>
                      <p className="text-xs text-dark-500">
                        ${Math.round(detail.low)}-${Math.round(detail.high)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(index, selectedItems[index].quantity - 1)}
                        className="w-6 h-6 bg-dark-700 rounded text-white hover:bg-dark-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-white text-sm">
                        {selectedItems[index].quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, selectedItems[index].quantity + 1)}
                        className="w-6 h-6 bg-dark-700 rounded text-white hover:bg-dark-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cost Summary */}
      <div className="p-4 border-t border-dark-700 bg-dark-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-400">Low Estimate</span>
          <span className="text-white font-medium">${Math.round(costEstimate.lowTotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-400">Average</span>
          <span className="text-white font-bold text-lg">${Math.round(costEstimate.avgTotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-dark-400">High Estimate</span>
          <span className="text-white font-medium">${Math.round(costEstimate.highTotal).toLocaleString()}</span>
        </div>
        
        {/* Comparison to existing budget */}
        {existingBudget > 0 && (
          <div className={clsx(
            'text-sm text-center py-2 rounded',
            costEstimate.avgTotal <= existingBudget 
              ? 'bg-emerald-900/30 text-emerald-400' 
              : 'bg-red-900/30 text-red-400'
          )}>
            {costEstimate.avgTotal <= existingBudget 
              ? `Under budget by $${(existingBudget - costEstimate.avgTotal).toLocaleString()}`
              : `Over budget by $${(costEstimate.avgTotal - existingBudget).toLocaleString()}`
            }
          </div>
        )}
      </div>
    </div>
  );
}
