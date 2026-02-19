'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar, { ViewType } from '@/components/Sidebar';
import { useProperties, PropertyWithCalculations } from '@/context/PropertyContext';
import ValueScatterPlot from '@/components/ValueScatterPlot';
import StrategyKanban from '@/components/StrategyKanban';
import PropertyDataTable from '@/components/PropertyDataTable';

// Dynamic import for the map component - critical for bundle size optimization
// Heavy mapping libraries (like Leaflet) shouldn't block initial page load
const OpportunityMap = dynamic(() => import('@/components/OpportunityMap'), {
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
  const { properties, loading, error, toggleFavorite, isFavorite } = useProperties();
  
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithCalculations | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter properties based on search query
  // Uses useMemo to prevent expensive re-renders when only selectedProperty changes
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;

    const lower = searchQuery.toLowerCase();
    return properties.filter(p =>
       p.address.toLowerCase().includes(lower) ||
       p.rationale.toLowerCase().includes(lower) ||
       p.city.toLowerCase().includes(lower) ||
       (p.details?.toLowerCase().includes(lower) ?? false)
    );
  }, [searchQuery, properties]);

  // Calculate stats for sidebar
  const stats = useMemo(() => {
    return {
      total: filteredProperties.length,
      platinum: filteredProperties.filter(p => p.decision === 'Pass Platinum').length,
    };
  }, [filteredProperties]);

  const handlePropertyClick = (property: PropertyWithCalculations) => {
    setSelectedProperty(property);
  };

  const renderView = () => {
    // Show loading skeleton for table view
    if (loading && currentView === 'table') {
      return <PropertyTableSkeleton />;
    }
    
    switch (currentView) {
      case 'map': 
        return <OpportunityMap properties={filteredProperties} onPropertyClick={handlePropertyClick} />;
      case 'scatter': 
        return <ValueScatterPlot properties={filteredProperties} onPropertyClick={handlePropertyClick} />;
      case 'kanban': 
        return <StrategyKanban properties={filteredProperties} onPropertyClick={handlePropertyClick} />;
      case 'table': 
        return (
          <PropertyDataTable 
            properties={filteredProperties} 
            onPropertyClick={handlePropertyClick}
            onToggleFavorite={toggleFavorite}
            getIsFavorite={isFavorite}
          />
        );
      default: 
        return null;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'map': return 'Geospatial Opportunity Map';
      case 'scatter': return 'Value Analysis Scatter Plot';
      case 'kanban': return 'Strategy Workflow Board';
      case 'table': return 'Interactive Data Grid';
      default: return '';
    }
  };

  const getViewDescription = () => {
    switch (currentView) {
      case 'map': return 'Color-coded markers indicate deal quality. Click markers for property details.';
      case 'scatter': return 'Identify value opportunities below the average price/sqft trend line.';
      case 'kanban': return 'Properties organized by investment strategy with equity gap analysis.';
      case 'table': return 'Sort, filter, and analyze properties with computed investment metrics.';
      default: return '';
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-dark-950 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Properties</h2>
          <p className="text-dark-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-950">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        propertyCount={stats.total}
        platinumCount={stats.platinum}
      />
      <main className={`flex-1 overflow-hidden ${isMobile ? 'pt-0' : 'ml-64 p-6'}`}>
        <div className={`${isMobile ? 'p-4' : 'mb-6'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{getViewTitle()}</h1>
              <p className="text-dark-400 mt-1 text-sm md:text-base">{getViewDescription()}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-xs md:text-sm text-dark-400">
                Source: Live Database
              </div>
              {loading && (
                <div className="text-xs md:text-sm text-blue-400 animate-pulse">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`${isMobile ? 'h-[calc(100vh-180px)] px-4 pb-4' : 'h-[calc(100vh-180px)]'}`}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

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
