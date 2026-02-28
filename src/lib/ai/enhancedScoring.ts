/**
 * Enhanced AI Scoring Engine - Phase 4: Multimodal AI Integration
 * Persona: East Texas Deal Inspector
 */

import { Decision, Strategy } from "@/data/properties";
import { KnowledgeBundle } from "../knowledgeBundle";
import {
  runPreflightGate,
  calculateMAO,
  calculateHoldingCosts,
} from "../calculations";

export interface AIAnalysisResult {
  narrative: string;
  data: {
    mao25k: number;
    mao50k: number;
    rehabEstimate: number;
    rehabTier: "Light" | "Standard" | "Heavy" | "Down to Studs";
    arv: number;
    decision: Decision;
    confidence: number;
  };
}

/**
 * East Texas Deal Inspector Persona & Hard Rules
 */
const SYSTEM_PROMPT = `
You are the "East Texas Deal Inspector," an institutional-grade fix-and-flip analyzer specializing in the East Texas market (Tyler, Longview, Marshall, etc.).

HARD RULES:
1. RULE 1 (Flipping Only): You ONLY analyze properties for retail flip potential. Ignore all rental metrics.
2. RULE 2 (Visual Evidence): Analyze the provided images for signals of structural or mechanical distress (roof age, foundation cracks, outdated electrical). Adjust rehab tier accordingly.
3. RULE 3 (Knowledge Base Priority): You MUST use the exact Comps, Velocity, and Rehab Catalog provided in the context. Never fabricate market data.
4. RULE 6 (Output Format): Your response must follow this EXACT structure:
   PART A: Plain text narrative (No markdown, no bolding, no lists).
   Sections: Decision Line, Executive Summary, OBSERVED, DERIVED, POLICY, OPINION.
   PART B: A valid JSON block containing the schema fields.

PERSONA: You are skeptical, precise, and prioritize capital preservation.
`;

/**
 * RAG Context Injection
 */
function getRAGContext(zip: string, sqft: number, priceBand: string) {
  const comps = KnowledgeBundle.getSoldComps(zip, sqft);
  const velocity = KnowledgeBundle.getMarketVelocity(zip, priceBand);
  const arvSummary = KnowledgeBundle.getArvSummary(zip);
  const rehabCatalog = KnowledgeBundle.getRehabCatalog();

  return `
KNOWLEDGE BASE CONTEXT:
- SOLD COMPS (Last 6-12mo): ${JSON.stringify(comps)}
- MARKET VELOCITY: ${JSON.stringify(velocity)}
- ARV SUMMARY (P50): ${arvSummary?.arv_p50 || "N/A"}
- REHAB CATALOG: ${JSON.stringify(rehabCatalog)}
`;
}

/**
 * Parser for Rule 6
 */
export function parseAIResponse(response: string): AIAnalysisResult {
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid AI response: Missing JSON block (Part B)");
  }

  const narrative = response.replace(jsonMatch[0], "").trim();
  const data = JSON.parse(jsonMatch[0]);

  return {
    narrative,
    data,
  };
}

/**
 * Main Analysis Entry Point (Simulated for Phase 4)
 */
export async function analyzePropertyFlip(property: {
  address: string;
  zip: string;
  sqft: number;
  listPrice: number;
  images: string[];
}): Promise<AIAnalysisResult> {
  // 1. Fetch Knowledge Base Context
  const context = getRAGContext(property.zip, property.sqft, "Standard");
  const velocity = KnowledgeBundle.getMarketVelocity(property.zip, "Standard");
  const arvData = KnowledgeBundle.getArvSummary(property.zip);

  // 2. Preflight Gate
  const gateResult = runPreflightGate(
    { listPrice: property.listPrice, afterRepairValue: arvData?.arv_p50 || 0 },
    velocity,
  );

  if (gateResult?.decision === "HARD_FAIL") {
    return {
      narrative: `HARD_FAIL: ${gateResult.rationale}`,
      data: {
        mao25k: 0,
        mao50k: 0,
        rehabEstimate: 0,
        rehabTier: "Standard",
        arv: arvData?.arv_p50 || 0,
        decision: "HARD_FAIL",
        confidence: 1.0,
      },
    };
  }

  // 3. (In real implementation, call LLM with SYSTEM_PROMPT + context + property images)
  // For now, we simulate the calculation logic based on Rules 3 & 4
  const arv = arvData?.arv_p50 || 0;
  const rehabBudget = property.sqft * 35; // Standard tier fallback
  const holding = calculateHoldingCosts(arv, velocity?.median_dom || 0);

  const mao25k = calculateMAO(arv, rehabBudget, holding.cost, 25000);
  const mao50k = calculateMAO(arv, rehabBudget, holding.cost, 50000);

  return {
    narrative: `DECISION LINE: ${gateResult?.decision || "PASS"}
EXECUTIVE SUMMARY: Property matches institutional buy parameters for East Texas.
OBSERVED: List price $${property.listPrice}, Sqft ${property.sqft}.
DERIVED: ARV $${arv} based on local zip code P50.
POLICY: Institutional 8% closing and 20% rehab contingency applied.
OPINION: Strong potential if purchased near MAO.`,
    data: {
      mao25k,
      mao50k,
      rehabEstimate: rehabBudget,
      rehabTier: "Standard",
      arv,
      decision: (gateResult?.decision as Decision) || "PASS",
      confidence: 0.85,
    },
  };
}
