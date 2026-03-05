"use client";

import { useState, useCallback } from "react";

export interface WhatIfScenario {
  name: string;
  additions: {
    sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  improvements: {
    kitchen?: "basic" | "mid" | "high";
    bathrooms?: "basic" | "mid" | "high";
    flooring?: "basic" | "mid" | "high";
    hvac?: boolean;
    roof?: boolean;
    windows?: boolean;
  };
}

export interface PropertyMetrics {
  listPrice: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  arv: number;
  rehabBudget: number;
  holdingCosts: number;
  closingCosts: number;
  mao25k: number;
  mao50k: number;
  projectedProfit: number;
  roi: number;
  decision: "PASS" | "CAUTION" | "HARD_FAIL";
}

export interface ScenarioResult {
  scenario: WhatIfScenario;
  baseProperty: PropertyMetrics;
  projectedProperty: PropertyMetrics;
  comparison: {
    profitDifference: number;
    roiDifference: number;
    additionalInvestment: number;
    paybackRatio: number;
    recommendation: string;
  };
}

interface UseWhatIfAnalysisReturn {
  runScenario: (propertyId: string, scenario: WhatIfScenario) => Promise<ScenarioResult | null>;
  runAllScenarios: (propertyId: string) => Promise<{
    bestScenario: ScenarioResult;
    allScenarios: ScenarioResult[];
  } | null>;
  runCustomScenario: (
    propertyData: any,
    scenario: WhatIfScenario
  ) => Promise<ScenarioResult | null>;
  loading: boolean;
  error: string | null;
}

export function useWhatIfAnalysis(): UseWhatIfAnalysisReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScenario = useCallback(
    async (propertyId: string, scenario: WhatIfScenario): Promise<ScenarioResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analysis/what-if", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, scenario }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data.analysis;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const runAllScenarios = useCallback(
    async (
      propertyId: string
    ): Promise<{ bestScenario: ScenarioResult; allScenarios: ScenarioResult[] } | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analysis/what-if", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, runAllScenarios: true }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
          bestScenario: result.data.bestScenario,
          allScenarios: result.data.allScenarios,
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const runCustomScenario = useCallback(
    async (propertyData: any, scenario: WhatIfScenario): Promise<ScenarioResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analysis/what-if", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyData, scenario }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data.analysis;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    runScenario,
    runAllScenarios,
    runCustomScenario,
    loading,
    error,
  };
}

// Predefined scenarios for quick use
export const PREDEFINED_SCENARIOS: WhatIfScenario[] = [
  {
    name: "Add 200 sqft + 1 Bedroom",
    additions: { sqft: 200, bedrooms: 1, bathrooms: 0 },
    improvements: { kitchen: "mid", bathrooms: "mid", flooring: "mid" },
  },
  {
    name: "Add 400 sqft + 1 Bed/1 Bath",
    additions: { sqft: 400, bedrooms: 1, bathrooms: 1 },
    improvements: { kitchen: "mid", bathrooms: "mid", flooring: "mid" },
  },
  {
    name: "Add Master Suite (300sqft + Bath)",
    additions: { sqft: 300, bedrooms: 1, bathrooms: 1 },
    improvements: { kitchen: "high", bathrooms: "high", flooring: "mid" },
  },
  {
    name: "Luxury Full Renovation",
    additions: { sqft: 0, bedrooms: 0, bathrooms: 0 },
    improvements: {
      kitchen: "high",
      bathrooms: "high",
      flooring: "high",
      hvac: true,
      windows: true,
    },
  },
  {
    name: "Budget Refresh",
    additions: { sqft: 0, bedrooms: 0, bathrooms: 0 },
    improvements: { kitchen: "basic", bathrooms: "basic", flooring: "basic" },
  },
];
