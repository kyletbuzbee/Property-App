import { NextRequest, NextResponse } from "next/server";
import {
  runWhatIfAnalysis,
  findBestScenario,
  generateCommonScenarios,
  WhatIfScenario,
} from "@/lib/ai/whatIfAnalysis";
import { properties as localProperties } from "@/data/properties";

/**
 * POST /api/analysis/what-if
 * Run what-if scenario analysis for a property
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyId,
      // Or provide property data directly
      propertyData,
      // Scenario to analyze
      scenario,
      // Or run all common scenarios
      runAllScenarios = false,
      // Or run multiple custom scenarios
      scenarios,
    } = body;

    // Get property data
    let property;
    if (propertyId) {
      property = localProperties.find((p) => p.id === propertyId);
      if (!property) {
        return NextResponse.json(
          { success: false, error: "Property not found" },
          { status: 404 }
        );
      }
    } else if (propertyData) {
      property = propertyData;
    } else {
      return NextResponse.json(
        { success: false, error: "Property ID or property data required" },
        { status: 400 }
      );
    }

    const baseProperty = {
      listPrice: property.listPrice,
      sqft: property.sqft,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      zip: property.zip,
      annualTaxes: property.annualTaxes,
      annualInsurance: property.annualInsurance,
    };

    // Run analysis based on request type
    if (runAllScenarios) {
      // Run all common predefined scenarios
      const commonScenarios = generateCommonScenarios();
      const { bestScenario, allResults } = findBestScenario(
        baseProperty,
        commonScenarios
      );

      return NextResponse.json({
        success: true,
        data: {
          property: {
            id: property.id,
            address: property.address,
            city: property.city,
            listPrice: property.listPrice,
            sqft: property.sqft,
          },
          bestScenario,
          allScenarios: allResults,
          scenarioCount: allResults.length,
        },
      });
    } else if (scenarios && Array.isArray(scenarios)) {
      // Run multiple custom scenarios
      const { bestScenario, allResults } = findBestScenario(
        baseProperty,
        scenarios
      );

      return NextResponse.json({
        success: true,
        data: {
          property: {
            id: property.id,
            address: property.address,
            city: property.city,
          },
          bestScenario,
          allScenarios: allResults,
        },
      });
    } else if (scenario) {
      // Run single scenario
      const result = runWhatIfAnalysis(baseProperty, scenario);

      return NextResponse.json({
        success: true,
        data: {
          property: {
            id: property.id,
            address: property.address,
            city: property.city,
          },
          analysis: result,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Scenario, scenarios, or runAllScenarios required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("What-If Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run what-if analysis" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analysis/what-if/scenarios
 * Get list of predefined common scenarios
 */
export async function GET() {
  const scenarios = generateCommonScenarios();
  return NextResponse.json({
    success: true,
    data: scenarios,
  });
}
