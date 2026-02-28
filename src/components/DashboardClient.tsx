"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar, { ViewType } from "@/components/Sidebar";
import {
  useProperties,
  PropertyWithCalculations,
} from "@/context/PropertyContext";
import ValueScatterPlot from "@/components/ValueScatterPlot";
import StrategyKanban from "@/components/StrategyKanban";
import PropertyDataTable from "@/components/PropertyDataTable";
import PortfolioTracker from "@/components/PortfolioTracker";
import ExpenseTracker from "@/components/ExpenseTracker";
import TaskManager from "@/components/TaskManager";
import ProjectTimeline from "@/components/ProjectTimeline";
import RehabEstimator from "@/components/RehabEstimator";
import RentComps from "@/components/RentComps";
import PropertyComparator from "@/components/PropertyComparator";
import FinancialProjections from "@/components/FinancialProjections";
import MarketAnalysis from "@/components/MarketAnalysis";
import AIDealScoring from "@/components/AIDealScoring";
import ExportReports from "@/components/ExportReports";
import CollaborationHub from "@/components/CollaborationHub";

// Dynamic import for the map component - critical for bundle size optimization
// Heavy mapping libraries (like Leaflet) shouldn't block initial page load
const OpportunityMap = dynamic(() => import("@/components/OpportunityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-dark-800 animate-pulse rounded-lg" />
  ),
});

/**
 * DashboardClient Component
 *
 * Main dashboard that displays property data in various views.
 * Uses PropertyContext for data - no longer receives initialProperties as props
 * to avoid the "double fetch" pattern.
 */
export default function DashboardClient() {
  // Get properties from context (initialized with server-side data)
  const { properties, loading, error, toggleFavorite, isFavorite } =
    useProperties();

  const [currentView, setCurrentView] = useState<ViewType>("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithCalculations | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter properties based on search query
  // Uses useMemo to prevent expensive re-renders when only selectedProperty changes
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;

    const lower = searchQuery.toLowerCase();
    return properties.filter(
      (p) =>
        p.address.toLowerCase().includes(lower) ||
        p.rationale.toLowerCase().includes(lower) ||
        p.city.toLowerCase().includes(lower) ||
        (p.details?.toLowerCase().includes(lower) ?? false),
    );
  }, [searchQuery, properties]);

  // Calculate stats for sidebar
  const stats = useMemo(() => {
    return {
      total: filteredProperties.length,
      platinum: filteredProperties.filter((p) => p.decision === "Pass Platinum")
        .length,
    };
  }, [filteredProperties]);

  const handlePropertyClick = (property: PropertyWithCalculations) => {
    setSelectedProperty(property);
  };

  const renderView = () => {
    // Show loading skeleton for table view
    if (loading && currentView === "table") {
      return <PropertyTableSkeleton />;
    }

    switch (currentView) {
      case "map":
        return (
          <OpportunityMap
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case "scatter":
        return (
          <ValueScatterPlot
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case "kanban":
        return (
          <StrategyKanban
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case "table":
        return (
          <PropertyDataTable
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
            onToggleFavorite={toggleFavorite}
            getIsFavorite={isFavorite}
          />
        );
      case "portfolio":
        return <PortfolioTracker properties={filteredProperties} />;
      case "expenses":
        return <ExpenseTracker budget={0} />;
      case "tasks":
        return <TaskManager propertyId={filteredProperties[0]?.id || ""} />;
      case "timeline":
        return <ProjectTimeline properties={filteredProperties} />;
      case "rehab":
        return <RehabEstimator property={filteredProperties[0] || null} />;
      case "rentComps":
        return <RentComps property={filteredProperties[0] || null} />;
      case "comparator":
        return <PropertyComparator properties={filteredProperties} />;
      case "projections":
        return (
          <FinancialProjections property={filteredProperties[0] || null} />
        );
      case "market":
        return <MarketAnalysis properties={filteredProperties} />;
      case "ai":
        return <AIDealScoring properties={filteredProperties} />;
      case "export":
        return <ExportReports properties={filteredProperties} />;
      case "collaboration":
        return <CollaborationHub properties={filteredProperties} />;
      default:
        return null;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case "map":
        return "Geospatial Opportunity Map";
      case "scatter":
        return "Value Analysis Scatter Plot";
      case "kanban":
        return "Strategy Workflow Board";
      case "table":
        return "Interactive Data Grid";
      case "portfolio":
        return "Portfolio Tracker";
      case "expenses":
        return "Expense Tracker";
      case "tasks":
        return "Task Manager";
      case "timeline":
        return "Project Timeline";
      case "rehab":
        return "Rehab Estimator";
      case "rentComps":
        return "Rent Comps";
      case "comparator":
        return "Property Comparator";
      case "projections":
        return "Financial Projections";
      case "market":
        return "Market Analysis";
      case "ai":
        return "AI Deal Scoring";
      case "export":
        return "Export Reports";
      case "collaboration":
        return "Collaboration Hub";
      default:
        return "";
    }
  };

  const getViewDescription = () => {
    switch (currentView) {
      case "map":
        return "Color-coded markers indicate deal quality. Click markers for property details.";
      case "scatter":
        return "Identify value opportunities below the average price/sqft trend line.";
      case "kanban":
        return "Properties organized by investment strategy with equity gap analysis.";
      case "table":
        return "Sort, filter, and analyze properties with computed investment metrics.";
      case "portfolio":
        return "Track your owned properties and their performance metrics.";
      case "expenses":
        return "Track and manage property-related expenses and budgets.";
      case "tasks":
        return "Manage tasks and to-dos for your investment projects.";
      case "timeline":
        return "View project timelines and milestones for all properties.";
      case "rehab":
        return "Estimate renovation costs and scope for properties.";
      case "rentComps":
        return "Compare rental rates in the area to estimate potential income.";
      case "comparator":
        return "Compare multiple properties side-by-side to find the best deal.";
      case "projections":
        return "View financial projections and cash flow forecasts.";
      case "market":
        return "Analyze market trends and property values in your target areas.";
      case "ai":
        return "AI-powered deal scoring and investment recommendations.";
      case "export":
        return "Export property data and reports in various formats.";
      case "collaboration":
        return "Collaborate with team members on investment deals.";
      default:
        return "";
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-institutional-bg items-center justify-center">
        <div className="text-center bento-card">
          <ExclamationTriangleIcon className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Audit System Offline
          </h2>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-institutional-bg">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        propertyCount={stats.total}
        platinumCount={stats.platinum}
      />
      <main
        className={`flex-1 overflow-hidden transition-all duration-300 ${isMobile ? "pt-0" : "ml-64 p-6"}`}
      >
        <div className={`${isMobile ? "p-4" : "mb-6"}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {getViewTitle()}
              </h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">
                {getViewDescription()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 border border-slate-200 rounded-sm">
                System Status: <span className="text-success">Operational</span>
              </div>
              {loading && (
                <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest animate-pulse">
                  Querying Bundle...
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${isMobile ? "h-[calc(100vh-180px)] px-4 pb-4" : "h-[calc(100vh-180px)]"}`}
        >
          {renderView()}
        </div>
      </main>
    </div>
  );
}

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/**
 * Skeleton component for the property table.
 * Shows shimmering rows to maintain layout integrity during loading.
 */
function PropertyTableSkeleton() {
  return (
    <div className="w-full h-full bg-dark-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-dark-700">
        <div className="h-6 w-48 bg-dark-700 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-dark-700">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="h-4 w-32 bg-dark-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-dark-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-dark-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-dark-700 rounded animate-pulse" />
            <div className="h-4 w-28 bg-dark-700 rounded animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
