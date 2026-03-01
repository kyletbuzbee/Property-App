"use client";

import { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import { PropertyWithCalculations } from "@/lib/calculations";

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
    name: "Kitchen",
    icon: "🍳",
    items: [
      { name: "Cabinet Refinish", unit: "linear ft", lowCost: 30, highCost: 60, avgCost: 45 },
      { name: "New Cabinets", unit: "linear ft", lowCost: 150, highCost: 400, avgCost: 275 },
      { name: "Countertop (Granite)", unit: "sq ft", lowCost: 50, highCost: 100, avgCost: 75 },
      { name: "Appliances", unit: "unit", lowCost: 500, highCost: 2000, avgCost: 1200 },
    ],
  },
  {
    name: "Bathroom",
    icon: "🚿",
    items: [
      { name: "Full Bath Remodel", unit: "unit", lowCost: 3000, highCost: 10000, avgCost: 6500 },
      { name: "Shower/Tub", unit: "unit", lowCost: 800, highCost: 3000, avgCost: 1900 },
      { name: "Vanity & Sink", unit: "unit", lowCost: 400, highCost: 1500, avgCost: 950 },
    ],
  },
  {
    name: "Exterior",
    icon: "🏡",
    items: [
      { name: "Roofing", unit: "sq ft", lowCost: 5, highCost: 15, avgCost: 10 },
      { name: "Paint (Ext)", unit: "sq ft", lowCost: 2, highCost: 5, avgCost: 3 },
      { name: "Siding", unit: "sq ft", lowCost: 4, highCost: 12, avgCost: 8 },
    ],
  },
];

interface SelectedItem {
  categoryIndex: number;
  itemIndex: number;
  quantity: number;
}

/**
 * High-Density Input Field Component
 */
const CompactInput = ({ label, value, onChange, prefix }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-dark-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-dark-400 font-bold">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={clsx(
          "w-full bg-dark-800 border border-dark-700 rounded-sm px-2 py-1.5 text-[11px] font-black text-white focus:outline-none focus:border-primary-500 transition-colors",
          prefix && "pl-4"
        )}
      />
    </div>
  </div>
);

export default function RehabEstimator({
  property,
  onClose,
}: RehabEstimatorProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  
  // Manual Overrides State
  const [sqft, setSqft] = useState(property?.sqft || 0);
  const [listPrice, setListPrice] = useState(property?.listPrice || 0);
  const [arv, setArv] = useState(property?.afterRepairValue || 0);
  const [beds, setBeds] = useState(property?.bedrooms || 0);
  const [baths, setBaths] = useState(property?.bathrooms || 0);
  const [yearBuilt, setYearBuilt] = useState(property?.yearBuilt || 0);

  useEffect(() => {
    if (property) {
      setSqft(property.sqft);
      setListPrice(property.listPrice);
      setArv(property.afterRepairValue);
      setBeds(property.bedrooms);
      setBaths(property.bathrooms);
      setYearBuilt(property.yearBuilt || 0);
    }
  }, [property]);

  const addItem = (categoryIndex: number, itemIndex: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find(i => i.categoryIndex === categoryIndex && i.itemIndex === itemIndex);
      if (existing) return prev.map(i => i.categoryIndex === categoryIndex && i.itemIndex === itemIndex ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { categoryIndex, itemIndex, quantity: 1 }];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    else setSelectedItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const costEstimate = useMemo(() => {
    let avgTotal = 0;
    const itemDetails = selectedItems.map((selection) => {
      const category = REHAB_CATEGORIES[selection.categoryIndex];
      const item = category.items[selection.itemIndex];
      const qualityMultiplier = { low: 0.7, medium: 1.0, high: 1.3 }[quality];
      const itemAvg = item.avgCost * selection.quantity * qualityMultiplier;
      avgTotal += itemAvg;
      return { category: category.name, item: item.name, quantity: selection.quantity, unit: item.unit, avg: itemAvg };
    });
    return { avgTotal, itemDetails };
  }, [selectedItems, quality]);

  // Derived Financials
  const holdingCosts = arv * 0.05; // Simplified for UI
  const closingCosts = arv * 0.08;
  const totalCosts = listPrice + costEstimate.avgTotal + holdingCosts + closingCosts;
  const projectedProfit = arv - totalCosts;

  if (!property) return null;

  return (
    <div className="w-full h-full flex flex-col bg-dark-950 rounded-sm border border-dark-800 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-dark-900 border-b border-dark-800">
        <div>
          <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-1">Rehab Underwriting</h2>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest truncate max-w-[200px]">{property.address}</p>
        </div>
        {onClose && <button onClick={onClose} className="text-dark-500 hover:text-white font-black text-xs transition-colors">CLOSE_X</button>}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* HIGH DENSITY INPUT GRID */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-primary-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Manual Property Overrides</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            <CompactInput label="List Price" value={listPrice} onChange={setListPrice} prefix="$" />
            <CompactInput label="Target ARV" value={arv} onChange={setArv} prefix="$" />
            <CompactInput label="Square Footage" value={sqft} onChange={setSqft} />
            <CompactInput label="Year Built" value={yearBuilt} onChange={setYearBuilt} />
            
            <CompactInput label="Bedrooms" value={beds} onChange={setBeds} />
            <CompactInput label="Bathrooms" value={baths} onChange={setBaths} />
            <CompactInput label="Assessed Tax" value={0} onChange={() => {}} prefix="$" />
            <CompactInput label="Insurance" value={0} onChange={() => {}} prefix="$" />
          </div>
        </section>

        {/* REHAB CATALOG */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-primary-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Quick Add: Rehab Catalog</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {REHAB_CATEGORIES.map((cat, ci) => (
              <div key={cat.name} className="bg-dark-900/50 border border-dark-800 p-2 rounded-sm">
                <p className="text-[9px] font-black text-dark-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <span>{cat.icon}</span> {cat.name}
                </p>
                <div className="space-y-1">
                  {cat.items.map((item, ii) => (
                    <button
                      key={item.name}
                      onClick={() => addItem(ci, ii)}
                      className="w-full text-left text-[9px] font-bold text-dark-300 hover:text-white hover:bg-primary-600/20 px-1.5 py-1 rounded-sm border border-transparent hover:border-primary-500/30 transition-all truncate"
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SELECTED ITEMS */}
        {selectedItems.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">Active Line Items</h3>
            <div className="bg-dark-900 border border-dark-800 divide-y divide-dark-800">
              {costEstimate.itemDetails.map((detail, index) => (
                <div key={index} className="p-2 flex items-center justify-between group">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white uppercase truncate">{detail.item}</p>
                    <p className="text-[8px] font-bold text-dark-500 uppercase">{detail.category} • {detail.quantity} {detail.unit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-mono font-black text-primary-400">${Math.round(detail.avg).toLocaleString()}</p>
                    <div className="flex border border-dark-700 rounded-sm overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => updateQuantity(index, selectedItems[index].quantity - 1)} className="px-1.5 py-0.5 bg-dark-800 text-white text-[10px] hover:bg-dark-700">-</button>
                      <button onClick={() => updateQuantity(index, selectedItems[index].quantity + 1)} className="px-1.5 py-0.5 bg-dark-800 text-white text-[10px] border-l border-dark-700 hover:bg-dark-700">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER SUMMARY */}
      <div className="p-4 bg-white border-t border-dark-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-bold text-dark-400 uppercase tracking-widest">Rehab Budget</span>
              <span className="text-[11px] font-black text-dark-900 font-mono">${Math.round(costEstimate.avgTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-bold text-dark-400 uppercase tracking-widest">Total Sunk</span>
              <span className="text-[11px] font-black text-red-600 font-mono">${Math.round(totalCosts).toLocaleString()}</span>
            </div>
          </div>
          <div className="border-l border-slate-100 pl-4 bg-slate-50/50 -m-4 ml-0 p-4 flex flex-col justify-center">
            <p className="text-[9px] font-black text-dark-400 uppercase tracking-[0.2em] mb-1 text-center">Net Flip Profit</p>
            <p className={clsx(
              "text-2xl font-black text-center tabular-nums leading-none tracking-tighter",
              projectedProfit > 25000 ? "text-success" : projectedProfit > 0 ? "text-amber-600" : "text-red-600"
            )}>
              ${Math.round(projectedProfit).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
