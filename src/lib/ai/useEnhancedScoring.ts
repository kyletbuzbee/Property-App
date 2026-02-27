/**
 * Enhanced Scoring Hook
 * Provides integration between enhanced scoring engine and external data APIs
 * 
 * Features:
 * - Automatic property enrichment
 * - Cached API responses
 * - Progress tracking for batch operations
 * - Fallback to local scoring when APIs unavailable
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { PropertyWithCalculations } from '@/lib/calculations';
import { calculateEnhancedScore, EnhancedScoringResult, PropertyMetrics } from './enhancedScoring';
import { fetchPropertyEnrichment, enrichmentToNeighborhoodScore, PropertyEnrichmentData } from './externalAPIs';

interface UseEnhancedScoringOptions {
  enableEnrichment?: boolean;
  onProgress?: (completed: number, total: number) => void;
}

interface UseEnhancedScoringReturn {
  scoredProperties: ScoredProperty[];
  isLoading: boolean;
  error: string | null;
  enrichProperty: (property: PropertyWithCalculations) => Promise<EnhancedScoringResult>;
  refreshScores: () => void;
}

interface ScoredProperty extends PropertyWithCalculations {
  enhancedScore: number;
  riskLevel: string;
  riskColor: string;
  enrichmentData?: PropertyEnrichmentData;
  factorScores: EnhancedScoringResult['factorScores'];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

/**
 * Convert PropertyWithCalculations to PropertyMetrics for enhanced scoring
 */
function toPropertyMetrics(property: PropertyWithCalculations): PropertyMetrics {
  return {
    // Financial metrics
    capRate: property.capRate ?? 0,
    cashOnCashReturn: property.cashOnCashReturn ?? 0,
    grossYield: property.grossYield ?? 0,
    pricePerSqft: property.pricePerSqft ?? 0,
    pricePerDoor: property.pricePerDoor ?? 0,
    onePercentRule: property.onePercentRule ?? false,
    equityGap: property.equityGap ?? 0,
    cashFlow: 0, // Will be calculated in enhanced scoring
    noi: 0, // Will be calculated in enhanced scoring
    
    // Property characteristics
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    sqft: property.sqft ?? 0,
    listPrice: property.listPrice ?? 0,
    
    // Location data
    city: property.city ?? '',
    state: property.state ?? '',
    lat: property.lat ?? 0,
    lng: property.lng ?? 0,
    
    // Decision/Strategy
    decision: property.decision ?? 'Caution',
    strategy: (property.strategy as 'BRRR' | 'Retail Flip' | 'Section 8' | 'Owner Finance' | 'Wholesaling') ?? 'Retail Flip',
  };
}

/**
 * Enhanced scoring hook for React components
 */
export function useEnhancedScoring(
  properties: PropertyWithCalculations[],
  options: UseEnhancedScoringOptions = {}
): UseEnhancedScoringReturn {
  const { enableEnrichment = true, onProgress } = options;
  
  const [scoredProperties, setScoredProperties] = useState<ScoredProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrichmentCache, setEnrichmentCache] = useState<Map<string, PropertyEnrichmentData>>(new Map());

  // Calculate enhanced scores
  const calculateScores = useCallback(async (props: PropertyWithCalculations[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const results: ScoredProperty[] = [];

      for (let i = 0; i < props.length; i++) {
        const property = props[i];
        
        // Get or fetch enrichment data
        let enrichmentData: PropertyEnrichmentData | undefined;
        
        if (enableEnrichment) {
          const cacheKey = `${property.city}-${property.lat}-${property.lng}`;
          
          // Check cache first
          if (enrichmentCache.has(cacheKey)) {
            enrichmentData = enrichmentCache.get(cacheKey);
          } else {
            // Fetch enrichment data
            try {
              enrichmentData = await fetchPropertyEnrichment({
                id: property.id,
                address: property.address,
                city: property.city,
                state: property.state,
                zip: property.zip,
                lat: property.lat,
                lng: property.lng,
                listPrice: property.listPrice,
                equityGap: property.equityGap,
                sqft: property.sqft,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                decision: property.decision as any,
                strategy: property.strategy as any,
                rationale: '',
                type: '',
                realtor: '',
                url: '',
                details: '',
                images: [],
                estimatedRent: property.estimatedRent,
                annualTaxes: property.annualTaxes,
                annualInsurance: property.annualInsurance,
                renovationBudget: property.renovationBudget,
                afterRepairValue: property.afterRepairValue,
                notes: '',
                createdAt: '',
                updatedAt: '',
              });
              
              // Update cache
              setEnrichmentCache(prev => new Map(prev).set(cacheKey, enrichmentData!));
            } catch (enrichError) {
              console.warn('[EnhancedScoring] Failed to fetch enrichment:', enrichError);
            }
          }
        }

        // Convert property to metrics
        const metrics = toPropertyMetrics(property);
        
        // Get neighborhood scores from enrichment
        const neighborhoodData = enrichmentData 
          ? enrichmentToNeighborhoodScore(enrichmentData)
          : undefined;

        // Calculate enhanced score
        const scoreResult = calculateEnhancedScore(metrics, neighborhoodData);

        // Combine with original property
        results.push({
          ...property,
          enhancedScore: scoreResult.overallScore,
          riskLevel: scoreResult.riskLevel,
          riskColor: scoreResult.riskColor,
          enrichmentData,
          factorScores: scoreResult.factorScores,
          recommendations: scoreResult.recommendations,
          strengths: scoreResult.strengths,
          weaknesses: scoreResult.weaknesses,
        });

        // Report progress
        if (onProgress) {
          onProgress(i + 1, props.length);
        }
      }

      // Sort by enhanced score (descending)
      results.sort((a, b) => b.enhancedScore - a.enhancedScore);
      
      setScoredProperties(results);
    } catch (err) {
      console.error('[EnhancedScoring] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate scores');
      
      // Fallback to basic scores
      const basicResults = props.map(property => ({
        ...property,
        enhancedScore: property.dealScore,
        riskLevel: property.riskLevel ?? 'Unknown',
        riskColor: '#64748b',
        factorScores: [],
        recommendations: [],
        strengths: [],
        weaknesses: [],
      }));
      setScoredProperties(basicResults);
    } finally {
      setIsLoading(false);
    }
  }, [enableEnrichment, enrichmentCache, onProgress]);

  // Calculate scores when properties change
  useEffect(() => {
    if (properties && properties.length > 0) {
      calculateScores(properties);
    }
  }, [properties, calculateScores]);

  // Enrich a single property manually
  const enrichProperty = useCallback(async (property: PropertyWithCalculations): Promise<EnhancedScoringResult> => {
    const metrics = toPropertyMetrics(property);
    
    // Fetch enrichment data
    let enrichmentData: PropertyEnrichmentData | undefined;
    try {
      enrichmentData = await fetchPropertyEnrichment({
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip,
        lat: property.lat,
        lng: property.lng,
        listPrice: property.listPrice,
        equityGap: property.equityGap,
        sqft: property.sqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        decision: property.decision as any,
        strategy: property.strategy as any,
        rationale: '',
        type: '',
        realtor: '',
        url: '',
        details: '',
        images: [],
        estimatedRent: property.estimatedRent,
        annualTaxes: property.annualTaxes,
        annualInsurance: property.annualInsurance,
        renovationBudget: property.renovationBudget,
        afterRepairValue: property.afterRepairValue,
        notes: '',
        createdAt: '',
        updatedAt: '',
      });
    } catch (err) {
      console.warn('[EnhancedScoring] Enrichment failed:', err);
    }

    const neighborhoodData = enrichmentData 
      ? enrichmentToNeighborhoodScore(enrichmentData)
      : undefined;

    return calculateEnhancedScore(metrics, neighborhoodData);
  }, []);

  // Refresh scores
  const refreshScores = useCallback(() => {
    if (properties && properties.length > 0) {
      calculateScores(properties);
    }
  }, [properties, calculateScores]);

  return {
    scoredProperties,
    isLoading,
    error,
    enrichProperty,
    refreshScores,
  };
}

export type { ScoredProperty, UseEnhancedScoringReturn };
