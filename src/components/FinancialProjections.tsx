"use client";

import { PropertyWithCalculations } from "@/lib/calculations";

interface FinancialProjectionsProps {
  property: PropertyWithCalculations | null;
  onClose?: () => void;
}

export default function FinancialProjections({
  property,
  onClose,
}: FinancialProjectionsProps) {
  if (!property) return null;

  const totalBasis =
    property.listPrice +
    property.renovationBudget +
    property.closingCosts +
    property.holdingCosts;
  const netProfit = property.afterRepairValue - totalBasis;
  const roi =
    (netProfit / (property.listPrice * 0.2 + property.renovationBudget)) * 100; // Simplified ROI on cash

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 border border-dark-800 rounded-sm font-sans font-sans">
      <div className="p-6 border-b border-dark-800 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-1">
            Flip Profitability Projections
          </h2>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">
            Capital stack and exit math
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

      <div className="flex-1 overflow-auto p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-l-2 border-primary-500 pl-4">
              Capital Outlay
            </p>
            <div className="space-y-4 pl-4">
              <div className="flex justify-between text-xs font-bold text-dark-400 uppercase tracking-tighter">
                <span>Purchase Price</span>
                <span className="text-white">
                  ${property.listPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-dark-400 uppercase tracking-tighter">
                <span>Rehab Estimate</span>
                <span className="text-white">
                  ${property.renovationBudget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-dark-400 uppercase tracking-tighter">
                <span>Holding Costs</span>
                <span className="text-white">
                  ${property.holdingCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-dark-400 uppercase tracking-tighter border-b border-dark-800 pb-4">
                <span>Closing Costs</span>
                <span className="text-white">
                  ${property.closingCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white uppercase italic">
                <span>Total Basis</span>
                <span>${totalBasis.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-l-2 border-emerald-500 pl-4">
              Exit Math
            </p>
            <div className="space-y-4 pl-4">
              <div className="flex justify-between text-xs font-bold text-dark-400 uppercase tracking-tighter">
                <span>Target ARV</span>
                <span className="text-white">
                  ${property.afterRepairValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-dark-400 uppercase tracking-tighter border-b border-dark-800 pb-4">
                <span>Total Basis</span>
                <span className="text-white">
                  -${totalBasis.toLocaleString()}
                </span>
              </div>
              <div className="bg-emerald-500/10 p-4 border border-emerald-500/20">
                <div className="flex justify-between text-lg font-black text-emerald-500 uppercase italic">
                  <span>Net Profit</span>
                  <span>${netProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-950 p-8 border border-dark-800 rounded-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em] mb-2">
                Institutional Yield (Est. ROI)
              </p>
              <p className="text-4xl font-black text-white italic tracking-tighter">
                {roi.toFixed(1)}%
              </p>
            </div>
            <div className="text-right text-[10px] font-bold text-dark-600 uppercase leading-relaxed">
              Based on 20% Down Payment + Full Rehab Capital
              <br />
              Target timeline: 4-5 months
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
