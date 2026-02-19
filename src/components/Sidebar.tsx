'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  MapIcon,
  ChartBarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export type ViewType = 'map' | 'scatter' | 'kanban' | 'table';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  propertyCount?: number;
  platinumCount?: number;
}

const navigationItems = [
  { id: 'map' as ViewType, name: 'Opportunity Map', icon: MapIcon },
  { id: 'scatter' as ViewType, name: 'Value Analysis', icon: ChartBarIcon },
  { id: 'kanban' as ViewType, name: 'Strategy Board', icon: Squares2X2Icon },
  { id: 'table' as ViewType, name: 'Data Grid', icon: TableCellsIcon },
];

export default function Sidebar({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  propertyCount = 25,
  platinumCount = 8,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when view changes
  const handleViewChange = (view: ViewType) => {
    onViewChange(view);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile header with hamburger menu
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-dark-900 border-b border-dark-700 z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="w-5 h-5 text-primary-500" />
            <span className="font-semibold">Deal Triage</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={clsx(
            'fixed top-14 left-0 right-0 bg-dark-900 border-b border-dark-700 z-40 transition-transform duration-300 md:hidden',
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          )}
        >
          {/* Search */}
          <div className="p-4 border-b border-dark-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search rationale..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 mb-1',
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats */}
          <div className="p-4 border-t border-dark-700">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-dark-800 rounded-lg p-3">
                <div className="text-xl font-bold text-primary-400">{propertyCount}</div>
                <div className="text-xs text-dark-400">Properties</div>
              </div>
              <div className="bg-dark-800 rounded-lg p-3">
                <div className="text-xl font-bold text-emerald-400">{platinumCount}</div>
                <div className="text-xs text-dark-400">Platinum</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for mobile header */}
        <div className="h-14 md:hidden" />
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-dark-900 border-r border-dark-700 transition-all duration-300 z-50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-dark-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <HomeIcon className="w-6 h-6 text-primary-500" />
            <span className="font-semibold text-lg">Deal Triage</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={clsx('w-5 h-5 transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Search Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-dark-700">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search rationale..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>
          <p className="mt-2 text-xs text-dark-400">
            Try: &ldquo;Foreclosure&rdquo;, &ldquo;Rent Ready&rdquo;, &ldquo;Price cut&rdquo;
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-2 mt-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1',
                isActive
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Stats Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-dark-800 rounded-lg p-2">
              <div className="text-xl font-bold text-primary-400">{propertyCount}</div>
              <div className="text-xs text-dark-400">Properties</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-2">
              <div className="text-xl font-bold text-emerald-400">{platinumCount}</div>
              <div className="text-xs text-dark-400">Platinum</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
