"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Decision, getDecisionColor } from "@/data/properties";
import { PropertyWithCalculations } from "@/lib/calculations";

interface ValueScatterPlotProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

export default function ValueScatterPlot({
  properties,
  onPropertyClick,
}: ValueScatterPlotProps) {
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

  const chartData = useMemo(() => {
    return properties
      .filter((p) => filter === "all" || p.decision === filter)
      .map((p) => ({
        id: p.id,
        address: p.address,
        x: p.listPrice,
        y: p.afterRepairValue,
        z: p.mao50k,
        decision: p.decision,
        color: getDecisionColor(p.decision as any),
        original: p,
      }));
  }, [properties, filter]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload.original;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-sm shadow-xl font-sans">
          <p className="text-[11px] font-bold text-slate-900 uppercase mb-2 tracking-tight">
            {data.address}
          </p>
          <div className="space-y-1.5 border-t border-slate-50 pt-2">
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">List Price</span>
              <span className="text-[10px] text-slate-900 font-mono font-bold">${data.listPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target ARV</span>
              <span className="text-[10px] text-slate-900 font-mono font-bold">${data.afterRepairValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">MAO 50k</span>
              <span className="text-[10px] text-info font-mono font-bold">${data.mao50k.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
            Institutional Market Positioning
          </h2>
          <p className="text-xl font-black text-slate-900 tracking-tight">
            List Price vs Target ARV Correlation
          </p>
        </div>
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

      <div className="flex-1 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="List Price"
              unit="$"
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(v) => `$${v / 1000}k`}
              label={{
                value: "LIST PRICE",
                position: "bottom",
                offset: 0,
                fill: "#94a3b8",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em"
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="ARV"
              unit="$"
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(v) => `$${v / 1000}k`}
              label={{
                value: "TARGET ARV",
                angle: -90,
                position: "left",
                fill: "#94a3b8",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em"
              }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} name="MAO" />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 500000, y: 500000 },
              ]}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <Scatter
              name="Properties"
              data={chartData}
              onClick={(data) => onPropertyClick?.(data.original)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={1}
                  stroke="rgba(255,255,255,0.8)"
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
