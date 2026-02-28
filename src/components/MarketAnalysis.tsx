"use client";

import { useMemo } from "react";
import { PropertyWithCalculations } from "@/lib/calculations";

interface MarketAnalysisProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

interface MarketMetrics {
  city: string;
  count: number;
  avgPrice: number;
  avgPricePerSqft: number;
  avgEquityGap: number;
  avgMao: number;
}

export default function MarketAnalysis({
  properties,
  onPropertyClick,
}: MarketAnalysisProps) {
  const marketMetrics = useMemo((): MarketMetrics[] => {
    const byCity: Record<string, PropertyWithCalculations[]> = {};
    properties.forEach((p) => {
      if (!byCity[p.city]) byCity[p.city] = [];
      byCity[p.city].push(p);
    });

    return Object.entries(byCity)
      .map(([city, props]) => ({
        city,
        count: props.length,
        avgPrice: props.reduce((sum, p) => sum + p.listPrice, 0) / props.length,
        avgPricePerSqft:
          props.reduce((sum, p) => sum + p.pricePerSqft, 0) / props.length,
        avgEquityGap:
          props.reduce((sum, p) => sum + p.equityGap, 0) / props.length,
        avgMao: props.reduce((sum, p) => sum + p.mao50k, 0) / props.length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [properties]);

  const overallStats = useMemo(() => {
    return {
      totalProperties: properties.length,
      avgPrice:
        properties.length > 0
          ? properties.reduce((sum, p) => sum + p.listPrice, 0) /
            properties.length
          : 0,
      avgMao:
        properties.length > 0
          ? properties.reduce((sum, p) => sum + p.mao50k, 0) / properties.length
          : 0,
      totalEquity: properties.reduce((sum, p) => sum + p.equityGap, 0),
      cities: new Set(properties.map((p) => p.city)).size,
    };
  }, [properties]);

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 border border-dark-800 rounded-sm font-sans">
      <div className="p-6 border-b border-dark-800">
        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">
          Market Intelligence Dashboard
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-950 p-4 border border-dark-800 rounded-sm">
            <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest mb-1">
              Portfolio Size
            </p>
            <p className="text-2xl font-black text-white">
              {overallStats.totalProperties}
            </p>
          </div>
          <div className="bg-dark-950 p-4 border border-dark-800 rounded-sm">
            <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest mb-1">
              Avg List Basis
            </p>
            <p className="text-2xl font-black text-white">
              ${Math.round(overallStats.avgPrice).toLocaleString()}
            </p>
          </div>
          <div className="bg-dark-950 p-4 border border-dark-800 rounded-sm">
            <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest mb-1">
              Avg Pipeline MAO
            </p>
            <p className="text-2xl font-black text-blue-500">
              ${Math.round(overallStats.avgMao).toLocaleString()}
            </p>
          </div>
          <div className="bg-dark-950 p-4 border border-dark-800 rounded-sm">
            <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest mb-1">
              Total Equity Gap
            </p>
            <p className="text-2xl font-black text-emerald-500">
              ${overallStats.totalEquity.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-dark-950 border border-dark-800 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-900">
              <tr>
                <th className="px-4 py-3 text-left text-[9px] font-black text-dark-500 uppercase tracking-widest">
                  Market
                </th>
                <th className="px-4 py-3 text-right text-[9px] font-black text-dark-500 uppercase tracking-widest">
                  Deals
                </th>
                <th className="px-4 py-3 text-right text-[9px] font-black text-dark-500 uppercase tracking-widest">
                  Avg Basis
                </th>
                <th className="px-4 py-3 text-right text-[9px] font-black text-dark-500 uppercase tracking-widest">
                  Avg MAO
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {marketMetrics.map((metric) => (
                <tr
                  key={metric.city}
                  className="hover:bg-dark-800/50 cursor-pointer transition-colors group"
                  onClick={() => {
                    const prop = properties.find((p) => p.city === metric.city);
                    if (prop) onPropertyClick?.(prop);
                  }}
                >
                  <td className="px-4 py-4 text-xs font-black text-white uppercase">
                    {metric.city}
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-bold text-dark-400">
                    {metric.count}
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-bold text-white">
                    ${Math.round(metric.avgPrice).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-black text-blue-400">
                    ${Math.round(metric.avgMao).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
