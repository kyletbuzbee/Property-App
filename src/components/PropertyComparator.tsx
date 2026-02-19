'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';
import { getDecisionColor, Decision } from '@/data/properties';

interface PropertyComparatorProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  onClose?: () => void;
}

// Metrics to compare
interface ComparisonMetric {
  key: keyof PropertyWithCalculations;
  label: string;
  format: 'currency' | 'number' | 'percent' | 'boolean' | 'text';
  higherIsBetter?: boolean;
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  { key: 'listPrice', label: 'List Price', format: 'currency', higherIsBetter: false },
  { key: 'sqft', label: 'Square Feet', format: 'number', higherIsBetter: true },
  { key: 'pricePerSqft', label: 'Price/SqFt', format: 'currency', higherIsBetter: false },
  { key: 'bedrooms', label: 'Bedrooms', format: 'number', higherIsBetter: true },
  { key: 'bathrooms', label: 'Bathrooms', format: 'number', higherIsBetter: true },
  { key: 'equityGap', label: 'Equity Gap', format: 'currency', higherIsBetter: true },
  { key: 'capRate', label: 'Cap Rate', format: 'percent', higherIsBetter: true },
  { key: 'cashOnCashReturn', label: 'Cash-on-Cash', format: 'percent', higherIsBetter: true },
  { key: 'mao', label: 'MAO', format: 'currency', higherIsBetter: false },
  { key: 'grossYield', label: 'Gross Yield', format: 'percent', higherIsBetter: true },
  { key: 'onePercentRule', label: '1% Rule', format: 'boolean', higherIsBetter: true },
  { key: 'estimatedRent', label: 'Est. Rent', format: 'currency', higherIsBetter: true },
  { key: 'annualTaxes', label: 'Annual Taxes', format: 'currency', higherIsBetter: false },
  { key: 'renovationBudget', label: 'Renovation Budget', format: 'currency', higherIsBetter: false },
  { key: 'afterRepairValue', label: 'After Repair Value', format: 'currency', higherIsBetter: true },
];

export default function PropertyComparator({ 
  properties, 
  onPropertyClick,
  onClose 
}: PropertyComparatorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);

  // Toggle property selection for comparison
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < 4) {
        // Limit to 4 properties for comparison
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get selected properties
  const selectedProperties = useMemo(() => {
    return properties.filter(p => selectedIds.has(p.id));
  }, [properties, selectedIds]);

  // Format value based on metric type
  const formatValue = (metric: ComparisonMetric, value: any): string => {
    if (value === null || value === undefined) return '-';
    
    switch (metric.format) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'number':
        return Number(value).toLocaleString();
      case 'percent':
        return `${Number(value).toFixed(2)}%`;
      case 'boolean':
        return value ? '✓' : '✗';
      case 'text':
        return String(value);
      default:
        return String(value);
    }
  };

  // Determine if a value is the best among selected properties
  const getBestValue = (metric: ComparisonMetric): number | boolean => {
    const values = selectedProperties.map(p => p[metric.key]);
    
    if (metric.format === 'currency' || metric.format === 'number' || metric.format === 'percent') {
      const numericValues = values.map(v => Number(v) || 0);
      return metric.higherIsBetter 
        ? Math.max(...numericValues)
        : Math.min(...numericValues);
    }
    
    if (metric.format === 'boolean') {
      return values.some(v => v === true);
    }
    
    return 0;
  };

  // Check if a value is the best
  const isBestValue = (metric: ComparisonMetric, value: any): boolean => {
    const bestValue = getBestValue(metric);
    
    if (metric.format === 'boolean') {
      return value === true && bestValue === true;
    }
    
    const numericValue = Number(value) || 0;
    const numericBest = Number(bestValue) || 0;
    
    if (metric.higherIsBetter) {
      return numericValue >= numericBest && numericValue > 0;
    } else {
      return numericValue <= numericBest && numericValue > 0;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">Property Comparison</h2>
          <p className="text-sm text-dark-400">
            Select up to 4 properties to compare side-by-side
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isSelecting 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            )}
          >
            {isSelecting ? 'Done Selecting' : 'Select Properties'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-dark-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Property Selection Grid */}
      {isSelecting && (
        <div className="p-4 border-b border-dark-700">
          <p className="text-sm text-dark-400 mb-2">Click properties to add to comparison:</p>
          <div className="flex flex-wrap gap-2">
            {properties.slice(0, 10).map(property => (
              <button
                key={property.id}
                onClick={() => toggleSelection(property.id)}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedIds.has(property.id)
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                )}
              >
                {property.address.substring(0, 20)}...
                {selectedIds.has(property.id) && ' ✓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedProperties.length > 0 ? (
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                  Metric
                </th>
                {selectedProperties.map(property => (
                  <th 
                    key={property.id} 
                    className="px-4 py-3 text-left min-w-[180px]"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-sm">
                        {property.address.length > 25 
                          ? property.address.substring(0, 25) + '...' 
                          : property.address}
                      </span>
                      <span className="text-xs text-dark-400">{property.city}</span>
                      <span 
                        className="text-xs mt-1 inline-block px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${getDecisionColor(property.decision as Decision)}20`,
                          color: getDecisionColor(property.decision as Decision)
                        }}
                      >
                        {property.decision}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {COMPARISON_METRICS.map(metric => (
                <tr key={metric.key} className="hover:bg-dark-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-dark-300">
                    {metric.label}
                  </td>
                  {selectedProperties.map(property => {
                    const value = property[metric.key];
                    const isBest = isBestValue(metric, value);
                    
                    return (
                      <td 
                        key={property.id} 
                        className={clsx(
                          'px-4 py-3 text-sm',
                          isBest && metric.format !== 'boolean' 
                            ? 'text-emerald-400 font-medium' 
                            : 'text-white'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {formatValue(metric, value)}
                          {isBest && metric.format !== 'boolean' && (
                            <span className="text-emerald-400 text-xs" title="Best value">★</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-dark-400">
          <div className="text-center">
            <p className="text-lg mb-2">No properties selected</p>
            <p className="text-sm">Click &quot;Select Properties&quot; to choose properties to compare</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {selectedProperties.length > 1 && (
        <div className="p-4 border-t border-dark-700 bg-dark-800/50">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-dark-400">Avg Price: </span>
              <span className="text-white font-medium">
                ${Math.round(selectedProperties.reduce((sum, p) => sum + p.listPrice, 0) / selectedProperties.length).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-dark-400">Avg Cap Rate: </span>
              <span className="text-emerald-400 font-medium">
                {(selectedProperties.reduce((sum, p) => sum + p.capRate, 0) / selectedProperties.length).toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-dark-400">Total Equity Gap: </span>
              <span className="text-amber-400 font-medium">
                ${selectedProperties.reduce((sum, p) => sum + p.equityGap, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
