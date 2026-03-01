"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
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

  // Primary subject properties data
  const subjectData = useMemo(() => {
    return properties
      .filter((p) => filter === "all" || p.decision === filter)
      .map((p) => ({
        id: p.id,
        address: p.address,
        x: p.sqft,
        y: p.afterRepairValue,
        listPrice: p.listPrice,
        decision: p.decision,
        color: getDecisionColor(p.decision as any),
        original: p,
        type: 'subject'
      }));
  }, [properties, filter]);

  // Comps data (flattened from all properties)
  const compsData = useMemo(() => {
    const allComps: any[] = [];
    properties.forEach(p => {
      if (p.comps) {
        p.comps.forEach(comp => {
          // Avoid duplicates by street if multiple properties share comps
          if (!allComps.find(c => c.address === comp.street)) {
            allComps.push({
              address: comp.street,
              x: comp.sqft,
              y: comp.sold_price,
              type: 'comp',
              color: '#cbd5e1' // Gray for comps
            });
          }
        });
      }
    });
    return allComps;
  }, [properties]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isSubject = data.type === 'subject';
      
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-sm shadow-xl font-sans min-w-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {isSubject ? 'Subject Property' : 'Market Comp'}
            </p>
          </div>
          
          <p className="text-[11px] font-bold text-slate-900 uppercase mb-2 border-b border-slate-50 pb-1">
            {data.address}
          </p>
          
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between gap-4">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">SqFt</span>
              <span className="text-[10px] text-slate-900 font-mono font-bold">{data.x.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                {isSubject ? 'Target ARV' : 'Sold Price'}
              </span>
              <span className="text-[10px] text-slate-900 font-mono font-bold">${data.y.toLocaleString()}</span>
            </div>
            {isSubject && (
              <div className="flex justify-between gap-4 border-t border-slate-50 pt-1 mt-1">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">List Price</span>
                <span className="text-[10px] text-slate-900 font-mono font-bold">${data.listPrice.toLocaleString()}</span>
              </div>
            )}
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
            Comp Verification Engine
          </h2>
          <p className="text-xl font-black text-slate-900 tracking-tight">
            ARV Validation: SqFt vs Market Value
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
              name="SqFt"
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(v) => v.toLocaleString()}
              label={{
                value: "SQUARE FOOTAGE",
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
              name="Price"
              unit="$"
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(v) => `$${v / 1000}k`}
              label={{
                value: "PRICE / ARV",
                angle: -90,
                position: "left",
                fill: "#94a3b8",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em"
              }}
            />
            <ZAxis type="number" range={[100, 100]} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Market Comps - Gray Dots */}
            <Scatter
              name="Market Comps"
              data={compsData}
            >
              {compsData.map((entry, index) => (
                <Cell
                  key={`comp-${index}`}
                  fill={entry.color}
                  fillOpacity={0.4}
                  stroke="#94a3b8"
                  strokeWidth={1}
                />
              ))}
            </Scatter>

            {/* Subject Properties - Large Colored Dots */}
            <Scatter
              name="Subject Properties"
              data={subjectData}
              onClick={(data) => onPropertyClick?.(data.original)}
              cursor="pointer"
            >
              {subjectData.map((entry, index) => (
                <Cell
                  key={`subject-${index}`}
                  fill={entry.color}
                  strokeWidth={2}
                  stroke="#fff"
                  fillOpacity={1}
                  style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex gap-6 items-center border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Market Comps</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Subject (ARV Target)</span>
        </div>
        <div className="ml-auto text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
          Data sourced from Local Knowledge Bundle
        </div>
      </div>
    </div>
  );
}
