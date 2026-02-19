'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface PortfolioTrackerProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

// Owned properties are marked with isOwned = true
export default function PortfolioTracker({ 
  properties, 
  onPropertyClick 
}: PortfolioTrackerProps) {
  // Filter to show only owned properties (or all for potential portfolio)
  const ownedProperties = useMemo(() => {
    return properties.filter(p => (p as any).isOwned === true);
  }, [properties]);

  const prospectProperties = useMemo(() => {
    return properties.filter(p => (p as any).isOwned !== true);
  }, [properties]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const totalInvested = ownedProperties.reduce((sum, p) => sum + ((p as any).purchasePrice || p.listPrice), 0);
    const totalEquityGap = ownedProperties.reduce((sum, p) => sum + p.equityGap, 0);
    const totalMonthlyRent = ownedProperties.reduce((sum, p) => sum + p.estimatedRent, 0);
    const totalValue = ownedProperties.reduce((sum, p) => sum + p.afterRepairValue || p.listPrice, 0);
    const totalCapRate = ownedProperties.length > 0 
      ? ownedProperties.reduce((sum, p) => sum + p.capRate, 0) / ownedProperties.length 
      : 0;
    
    return {
      totalProperties: ownedProperties.length,
      totalInvested,
      totalEquityGap,
      totalMonthlyRent,
      totalValue,
      totalCapRate,
      monthlyCashFlow: totalMonthlyRent - (totalMonthlyRent * 0.05), // Assume 5% vacancy
      annualCashFlow: (totalMonthlyRent - (totalMonthlyRent * 0.05)) * 12,
    };
  }, [ownedProperties]);

  // Calculate potential deal metrics
  const potentialMetrics = useMemo(() => {
    const avgCapRate = prospectProperties.length > 0
      ? prospectProperties.reduce((sum, p) => sum + p.capRate, 0) / prospectProperties.length
      : 0;
    const avgEquityGap = prospectProperties.length > 0
      ? prospectProperties.reduce((sum, p) => sum + p.equityGap, 0) / prospectProperties.length
      : 0;
    const totalEquityGap = prospectProperties.reduce((sum, p) => sum + p.equityGap, 0);
    
    return {
      count: prospectProperties.length,
      avgCapRate,
      avgEquityGap,
      totalEquityGap,
    };
  }, [prospectProperties]);

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header Stats */}
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-lg font-bold text-white mb-4">Investment Portfolio</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase tracking-wider">Portfolio Value</p>
            <p className="text-xl font-bold text-white">${portfolioMetrics.totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase tracking-wider">Total Invested</p>
            <p className="text-xl font-bold text-emerald-400">${portfolioMetrics.totalInvested.toLocaleString()}</p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase tracking-wider">Monthly Cash Flow</p>
            <p className={clsx(
              'text-xl font-bold',
              portfolioMetrics.monthlyCashFlow > 0 ? 'text-emerald-400' : 'text-red-400'
            )}>
              ${portfolioMetrics.monthlyCashFlow.toLocaleString()}
            </p>
          </div>
          <div className="bg-dark-800 rounded-lg p-3">
            <p className="text-xs text-dark-400 uppercase tracking-wider">Avg Cap Rate</p>
            <p className={clsx(
              'text-xl font-bold',
              portfolioMetrics.totalCapRate >= 8 ? 'text-emerald-400' : 
              portfolioMetrics.totalCapRate >= 6 ? 'text-amber-400' : 'text-red-400'
            )}>
              {portfolioMetrics.totalCapRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Owned Properties */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Owned Properties ({ownedProperties.length})
          </h3>
          
          {ownedProperties.length > 0 ? (
            <div className="space-y-2">
              {ownedProperties.map(property => (
                <div
                  key={property.id}
                  onClick={() => onPropertyClick?.(property)}
                  className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{property.address}</p>
                      <p className="text-sm text-dark-400">{property.city}, {property.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-medium">
                        ${((property as any).purchasePrice || property.listPrice).toLocaleString()}
                      </p>
                      <p className="text-sm text-dark-400">
                        ${property.estimatedRent.toLocaleString()}/mo rent
                      </p>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="flex gap-4 mt-3 pt-3 border-t border-dark-700">
                    <div>
                      <p className="text-xs text-dark-500">Cap Rate</p>
                      <p className="text-sm text-white">{property.capRate.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500">Cash-on-Cash</p>
                      <p className="text-sm text-white">{property.cashOnCashReturn.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500">Gross Yield</p>
                      <p className="text-sm text-white">{property.grossYield.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500">Equity</p>
                      <p className="text-sm text-amber-400">${property.equityGap.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-800 rounded-lg p-6 text-center text-dark-400">
              No owned properties yet. Mark properties as owned to track your portfolio.
            </div>
          )}
        </div>

        {/* Potential Deals */}
        <div>
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Potential Deals ({prospectProperties.length})
          </h3>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Avg Cap Rate</p>
              <p className="text-lg font-bold text-white">{potentialMetrics.avgCapRate.toFixed(2)}%</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Avg Equity Gap</p>
              <p className="text-lg font-bold text-amber-400">${Math.round(potentialMetrics.avgEquityGap).toLocaleString()}</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Total Equity</p>
              <p className="text-lg font-bold text-emerald-400">${potentialMetrics.totalEquityGap.toLocaleString()}</p>
            </div>
          </div>

          {/* Top Prospects */}
          <div className="space-y-2">
            {prospectProperties.slice(0, 5).map(property => (
              <div
                key={property.id}
                onClick={() => onPropertyClick?.(property)}
                className="bg-dark-800 rounded-lg p-3 hover:bg-dark-700 cursor-pointer transition-colors flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-white text-sm">{property.address}</p>
                  <p className="text-xs text-dark-400">{property.city} • {property.decision}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${property.listPrice.toLocaleString()}</p>
                  <p className="text-xs text-amber-400">${property.equityGap.toLocaleString()} equity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700 bg-dark-800/50">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-dark-400">Annual Cash Flow: </span>
            <span className={clsx(
              'font-medium',
              portfolioMetrics.annualCashFlow > 0 ? 'text-emerald-400' : 'text-red-400'
            )}>
              ${portfolioMetrics.annualCashFlow.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-dark-400">Cash-on-Cash Return: </span>
            <span className="text-white font-medium">
              {portfolioMetrics.totalInvested > 0 
                ? ((portfolioMetrics.annualCashFlow / portfolioMetrics.totalInvested) * 100).toFixed(2)
                : '0.00'}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
