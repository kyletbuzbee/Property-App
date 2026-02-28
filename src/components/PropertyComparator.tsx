"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import { PropertyWithCalculations } from "@/lib/calculations";
import { getDecisionColor } from "@/data/properties";

interface PropertyComparatorProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  onClose?: () => void;
}

interface ComparisonMetric {
  key: keyof PropertyWithCalculations;
  label: string;
  format: "currency" | "number" | "text";
  higherIsBetter?: boolean;
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    key: "listPrice",
    label: "List Price",
    format: "currency",
    higherIsBetter: false,
  },
  {
    key: "afterRepairValue",
    label: "ARV",
    format: "currency",
    higherIsBetter: true,
  },
  {
    key: "mao25k",
    label: "MAO (25k Profit)",
    format: "currency",
    higherIsBetter: true,
  },
  {
    key: "mao50k",
    label: "MAO (50k Profit)",
    format: "currency",
    higherIsBetter: true,
  },
  {
    key: "renovationBudget",
    label: "Rehab Est.",
    format: "currency",
    higherIsBetter: false,
  },
  { key: "rehabTier", label: "Rehab Tier", format: "text" },
  { key: "sqft", label: "Square Feet", format: "number", higherIsBetter: true },
  {
    key: "pricePerSqft",
    label: "Price/SqFt",
    format: "currency",
    higherIsBetter: false,
  },
  {
    key: "equityGap",
    label: "Equity Gap",
    format: "currency",
    higherIsBetter: true,
  },
];

export default function PropertyComparator({
  properties,
  onPropertyClick,
  onClose,
}: PropertyComparatorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else if (newSet.size < 4) newSet.add(id);
      return newSet;
    });
  };

  const selectedProperties = useMemo(() => {
    return properties.filter((p) => selectedIds.has(p.id));
  }, [properties, selectedIds]);

  const formatValue = (metric: ComparisonMetric, value: any): string => {
    if (value === null || value === undefined) return "-";
    if (metric.format === "currency")
      return `$${Number(value).toLocaleString()}`;
    if (metric.format === "number") return Number(value).toLocaleString();
    return String(value);
  };

  const isBestValue = (
    metric: ComparisonMetric,
    value: any,
    propertyId: string,
  ): boolean => {
    if (selectedProperties.length < 2 || metric.format === "text") return false;
    const values = selectedProperties.map((p) => Number(p[metric.key]) || 0);
    const numericValue = Number(value) || 0;
    const bestValue = metric.higherIsBetter
      ? Math.max(...values)
      : Math.min(...values);
    return numericValue === bestValue && numericValue !== 0;
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-950 border border-dark-800 rounded-sm font-sans">
      <div className="p-6 border-b border-dark-800 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-1">
            Deal Comparison Matrix
          </h2>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">
            Select up to 4 assets for institutional side-by-side audit
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

      <div className="p-4 bg-dark-900/50 border-b border-dark-800 flex flex-wrap gap-2">
        {properties.slice(0, 12).map((p) => (
          <button
            key={p.id}
            onClick={() => toggleSelection(p.id)}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-tighter transition-all border ${
              selectedIds.has(p.id)
                ? "bg-white text-dark-950 border-white"
                : "bg-dark-800 text-dark-400 border-dark-700 hover:border-dark-500"
            }`}
          >
            {p.address.split(",")[0]}
          </button>
        ))}
      </div>

      {selectedProperties.length > 0 ? (
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-dark-900">
                <th className="p-4 text-left text-[9px] font-black text-dark-500 uppercase tracking-widest border-b border-dark-800">
                  Parameters
                </th>
                {selectedProperties.map((p) => (
                  <th
                    key={p.id}
                    className="p-4 text-left border-b border-dark-800 min-w-[200px]"
                  >
                    <p className="text-xs font-black text-white uppercase truncate">
                      {p.address.split(",")[0]}
                    </p>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase"
                      style={{
                        backgroundColor: getDecisionColor(p.decision as any),
                        color: "#000",
                      }}
                    >
                      {p.decision}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {COMPARISON_METRICS.map((metric) => (
                <tr
                  key={metric.key}
                  className="hover:bg-dark-900/30 transition-colors"
                >
                  <td className="p-4 text-[10px] font-bold text-dark-400 uppercase tracking-widest bg-dark-900/20">
                    {metric.label}
                  </td>
                  {selectedProperties.map((p) => {
                    const value = p[metric.key];
                    const isBest = isBestValue(metric, value, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`p-4 text-xs font-black ${isBest ? "text-emerald-400 bg-emerald-500/5" : "text-dark-100"}`}
                      >
                        {formatValue(metric, value)}
                        {isBest && (
                          <span className="ml-2 text-[8px] uppercase tracking-tighter">
                            ★ BEST
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-dark-600 uppercase text-[10px] font-black tracking-[0.2em]">
          Select assets to begin comparison
        </div>
      )}
    </div>
  );
}
