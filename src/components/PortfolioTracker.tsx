"use client";

import { useMemo } from "react";
import { PropertyWithCalculations } from "@/lib/calculations";

interface PortfolioTrackerProps {
  properties: PropertyWithCalculations[];
}

export default function PortfolioTracker({
  properties,
}: PortfolioTrackerProps) {
  const ownedProperties = properties.filter((p) => p.isOwned);
  const prospectProperties = properties.filter((p) => !p.isOwned);

  const stats = useMemo(() => {
    const totalInvested = ownedProperties.reduce(
      (sum, p) => sum + (p.purchasePrice || 0),
      0,
    );
    const totalEquity = ownedProperties.reduce(
      (sum, p) =>
        sum +
        (p.afterRepairValue - (p.purchasePrice || 0) - p.renovationBudget),
      0,
    );

    return {
      totalInvested,
      totalEquity,
      ownedCount: ownedProperties.length,
      prospectCount: prospectProperties.length,
      pipelineMao: prospectProperties.reduce((sum, p) => sum + p.mao50k, 0),
    };
  }, [ownedProperties, prospectProperties]);

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-900 p-6 border border-dark-800 rounded-sm">
          <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">
            Total Capital Deployed
          </p>
          <p className="text-3xl font-black text-white">
            ${stats.totalInvested.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-900 p-6 border border-dark-800 rounded-sm">
          <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">
            Net Portfolio Equity
          </p>
          <p className="text-3xl font-black text-emerald-500">
            ${stats.totalEquity.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-900 p-6 border border-dark-800 rounded-sm">
          <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">
            Pipeline Buy Power (MAO)
          </p>
          <p className="text-3xl font-black text-blue-500">
            ${stats.pipelineMao.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-sm overflow-hidden">
        <div className="p-4 bg-dark-950 border-b border-dark-800">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            Active Inventory
          </h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead className="bg-dark-900 border-b border-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-dark-500 uppercase tracking-widest">
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-[10px] font-black text-dark-500 uppercase tracking-widest">
                  Basis
                </th>
                <th className="px-6 py-3 text-right text-[10px] font-black text-dark-500 uppercase tracking-widest">
                  Target ARV
                </th>
                <th className="px-6 py-3 text-right text-[10px] font-black text-dark-500 uppercase tracking-widest">
                  Est. Equity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {ownedProperties.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-dark-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-white uppercase">
                      {p.address}
                    </p>
                    <p className="text-[9px] font-bold text-dark-500 uppercase">
                      {p.city}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-dark-300">
                    ${(p.purchasePrice + p.renovationBudget).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-white">
                    ${p.afterRepairValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-black text-emerald-500">
                    $
                    {(
                      p.afterRepairValue -
                      p.purchasePrice -
                      p.renovationBudget
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
              {ownedProperties.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-[10px] font-black text-dark-600 uppercase tracking-widest"
                  >
                    No assets in portfolio
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
