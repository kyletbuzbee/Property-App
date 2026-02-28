"use client";

import { useState, useCallback } from "react";
import { Decision, Strategy } from "@/data/properties";
import { PropertyWithCalculations } from "@/lib/calculations";
import { analyzePropertyFlip, AIAnalysisResult } from "./enhancedScoring";

interface UseEnhancedScoringReturn {
  analyze: (
    property: PropertyWithCalculations,
  ) => Promise<AIAnalysisResult | null>;
  isAnalyzing: boolean;
  error: string | null;
}

export function useEnhancedScoring(): UseEnhancedScoringReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (
      property: PropertyWithCalculations,
    ): Promise<AIAnalysisResult | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await analyzePropertyFlip({
          address: property.address,
          zip: property.zip,
          sqft: property.sqft,
          listPrice: property.listPrice,
          images: property.images || [],
        });

        // Update the property in the database via API
        await fetch(`/api/properties`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: property.id,
            decision: result.data.decision,
            rationale: result.narrative,
            afterRepairValue: result.data.arv,
            mao25k: result.data.mao25k,
            mao50k: result.data.mao50k,
            renovationBudget: result.data.rehabEstimate,
            rehabTier: result.data.rehabTier,
            dealScore: result.data.confidence * 100,
          }),
        });

        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Analysis failed";
        setError(msg);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  return {
    analyze,
    isAnalyzing,
    error,
  };
}
