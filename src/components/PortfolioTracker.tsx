"use client";

import { useMemo } from "react";
import { PropertyWithCalculations } from "@/lib/calculations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/Card";
import { SkeletonTable } from "@/components/ui/Skeleton";

interface PortfolioTrackerProps {
  properties: PropertyWithCalculations[];
  isLoading?: boolean;
}

export default function PortfolioTracker({
  properties,
  isLoading = false,
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

  if (isLoading) {
    return (
      <div className="space-y-6 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonTable rows={1} columns={1} className="h-24" />
          <SkeletonTable rows={1} columns={1} className="h-24" />
          <SkeletonTable rows={1} columns={1} className="h-24" />
        </div>
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Capital Deployed"
          value={`$${stats.totalInvested.toLocaleString()}`}
          variant="default"
        />
        <MetricCard
          label="Net Portfolio Equity"
          value={`$${stats.totalEquity.toLocaleString()}`}
          trend={stats.totalEquity > 0 ? 12.5 : undefined}
          trendLabel="vs last quarter"
          variant="success"
        />
        <MetricCard
          label="Pipeline Buy Power (MAO)"
          value={`$${stats.pipelineMao.toLocaleString()}`}
          trend={stats.pipelineMao > 0 ? 8.3 : undefined}
          trendLabel="active pipeline"
          variant="info"
        />
      </div>

      {/* Active Inventory Table */}
      <Card variant="dark" isHoverable>
        <CardHeader className="bg-dark-950 border-b border-dark-800">
          <CardTitle className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            Active Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
              {ownedProperties.map((p, index) => (
                <tr
                  key={p.id}
                  className="hover:bg-dark-800/50 transition-all duration-200 focus-visible:bg-dark-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/50"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-white uppercase">
                      {p.address}
                    </p>
                    <p className="text-[9px] font-bold text-dark-500 uppercase">
                      {p.city}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-dark-300 tabular-nums">
                    ${(p.purchasePrice + p.renovationBudget).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-white tabular-nums">
                    ${p.afterRepairValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-black text-emerald-500 tabular-nums">
                    ${(
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
        </CardContent>
      </Card>
    </div>
  );
}
