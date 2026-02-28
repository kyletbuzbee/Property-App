"use client";

import { useMemo } from "react";
import { PropertyWithCalculations } from "@/lib/calculations";

interface SoldCompsProps {
  property: PropertyWithCalculations | null;
  onClose?: () => void;
}

export default function SoldComps({ property, onClose }: SoldCompsProps) {
  if (!property) return null;

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 border border-dark-800 rounded-sm font-sans">
      <div className="p-6 border-b border-dark-800 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-1">
            Market Comparables
          </h2>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">
            Recent sold evidence for {property.city}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-dark-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 border border-dark-700 flex items-center justify-center rounded-full mb-4">
          <span className="text-xl">📊</span>
        </div>
        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">
          Knowledge Base Integration
        </h3>
        <p className="text-[10px] text-dark-500 font-bold uppercase leading-relaxed max-w-xs">
          Comparables are dynamically pulled from the Institutional Knowledge
          Bundle during the AI Inspection phase.
        </p>
        <div className="mt-8 p-4 bg-dark-950 border border-dark-800 rounded-sm w-full">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[9px] font-black text-dark-500 uppercase tracking-widest">
              Target ARV Basis
            </span>
            <span className="text-lg font-black text-white">
              ${property.afterRepairValue.toLocaleString()}
            </span>
          </div>
          <div className="h-1 w-full bg-dark-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 w-[75%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
