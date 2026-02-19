'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface MarketAnalysisProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

interface MarketMetrics {
  city: string;
  count: number;
  avgPrice: number;
  avgPricePerSqft: number;
  avgCapRate: number;
  avgEquityGap: number;
  avgRent: number;
}

export default function MarketAnalysis({ properties, onPropertyClick }: MarketAnalysisProps) {
  // Calculate metrics by city
  const marketMetrics = useMemo((): MarketMetrics[] => {
    const byCity: Record<string, PropertyWithCalculations[]> = {};
    
    properties.forEach(p => {
      if (!byCity[p.city]) byCity[p.city] = [];
      byCity[p.city].push(p);
    });

    return Object.entries(byCity).map(([city, props]) => ({
      city,
      count: props.length,
      avgPrice: props.reduce((sum, p) => sum + p.listPrice, 0) / props.length,
      avgPricePerSqft: props.reduce((sum, p) => sum + p.pricePerSqft, 0) / props.length,
      avgCapRate: props.reduce((sum, p) => sum + p.capRate, 0) / props.length,
      avgEquityGap: props.reduce((sum, p) => sum + p.equityGap, 0) / props.length,
      avgRent: props.reduce((sum, p) => sum + p.estimatedRent, 0) / props.length,
    })).sort((a, b) => b.count - a.count);
  }, [properties]);

  // Overall market stats
  const overallStats = useMemo(() => {
    return {
      totalProperties: properties.length,
      avgPrice: properties.reduce((sum, p) => sum + p.listPrice, 0) / properties.length,
      avgPricePerSqft: properties.reduce((sum, p) => sum + p.pricePerSqft, 0) / properties.length,
      avgCapRate: properties.reduce((sum, p) => sum + p.capRate, 0) / properties.length,
      avgEquityGap: properties.reduce((sum, p) => sum + p.equityGap, 0) / properties.length,
      totalEquity: properties.reduce((sum, p) => sum + p.equityGap, 0),
      cities: new Set(properties.map(p => p.city)).size,
    };
  }, [properties]);

  // Price distribution buckets
  const priceDistribution = useMemo(() => {
    const buckets = [
      { label: 'Under $100K', min: 0, max: 100000, count: 0 },
      { label: '$100K-$200K', min: 100000, max: 200000, count: 0 },
      { label: '$200K-$350K', min: 200000, max: 350000, count: 0 },
      { label: '$350K-$500K', min: 350000, max: 500000, count: 0 },
      { label: '$500K+', min: 500000, max: Infinity, count: 0 },
    ];

    properties.forEach(p => {
      const bucket = buckets.find(b => p.listPrice >= b.min && p.listPrice < b.max);
      if (bucket) bucket.count++;
    });

    return buckets;
  }, [properties]);

  // Strategy distribution
  const strategyDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    properties.forEach(p => {
      dist[p.strategy] = (dist[p.strategy] || 0) + 1;
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [properties]);

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-lg font-bold text-white">Market Analysis Dashboard</h2>
        <p className="text-sm text-dark-400">Real estate market insights by location</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase">Total Properties</p>
            <p className="text-xl font-bold text-white">{overallStats.totalProperties}</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase">Avg Price</p>
            <p className="text-xl font-bold text-white">${Math.round(overallStats.avgPrice).toLocaleString()}</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase">Avg Cap Rate</p>
            <p className="text-xl font-bold text-emerald-400">{overallStats.avgCapRate.toFixed(2)}%</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase">Total Equity</p>
            <p className="text-xl font-bold text-amber-400">${overallStats.totalEquity.toLocaleString()}</p>
          </div>
        </div>

        {/* City Breakdown */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Market by City ({overallStats.cities} cities)
          </h3>
          <div className="bg-dark-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-dark-400">City</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-dark-400">Properties</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-dark-400">Avg Price</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-dark-400">$/SqFt</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-dark-400">Cap Rate</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-dark-400">Avg Rent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {marketMetrics.map((metric) => (
                  <tr 
                    key={metric.city} 
                    className="hover:bg-dark-700 cursor-pointer"
                    onClick={() => {
                      const prop = properties.find(p => p.city === metric.city);
                      if (prop) onPropertyClick?.(prop);
                    }}
                  >
                    <td className="px-4 py-3 text-white font-medium">{metric.city}</td>
                    <td className="px-4 py-3 text-right text-white">{metric.count}</td>
                    <td className="px-4 py-3 text-right text-white">${Math.round(metric.avgPrice).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-white">${metric.avgPricePerSqft.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">{metric.avgCapRate.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-right text-white">${Math.round(metric.avgRent).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Price Distribution
          </h3>
          <div className="space-y-2">
            {priceDistribution.map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-3">
                <span className="w-28 text-sm text-dark-400">{bucket.label}</span>
                <div className="flex-1 h-4 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(bucket.count / properties.length) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-white text-right">{bucket.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Distribution */}
        <div>
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Strategy Distribution
          </h3>
          <div className="flex flex-wrap gap-2">
            {strategyDistribution.map(([strategy, count]) => (
              <div 
                key={strategy}
                className="bg-dark-800 rounded-lg px-4 py-2 flex items-center gap-3"
              >
                <span className="text-white font-medium">{strategy}</span>
                <span className="bg-dark-700 px-2 py-0.5 rounded text-sm text-dark-400">
                  {count} ({((count / properties.length) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
