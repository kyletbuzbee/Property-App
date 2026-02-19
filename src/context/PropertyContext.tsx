'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { 
  Decision, 
  Strategy, 
} from '@/data/properties';
import { 
  PropertyWithCalculations, 
  PropertyBase,
  addCalculations 
} from '@/lib/calculations';

// Re-export for convenience
export type { PropertyWithCalculations } from '@/lib/calculations';

interface PropertyContextType {
  properties: PropertyWithCalculations[];
  loading: boolean;
  error: string | null;
  selectedProperty: PropertyWithCalculations | null;
  filters: PropertyFilters;
  setSelectedProperty: (property: PropertyWithCalculations | null) => void;
  setFilters: (filters: PropertyFilters) => void;
  refreshProperties: () => Promise<void>;
  updateProperty: (id: string, data: Partial<PropertyBase>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addProperty: (property: Omit<PropertyBase, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getPropertyById: (id: string) => PropertyWithCalculations | undefined;
  getPropertiesByStrategy: (strategy: Strategy) => PropertyWithCalculations[];
  getPropertiesByDecision: (decision: Decision) => PropertyWithCalculations[];
  searchProperties: (query: string) => PropertyWithCalculations[];
  // Favorites/Watchlist
  favoriteProperties: PropertyWithCalculations[];
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

interface PropertyFilters {
  search: string;
  strategy: Strategy | '';
  decision: Decision | '';
  city: string;
  minPrice: number;
  maxPrice: number;
  minEquity: number;
}

const defaultFilters: PropertyFilters = {
  search: '',
  strategy: '',
  decision: '',
  city: '',
  minPrice: 0,
  maxPrice: Infinity,
  minEquity: 0,
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
  /** 
   * Initial data from server-side rendering.
   * When provided, the context will skip the initial fetch and use this data instead,
   * eliminating the "double fetch" pattern.
   */
  initialData?: PropertyWithCalculations[];
}

export function PropertyProvider({ children, initialData }: PropertyProviderProps) {
  // Initialize with server-side data if provided, otherwise empty array
  const [properties, setProperties] = useState<PropertyWithCalculations[]>(initialData ?? []);
  // Start loading as false if we have initial data
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithCalculations | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  
  // Track if this is the first render to avoid double fetch
  const isInitialMount = useRef(true);
  // Track if we have initial data to skip first fetch
  const hasInitialData = useRef(!!initialData);

  const fetchProperties = useCallback(async (currentFilters: PropertyFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.strategy) params.append('strategy', currentFilters.strategy);
      if (currentFilters.decision) params.append('decision', currentFilters.decision);
      if (currentFilters.city) params.append('city', currentFilters.city);

      const response = await fetch(`/api/properties?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();
      let fetchedProperties = data.data as PropertyWithCalculations[];

      // Apply client-side filters for min/max price and equity
      // This is a pragmatic choice for smaller datasets - allows instant UI updates
      // on price sliders without hitting the database
      if (currentFilters.minPrice > 0) {
        fetchedProperties = fetchedProperties.filter(p => p.listPrice >= currentFilters.minPrice);
      }
      if (currentFilters.maxPrice < Infinity) {
        fetchedProperties = fetchedProperties.filter(p => p.listPrice <= currentFilters.maxPrice);
      }
      if (currentFilters.minEquity > 0) {
        fetchedProperties = fetchedProperties.filter(p => p.equityGap >= currentFilters.minEquity);
      }

      setProperties(fetchedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch when filters change, and skip initial fetch if we have initialData
  useEffect(() => {
    // Skip the first fetch if we have initial data from server
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (hasInitialData.current) {
        // We already have data from server, no need to fetch
        return;
      }
    }
    
    fetchProperties(filters);
  }, [filters, fetchProperties]);

  const refreshProperties = useCallback(async () => {
    await fetchProperties(filters);
  }, [filters, fetchProperties]);

  const updateProperty = useCallback(async (id: string, data: Partial<PropertyBase>) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update property: ${response.status}`);
      }

      const result = await response.json();
      // Use the shared calculation utility
      const updatedProperty = addCalculations(result.data);
      
      setProperties(prev => 
        prev.map(p => p.id === id ? updatedProperty : p)
      );
    } catch (err) {
      console.error('Error updating property:', err);
      throw err;
    }
  }, []);

  const deleteProperty = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete property: ${response.status}`);
      }

      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      throw err;
    }
  }, []);

  const addProperty = useCallback(async (propertyData: Omit<PropertyBase, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add property: ${response.status}`);
      }

      const result = await response.json();
      // Use the shared calculation utility
      const newProperty = addCalculations(result.data);
      
      setProperties(prev => [...prev, newProperty]);
    } catch (err) {
      console.error('Error adding property:', err);
      throw err;
    }
  }, []);

  const getPropertyById = useCallback((id: string) => {
    return properties.find(p => p.id === id);
  }, [properties]);

  const getPropertiesByStrategy = useCallback((strategy: Strategy) => {
    return properties.filter(p => p.strategy === strategy);
  }, [properties]);

  const getPropertiesByDecision = useCallback((decision: Decision) => {
    return properties.filter(p => p.decision === decision);
  }, [properties]);

  const searchProperties = useCallback((query: string) => {
    if (!query.trim()) return properties;
    const lowerQuery = query.toLowerCase();
    return properties.filter(p =>
      p.address.toLowerCase().includes(lowerQuery) ||
      p.city.toLowerCase().includes(lowerQuery) ||
      p.rationale.toLowerCase().includes(lowerQuery) ||
      (p.details?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }, [properties]);

  // Favorites/Watchlist - derived from properties with isFavorite flag
  const favoriteProperties = useCallback(() => {
    return properties.filter(p => (p as any).isFavorite === true);
  }, [properties])();

  const isFavorite = useCallback((id: string) => {
    const property = properties.find(p => p.id === id);
    return property ? (property as any).isFavorite === true : false;
  }, [properties]);

  const toggleFavorite = useCallback(async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    const currentFavorite = (property as any).isFavorite === true;
    try {
      await updateProperty(id, { isFavorite: !currentFavorite } as any);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  }, [properties, updateProperty]);

  const value: PropertyContextType = {
    properties,
    loading,
    error,
    selectedProperty,
    filters,
    setSelectedProperty,
    setFilters,
    refreshProperties,
    updateProperty,
    deleteProperty,
    addProperty,
    getPropertyById,
    getPropertiesByStrategy,
    getPropertiesByDecision,
    searchProperties,
    // Favorites/Watchlist
    favoriteProperties,
    toggleFavorite,
    isFavorite,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
