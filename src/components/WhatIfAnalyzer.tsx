"use client";

import { useState } from "react";
import {
  useWhatIfAnalysis,
  PREDEFINED_SCENARIOS,
  ScenarioResult,
} from "@/lib/ai/useWhatIfAnalysis";

interface WhatIfAnalyzerProps {
  propertyId: string;
  propertyAddress: string;
}

export default function WhatIfAnalyzer({
  propertyId,
  propertyAddress,
}: WhatIfAnalyzerProps) {
  const { runAllScenarios, runCustomScenario, loading, error } = useWhatIfAnalysis();
  const [results, setResults] = useState<ScenarioResult[] | null>(null);
  const [bestScenario, setBestScenario] = useState<ScenarioResult | null>(null);
  const [customSqft, setCustomSqft] = useState(200);
  const [customBedrooms, setCustomBedrooms] = useState(1);
  const [customBathrooms, setCustomBathrooms] = useState(0.5);

  const handleRunAllScenarios = async () => {
    const result = await runAllScenarios(propertyId);
    if (result) {
      setResults(result.allScenarios);
      setBestScenario(result.bestScenario);
    }
  };

  const handleRunCustomScenario = async () => {
    const scenario = {
      name: `Custom: +${customSqft}sqft +${customBedrooms}bd +${customBathrooms}ba`,
      additions: {
        sqft: customSqft,
        bedrooms: customBedrooms,
        bathrooms: customBathrooms,
      },
      improvements: {
        kitchen: "mid" as const,
        bathrooms: "mid" as const,
        flooring: "mid" as const,
      },
    };
    const result = await runCustomScenario(
      { id: propertyId, address: propertyAddress },
      scenario
    );
    if (result) {
      setResults([result]);
      setBestScenario(result);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        What-If Renovation Analysis
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Model different renovation scenarios to maximize your flip profit
      </p>

      {/* Custom Scenario Builder */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">Custom Scenario</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Add Sqft
            </label>
            <input
              type="number"
              value={customSqft}
              onChange={(e) => setCustomSqft(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              step="50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Add Bedrooms
            </label>
            <input
              type="number"
              value={customBedrooms}
              onChange={(e) => setCustomBedrooms(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              min="0"
              max="3"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Add Bathrooms
            </label>
            <input
              type="number"
              value={customBathrooms}
              onChange={(e) => setCustomBathrooms(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              step="0.5"
              min="0"
              max="2"
            />
          </div>
        </div>
        <button
          onClick={handleRunCustomScenario}
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Custom Analysis"}
        </button>
      </div>

      {/* Quick Scenarios */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">Quick Scenarios</h3>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_SCENARIOS.map((scenario) => (
            <button
              key={scenario.name}
              onClick={async () => {
                const result = await runCustomScenario(
                  { id: propertyId, address: propertyAddress },
                  scenario
                );
                if (result) {
                  setResults([result]);
                  setBestScenario(result);
                }
              }}
              disabled={loading}
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 disabled:opacity-50"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Run All Button */}
      <button
        onClick={handleRunAllScenarios}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 mb-6"
      >
        {loading ? "Analyzing All Scenarios..." : "Compare All Scenarios"}
      </button>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
          Error: {error}
        </div>
      )}

      {/* Results */}
      {bestScenario && (
        <div className="border-t border-slate-200 pt-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-emerald-900 mb-2">
              Best Scenario: {bestScenario.scenario.name}
            </h3>
            <p className="text-sm text-emerald-800 mb-3">
              {bestScenario.comparison.recommendation}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-emerald-600">Projected Profit:</span>
                <span className="font-bold text-emerald-900 ml-2">
                  {formatCurrency(bestScenario.projectedProperty.projectedProfit)}
                </span>
              </div>
              <div>
                <span className="text-emerald-600">ROI:</span>
                <span className="font-bold text-emerald-900 ml-2">
                  {formatPercent(bestScenario.projectedProperty.roi)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-semibold text-slate-700">
                  Scenario
                </th>
                <th className="text-right py-2 font-semibold text-slate-700">
                  Add. Investment
                </th>
                <th className="text-right py-2 font-semibold text-slate-700">
                  New ARV
                </th>
                <th className="text-right py-2 font-semibold text-slate-700">
                  Profit
                </th>
                <th className="text-right py-2 font-semibold text-slate-700">
                  Payback
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 ${
                    bestScenario?.scenario.name === result.scenario.name
                      ? "bg-emerald-50"
                      : ""
                  }`}
                >
                  <td className="py-2 text-slate-800">{result.scenario.name}</td>
                  <td className="text-right py-2 text-slate-600">
                    {formatCurrency(result.comparison.additionalInvestment)}
                  </td>
                  <td className="text-right py-2 text-slate-600">
                    {formatCurrency(result.projectedProperty.arv)}
                  </td>
                  <td className="text-right py-2">
                    <span
                      className={
                        result.projectedProperty.projectedProfit > 0
                          ? "text-emerald-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {formatCurrency(result.projectedProperty.projectedProfit)}
                    </span>
                  </td>
                  <td className="text-right py-2">
                    <span
                      className={`font-medium ${
                        result.comparison.paybackRatio > 1.5
                          ? "text-emerald-600"
                          : result.comparison.paybackRatio > 1
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.comparison.paybackRatio.toFixed(2)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Base vs Projected Comparison */}
      {bestScenario && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-700 mb-2">Current (As-Is)</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">ARV:</span>
                <span className="font-medium">
                  {formatCurrency(bestScenario.baseProperty.arv)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rehab:</span>
                <span className="font-medium">
                  {formatCurrency(bestScenario.baseProperty.rehabBudget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Profit:</span>
                <span className="font-medium">
                  {formatCurrency(bestScenario.baseProperty.projectedProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">MAO (25k):</span>
                <span className="font-medium">
                  {formatCurrency(bestScenario.baseProperty.mao25k)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2">With Additions</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-600">ARV:</span>
                <span className="font-medium text-emerald-900">
                  {formatCurrency(bestScenario.projectedProperty.arv)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-600">Total Rehab:</span>
                <span className="font-medium text-emerald-900">
                  {formatCurrency(bestScenario.projectedProperty.rehabBudget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-600">Profit:</span>
                <span className="font-medium text-emerald-900">
                  {formatCurrency(bestScenario.projectedProperty.projectedProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-600">MAO (25k):</span>
                <span className="font-medium text-emerald-900">
                  {formatCurrency(bestScenario.projectedProperty.mao25k)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
