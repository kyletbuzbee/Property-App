"use client";

import { useState, useMemo } from "react";
import { PropertyWithCalculations } from "@/lib/calculations";
import clsx from "clsx";
import { 
  SparklesIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface AIDealScoringProps {
  properties: PropertyWithCalculations[];
}

export default function AIDealScoring({ properties }: AIDealScoringProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    properties.length > 0 ? properties[0].id : null
  );

  const selectedProperty = useMemo(() => 
    properties.find(p => p.id === selectedId) || properties[0],
  [properties, selectedId]);

  if (!selectedProperty) {
    return (
      <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-sm">
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No properties analyzed</h3>
          <p className="text-slate-500">Add properties to trigger institutional AI audits.</p>
        </div>
      </div>
    );
  }

  const score = selectedProperty.dealScore || 0;
  
  const riskLevel = () => {
    if (selectedProperty.decision === "HARD_FAIL")
      return { label: "CRITICAL RISK", color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", icon: ExclamationTriangleIcon };
    if (selectedProperty.decision === "CAUTION")
      return { label: "ELEVATED RISK", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", icon: ExclamationTriangleIcon };
    return { label: "LOW RISK", color: "text-success", bg: "bg-success/10", border: "border-success/20", icon: ShieldCheckIcon };
  };

  const risk = riskLevel();
  const RiskIcon = risk.icon;

  return (
    <div className="h-full grid grid-cols-12 gap-4">
      {/* Sidebar - Property List */}
      <div className="col-span-3 flex flex-col gap-2 overflow-y-auto pr-2">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Analyzed Deals</h3>
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={clsx(
              "flex flex-col p-3 rounded-sm border transition-all text-left",
              selectedId === p.id
                ? "bg-white border-primary-500 shadow-sm ring-1 ring-primary-500/10"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            )}
          >
            <span className="text-[13px] font-bold text-slate-900 truncate">{p.address}</span>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{p.city}</span>
              <span className={clsx(
                "text-[10px] font-bold tabular-nums",
                p.dealScore >= 80 ? "text-success" : p.dealScore >= 60 ? "text-warning" : "text-danger"
              )}>
                Score: {Math.round(p.dealScore)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Analysis View */}
      <div className="col-span-9 flex flex-col gap-4 overflow-y-auto pb-4">
        {/* Header Section */}
        <div className="bento-card flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <div className={clsx("p-3 rounded-sm", risk.bg, risk.border, "border shadow-sm")}>
              <RiskIcon className={clsx("w-8 h-8", risk.color)} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedProperty.address}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={clsx("px-2 py-0.5 rounded-sm text-[10px] font-black tracking-tight", risk.bg, risk.color, risk.border, "border")}>
                  {risk.label}
                </span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Audit Confidence: {Math.round(score)}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Score</p>
            <p className={clsx("text-5xl font-black italic tracking-tighter tabular-nums", 
              score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-danger")}>
              {Math.round(score)}
            </p>
          </div>
        </div>

        {/* Bento Grid Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <ScaleIcon className="w-4 h-4 text-primary-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acquisition Targets</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                <span className="text-[11px] font-medium text-slate-500">Target MAO (25k)</span>
                <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">${selectedProperty.mao25k.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                <span className="text-[11px] font-medium text-slate-500">Target MAO (50k)</span>
                <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">${selectedProperty.mao50k.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <CurrencyDollarIcon className="w-4 h-4 text-success" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valuation Model</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                <span className="text-[11px] font-medium text-slate-500">After Repair Value</span>
                <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">${selectedProperty.afterRepairValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                <span className="text-[11px] font-medium text-slate-500">Rehab Budget</span>
                <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">${selectedProperty.renovationBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <ChartBarIcon className="w-4 h-4 text-warning" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risk Analysis</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                <span className="text-[11px] font-medium text-slate-500">Rehab Tier</span>
                <span className="text-sm font-bold text-warning uppercase tracking-tight">{selectedProperty.rehabTier}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                <span className="text-[11px] font-medium text-slate-500">Decision Signal</span>
                <span className={clsx("text-sm font-bold uppercase tracking-tight", risk.color)}>{selectedProperty.decision}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Block (Terminal Card) */}
        <div className="narrative-block shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Audit Narrative Output v4.2</span>
          </div>
          
          <div className="space-y-4 font-mono">
            {selectedProperty.rationale.split('\n').map((line, i) => {
              if (line.includes(':')) {
                const [header, content] = line.split(':');
                return (
                  <div key={i}>
                    <span className="text-slate-500 font-bold uppercase mr-2">{header}:</span>
                    <span className="text-slate-300">{content}</span>
                  </div>
                );
              }
              return <p key={i} className="text-slate-300">{line}</p>;
            })}
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-primary-500 animate-pulse">
            <span className="text-xs font-black">_</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">End of Audit Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}
