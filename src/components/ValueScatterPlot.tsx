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
        <div className="bg-dark-900 border border-dark-700 p-4 rounded-sm shadow-2xl font-sans">
          <p className="text-[10px] font-black text-white uppercase mb-2 tracking-widest">
            {data.address}
          </p>
          <div className="space-y-1">
            <p className="text-[10px] text-dark-400 uppercase font-bold">
              List:{" "}
              <span className="text-white">
                ${data.listPrice.toLocaleString()}
              </span>
            </p>
            <p className="text-[10px] text-dark-400 uppercase font-bold">
              ARV:{" "}
              <span className="text-white">
                ${data.afterRepairValue.toLocaleString()}
              </span>
            </p>
            <p className="text-[10px] text-dark-400 uppercase font-bold">
              MAO 50k:{" "}
              <span className="text-emerald-400">
                ${data.mao50k.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-950 p-6 rounded-sm border border-dark-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-1">
            Market Position Analysis
          </h2>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">
            List Price vs Target ARV
          </p>
        </div>
        <div className="flex gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter transition-all ${
                filter === opt.value
                  ? "bg-white text-dark-950"
                  : "bg-dark-800 text-dark-400 hover:text-white"
              }`}
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
              stroke="#475569"
              fontSize={10}
              tickFormatter={(v) => `$${v / 1000}k`}
              label={{
                value: "LIST PRICE",
                position: "bottom",
                offset: 0,
                fill: "#475569",
                fontSize: 9,
                fontWeight: 900,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="ARV"
              unit="$"
              stroke="#475569"
              fontSize={10}
              tickFormatter={(v) => `$${v / 1000}k`}
              label={{
                value: "TARGET ARV",
                angle: -90,
                position: "left",
                fill: "#475569",
                fontSize: 9,
                fontWeight: 900,
              }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} name="MAO" />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 500000, y: 500000 },
              ]}
              stroke="#1e293b"
              strokeDasharray="3 3"
            />
            <Scatter
              name="Properties"
              data={chartData}
              onClick={(data) => onPropertyClick?.(data.original)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={2}
                  stroke={`${entry.color}40`}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
