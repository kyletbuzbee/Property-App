'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface FinancialProjectionsProps {
  property: PropertyWithCalculations | null;
  onClose?: () => void;
}

interface ProjectionYear {
  year: number;
  grossRent: number;
  vacancy: number;
  effectiveGross: number;
  operatingExpenses: number;
  noi: number;
  mortgage: number;
  cashFlow: number;
  equityBuild: number;
  totalReturn: number;
}

interface LoanDetails {
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
}

const DEFAULT_LOAN: LoanDetails = {
  downPaymentPercent: 20,
  interestRate: 7.0,
  loanTermYears: 30,
};

// Calculate monthly mortgage payment
const calculateMortgage = (
  principal: number, 
  annualRate: number, 
  years: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
};

export default function FinancialProjections({ property, onClose }: FinancialProjectionsProps) {
  const [loanDetails, setLoanDetails] = useState<LoanDetails>(DEFAULT_LOAN);
  const [projectionYears, setProjectionYears] = useState(5);
  const [rentGrowthRate, setRentGrowthRate] = useState(3);
  const [appreciationRate, setAppreciationRate] = useState(3);
  const [expenseGrowthRate, setExpenseGrowthRate] = useState(2);

  // Calculate projections
  const projections = useMemo((): ProjectionYear[] => {
    if (!property) return [];

    const purchasePrice = property.listPrice;
    const downPayment = purchasePrice * (loanDetails.downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgage = calculateMortgage(loanAmount, loanDetails.interestRate, loanDetails.loanTermYears);
    const annualMortgage = monthlyMortgage * 12;

    // Initial values
    let grossRent = (property.estimatedRent || 0) * 12;
    const vacancyRate = 0.05;
    const operatingExpensesRate = 0.40; // 40% of gross rent
    let currentPropertyValue = purchasePrice + (property.afterRepairValue - property.listPrice);

    const results: ProjectionYear[] = [];

    for (let year = 1; year <= projectionYears; year++) {
      // Apply growth rates
      if (year > 1) {
        grossRent *= (1 + rentGrowthRate / 100);
        currentPropertyValue *= (1 + appreciationRate / 100);
      }

      const vacancy = grossRent * vacancyRate;
      const effectiveGross = grossRent - vacancy;
      const operatingExpenses = effectiveGross * operatingExpensesRate;
      const noi = effectiveGross - operatingExpenses;
      const cashFlow = noi - annualMortgage;

      // Equity buildup (principal paydown + appreciation)
      // Simplified: assume 80% of first year's payment goes to interest
      const firstYearInterest = loanAmount * (loanDetails.interestRate / 100);
      const firstYearPrincipal = annualMortgage - firstYearInterest;
      // Simplified equity build calculation
      const equityBuild = firstYearPrincipal * Math.pow(1.05, year - 1) + 
        (currentPropertyValue - purchasePrice) * 0.1; // Simplified

      const totalReturn = cashFlow + equityBuild;

      results.push({
        year,
        grossRent: Math.round(grossRent),
        vacancy: Math.round(vacancy),
        effectiveGross: Math.round(effectiveGross),
        operatingExpenses: Math.round(operatingExpenses),
        noi: Math.round(noi),
        mortgage: Math.round(annualMortgage),
        cashFlow: Math.round(cashFlow),
        equityBuild: Math.round(equityBuild),
        totalReturn: Math.round(totalReturn),
      });
    }

    return results;
  }, [property, loanDetails, projectionYears, rentGrowthRate, appreciationRate]);

  // Summary metrics
  const summary = useMemo(() => {
    if (projections.length === 0) return null;

    const totalCashFlow = projections.reduce((sum, p) => sum + p.cashFlow, 0);
    const totalEquityBuild = projections.reduce((sum, p) => sum + p.equityBuild, 0);
    const avgCashFlow = totalCashFlow / projections.length;
    const cashOnCash = (avgCashFlow / (property?.listPrice || 1) * loanDetails.downPaymentPercent / 100) * 100;

    return {
      totalCashFlow,
      totalEquityBuild,
      totalReturn: totalCashFlow + totalEquityBuild,
      avgCashFlow,
      cashOnCash: Math.round(cashOnCash * 100) / 100,
    };
  }, [projections, property, loanDetails]);

  if (!property) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900 rounded-lg">
        <div className="text-center text-dark-400">
          <p className="text-lg mb-2">No property selected</p>
          <p className="text-sm">Select a property to view financial projections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">Financial Projections</h2>
          <p className="text-sm text-dark-400">{property.address}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Loan Details */}
        <div className="bg-dark-800 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Loan Assumptions
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-dark-500 block mb-1">Down Payment %</label>
              <input
                type="number"
                value={loanDetails.downPaymentPercent}
                onChange={(e) => setLoanDetails(prev => ({ ...prev, downPaymentPercent: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
              />
            </div>
            <div>
              <label className="text-xs text-dark-500 block mb-1">Interest Rate %</label>
              <input
                type="number"
                step="0.1"
                value={loanDetails.interestRate}
                onChange={(e) => setLoanDetails(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
              />
            </div>
            <div>
              <label className="text-xs text-dark-500 block mb-1">Loan Term (Years)</label>
              <input
                type="number"
                value={loanDetails.loanTermYears}
                onChange={(e) => setLoanDetails(prev => ({ ...prev, loanTermYears: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-dark-500 block mb-1">Rent Growth %</label>
              <input
                type="number"
                value={rentGrowthRate}
                onChange={(e) => setRentGrowthRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
              />
            </div>
            <div>
              <label className="text-xs text-dark-500 block mb-1">Appreciation %</label>
              <input
                type="number"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
              />
            </div>
            <div>
              <label className="text-xs text-dark-500 block mb-1">Years</label>
              <input
                type="number"
                max="10"
                value={projectionYears}
                onChange={(e) => setProjectionYears(Number(e.target.value))}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Total Cash Flow</p>
              <p className={clsx(
                'text-lg font-bold',
                summary.totalCashFlow > 0 ? 'text-emerald-400' : 'text-red-400'
              )}>
                ${summary.totalCashFlow.toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Equity Built</p>
              <p className="text-lg font-bold text-blue-400">
                ${summary.totalEquityBuild.toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Total Return</p>
              <p className="text-lg font-bold text-primary-400">
                ${summary.totalReturn.toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-3">
              <p className="text-xs text-dark-400">Cash-on-Cash</p>
              <p className="text-lg font-bold text-amber-400">
                {summary.cashOnCash.toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Projection Table */}
        <div className="bg-dark-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-dark-400">Year</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-dark-400">Gross Rent</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-dark-400">NOI</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-dark-400">Mortgage</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-dark-400">Cash Flow</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-dark-400">Equity</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-dark-400">Total Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {projections.map((proj) => (
                <tr key={proj.year} className="hover:bg-dark-700">
                  <td className="px-3 py-2 text-white font-medium">Year {proj.year}</td>
                  <td className="px-3 py-2 text-right text-white">${proj.grossRent.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-emerald-400">${proj.noi.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-dark-400">${proj.mortgage.toLocaleString()}</td>
                  <td className={clsx(
                    'px-3 py-2 text-right font-medium',
                    proj.cashFlow > 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    ${proj.cashFlow.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-blue-400">${proj.equityBuild.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-primary-400">${proj.totalReturn.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
