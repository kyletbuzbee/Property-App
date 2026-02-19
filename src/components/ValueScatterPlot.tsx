'use client';

import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { getDecisionColor, Decision } from '@/data/properties';
import { PropertyWithCalculations } from '@/lib/calculations';

interface ValueScatterPlotProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

interface ChartData {
  x: number;
  y: number;
  size: number;
  property: PropertyWithCalculations;
  isOutlier: boolean;
}

export default function ValueScatterPlot({ properties, onPropertyClick }: ValueScatterPlotProps) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | 'all'>('all');
  const [showTrendLine, setShowTrendLine] = useState(true);

  const averagePricePerSqft = useMemo(() => {
    const validProperties = properties.filter(p => p.sqft > 0);
    if (validProperties.length === 0) return 0;
    const total = validProperties.reduce((sum, p) => sum + p.pricePerSqft, 0);
    return total / validProperties.length;
  }, [properties]);

  const chartData: ChartData[] = useMemo(() => {
    const maxPrice = Math.max(...properties.map(p => p.listPrice));
    const minSize = 100;
    const maxSize = 1000;

    return properties
      .filter(p => p.sqft > 0)
      .filter(p => selectedDecision === 'all' || p.decision === selectedDecision)
      .map(p => {
        const pricePerSqft = p.pricePerSqft;
        const normalizedSize = minSize + ((p.listPrice / maxPrice) * (maxSize - minSize));
        return {
          x: p.sqft,
          y: pricePerSqft,
          size: normalizedSize,
          property: p,
          isOutlier: pricePerSqft < averagePricePerSqft * 0.7,
        };
      });
  }, [properties, selectedDecision, averagePricePerSqft]);

  const outlierCount = chartData.filter(d => d.isOutlier).length;

  const decisionFilters: { value: Decision | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: '#64748b' },
    { value: 'Pass Platinum', label: 'Platinum', color: '#10b981' },
    { value: 'Pass Gold', label: 'Gold', color: '#f59e0b' },
    { value: 'Pass Silver', label: 'Silver', color: '#f97316' },
    { value: 'Hard Fail', label: 'Hard Fail', color: '#ef4444' },
    { value: 'Caution', label: 'Caution', color: '#8b5cf6' },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const { property } = data;
      
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-xl max-w-xs">
          <div className="font-semibold text-white mb-2">{property.address}</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">List Price:</span>
              <span className="text-emerald-400 font-medium">
                ${property.listPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">SqFt:</span>
              <span>{property.sqft.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
               <span className="text-dark-400">$/SqFt:</span>
               <span className={data.isOutlier ? 'text-emerald-400 font-bold' : ''}>
                 ${property.pricePerSqft.toFixed(2)}
               </span>
             </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">Decision:</span>
              <span style={{ color: getDecisionColor(property.decision as Decision) }}>
                {property.decision}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">Strategy:</span>
              <span className="text-primary-400">{property.strategy}</span>
            </div>
          </div>
          {data.isOutlier && (
            <div className="mt-2 pt-2 border-t border-dark-600">
              <span className="text-xs text-emerald-400 font-medium">
                ⭐ Below Average - Potential Value!
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {decisionFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedDecision(filter.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDecision === filter.value
                  ? 'ring-2 ring-offset-2 ring-offset-dark-800'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: `${filter.color}20`,
                color: filter.color,
                '--tw-ring-color': filter.color,
              } as React.CSSProperties}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-dark-300">
            <input
              type="checkbox"
              checked={showTrendLine}
              onChange={(e) => setShowTrendLine(e.target.checked)}
              className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
            />
            Show Average Line
          </label>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
          <div className="text-xs text-dark-400 mb-1">Average $/SqFt</div>
          <div className="text-xl font-bold text-primary-400">
            ${averagePricePerSqft.toFixed(2)}
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
          <div className="text-xs text-dark-400 mb-1">Properties Shown</div>
          <div className="text-xl font-bold text-white">{chartData.length}</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
          <div className="text-xs text-dark-400 mb-1">Value Outliers</div>
          <div className="text-xl font-bold text-emerald-400">{outlierCount}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[400px] bg-dark-800 rounded-lg border border-dark-700 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              type="number"
              dataKey="x"
              name="Square Footage"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              label={{ 
                value: 'Square Footage', 
                position: 'bottom',
                fill: '#94a3b8',
                fontSize: 12,
                offset: 40,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Price per SqFt"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              label={{ 
                value: 'Price per SqFt ($)', 
                angle: -90,
                position: 'left',
                fill: '#94a3b8',
                fontSize: 12,
                offset: 40,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {showTrendLine && (
              <ReferenceLine
                y={averagePricePerSqft}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: $${averagePricePerSqft.toFixed(0)}/sqft`,
                  position: 'right',
                  fill: '#f59e0b',
                  fontSize: 11,
                }}
              />
            )}
            
            <Scatter
              name="Properties"
              data={chartData}
              onClick={(data) => onPropertyClick?.(data.property)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getDecisionColor(entry.property.decision as Decision)}
                  stroke={entry.isOutlier ? '#10b981' : 'transparent'}
                  strokeWidth={entry.isOutlier ? 2 : 0}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-dark-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-dark-400" />
          <span>Bubble size = List Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500" />
          <span>Green border = Below average (value opportunity)</span>
        </div>
      </div>
    </div>
  );
}
