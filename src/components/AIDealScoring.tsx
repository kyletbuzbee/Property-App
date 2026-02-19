'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface AIDealScoringProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  onUpdateScore?: (propertyId: string, score: number) => void;
}

// Scoring factors with weights
interface ScoringFactor {
  name: string;
  weight: number;
  evaluate: (property: PropertyWithCalculations) => number;
}

const SCORING_FACTORS: ScoringFactor[] = [
  {
    name: 'Cap Rate',
    weight: 0.20,
    evaluate: (p) => {
      if (p.capRate >= 10) return 100;
      if (p.capRate >= 8) return 80;
      if (p.capRate >= 6) return 60;
      if (p.capRate >= 4) return 40;
      return 20;
    },
  },
  {
    name: 'Cash-on-Cash Return',
    weight: 0.20,
    evaluate: (p) => {
      if (p.cashOnCashReturn >= 20) return 100;
      if (p.cashOnCashReturn >= 15) return 80;
      if (p.cashOnCashReturn >= 10) return 60;
      if (p.cashOnCashReturn >= 5) return 40;
      return 20;
    },
  },
  {
    name: 'Equity Gap',
    weight: 0.15,
    evaluate: (p) => {
      const ratio = p.equityGap / p.listPrice;
      if (ratio >= 0.30) return 100;
      if (ratio >= 0.20) return 80;
      if (ratio >= 0.15) return 60;
      if (ratio >= 0.10) return 40;
      return 20;
    },
  },
  {
    name: '1% Rule',
    weight: 0.15,
    evaluate: (p) => p.onePercentRule ? 100 : 30,
  },
  {
    name: 'Gross Yield',
    weight: 0.10,
    evaluate: (p) => {
      if (p.grossYield >= 15) return 100;
      if (p.grossYield >= 12) return 80;
      if (p.grossYield >= 8) return 60;
      if (p.grossYield >= 5) return 40;
      return 20;
    },
  },
  {
    name: 'Price per SqFt',
    weight: 0.10,
    evaluate: (p) => {
      // Lower is better - compare to average of $150/sqft
      const avgPricePerSqft = 150;
      const ratio = p.pricePerSqft / avgPricePerSqft;
      if (ratio <= 0.7) return 100;
      if (ratio <= 0.85) return 80;
      if (ratio <= 1.0) return 60;
      if (ratio <= 1.2) return 40;
      return 20;
    },
  },
  {
    name: 'Decision Quality',
    weight: 0.10,
    evaluate: (p) => {
      switch (p.decision) {
        case 'Pass Platinum': return 100;
        case 'Pass Gold': return 85;
        case 'Pass Silver': return 70;
        case 'Caution': return 40;
        case 'Hard Fail': return 10;
        default: return 50;
      }
    },
  },
];

// Calculate overall score for a property
const calculateDealScore = (property: PropertyWithCalculations): number => {
  let totalWeight = 0;
  let weightedScore = 0;

  SCORING_FACTORS.forEach(factor => {
    const score = factor.evaluate(property);
    weightedScore += score * factor.weight;
    totalWeight += factor.weight;
  });

  return Math.round(weightedScore / totalWeight);
};

// Get risk level based on score
const getRiskLevel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: 'Low Risk', color: 'text-emerald-400' };
  if (score >= 60) return { label: 'Medium Risk', color: 'text-amber-400' };
  if (score >= 40) return { label: 'High Risk', color: 'text-orange-400' };
  return { label: 'Very High Risk', color: 'text-red-400' };
};

export default function AIDealScoring({ 
  properties, 
  onPropertyClick,
  onUpdateScore 
}: AIDealScoringProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate scores for all properties
  const scoredProperties = useMemo(() => {
    return properties.map(property => {
      const score = calculateDealScore(property);
      const risk = getRiskLevel(score);
      return {
        ...property,
        dealScore: score,
        riskLevel: risk.label,
        riskColor: risk.color,
      };
    }).sort((a, b) => b.dealScore - a.dealScore);
  }, [properties]);

  // Get selected property details
  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return scoredProperties.find(p => p.id === selectedPropertyId);
  }, [selectedPropertyId, scoredProperties]);

  // Calculate factor scores for selected property
  const factorScores = useMemo(() => {
    if (!selectedProperty) return [];
    return SCORING_FACTORS.map(factor => ({
      name: factor.name,
      weight: factor.weight,
      score: factor.evaluate(selectedProperty),
    }));
  }, [selectedProperty]);

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">AI Deal Scoring</h2>
          <p className="text-sm text-dark-400">Automated investment analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              showDetails 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            )}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Score Distribution */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {scoredProperties.filter(p => p.dealScore >= 80).length}
            </p>
            <p className="text-xs text-dark-400">Excellent (80+)</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {scoredProperties.filter(p => p.dealScore >= 60 && p.dealScore < 80).length}
            </p>
            <p className="text-xs text-dark-400">Good (60-79)</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {scoredProperties.filter(p => p.dealScore >= 40 && p.dealScore < 60).length}
            </p>
            <p className="text-xs text-dark-400">Fair (40-59)</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">
              {scoredProperties.filter(p => p.dealScore < 40).length}
            </p>
            <p className="text-xs text-dark-400">Poor ({'<'}40)</p>
          </div>
        </div>

        {/* Property List */}
        <div className="space-y-2">
          {scoredProperties.slice(0, 15).map((property, index) => (
            <div
              key={property.id}
              onClick={() => setSelectedPropertyId(property.id)}
              className={clsx(
                'bg-dark-800 rounded-lg p-4 cursor-pointer transition-colors',
                selectedPropertyId === property.id 
                  ? 'ring-2 ring-primary-500' 
                  : 'hover:bg-dark-700'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    property.dealScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                    property.dealScore >= 60 ? 'bg-blue-500/20 text-blue-400' :
                    property.dealScore >= 40 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  )}>
                    {property.dealScore}
                  </div>
                  <div>
                    <p className="font-medium text-white">{property.address}</p>
                    <p className="text-sm text-dark-400">{property.city} • {property.strategy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={clsx('font-medium', property.riskColor)}>
                    {property.riskLevel}
                  </p>
                  <p className="text-sm text-dark-400">
                    ${property.listPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mt-3">
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      'h-full rounded-full transition-all',
                      property.dealScore >= 80 ? 'bg-emerald-500' :
                      property.dealScore >= 60 ? 'bg-blue-500' :
                      property.dealScore >= 40 ? 'bg-amber-500' :
                      'bg-red-500'
                    )}
                    style={{ width: `${property.dealScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedProperty && (
        <div className="p-4 border-t border-dark-700 bg-dark-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-white">{selectedProperty.address}</h3>
              <p className="text-sm text-dark-400">{selectedProperty.city}, {selectedProperty.state}</p>
            </div>
            <button
              onClick={() => onPropertyClick?.(selectedProperty)}
              className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
            >
              View Property
            </button>
          </div>

          {showDetails && (
            <div className="space-y-2">
              {factorScores.map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-dark-400">{factor.name}</span>
                    <span className="text-xs text-dark-500">({(factor.weight * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className={clsx(
                          'h-full rounded-full',
                          factor.score >= 80 ? 'bg-emerald-500' :
                          factor.score >= 60 ? 'bg-blue-500' :
                          factor.score >= 40 ? 'bg-amber-500' :
                          'bg-red-500'
                        )}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <span className="text-sm text-white w-8 text-right">{factor.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showDetails && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-dark-500">Cap Rate</p>
                <p className="text-white">{selectedProperty.capRate.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-dark-500">Cash-on-Cash</p>
                <p className="text-white">{selectedProperty.cashOnCashReturn.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-dark-500">Equity Gap</p>
                <p className="text-amber-400">${selectedProperty.equityGap.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
