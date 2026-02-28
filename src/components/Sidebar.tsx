"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  MapIcon,
  ChartBarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  HomeModernIcon,
  ScaleIcon,
  ChartPieIcon,
  MagnifyingGlassCircleIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  UsersIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export type ViewType =
  | "map"
  | "scatter"
  | "kanban"
  | "table"
  | "portfolio"
  | "expenses"
  | "tasks"
  | "timeline"
  | "rehab"
  | "rentComps"
  | "comparator"
  | "projections"
  | "market"
  | "ai"
  | "export"
  | "collaboration";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  propertyCount?: number;
  platinumCount?: number;
}

const navigationItems = [
  { id: "map" as ViewType, name: "Opportunity Map", icon: MapIcon },
  { id: "scatter" as ViewType, name: "Value Analysis", icon: ChartBarIcon },
  { id: "kanban" as ViewType, name: "Strategy Board", icon: Squares2X2Icon },
  { id: "table" as ViewType, name: "Data Grid", icon: TableCellsIcon },
  {
    id: "portfolio" as ViewType,
    name: "Portfolio Tracker",
    icon: BriefcaseIcon,
  },
  {
    id: "expenses" as ViewType,
    name: "Expense Tracker",
    icon: CurrencyDollarIcon,
  },
  {
    id: "tasks" as ViewType,
    name: "Task Manager",
    icon: ClipboardDocumentListIcon,
  },
  { id: "timeline" as ViewType, name: "Project Timeline", icon: ClockIcon },
  {
    id: "rehab" as ViewType,
    name: "Rehab Estimator",
    icon: WrenchScrewdriverIcon,
  },
  { id: "rentComps" as ViewType, name: "Rent Comps", icon: HomeModernIcon },
  {
    id: "comparator" as ViewType,
    name: "Property Comparator",
    icon: ScaleIcon,
  },
  {
    id: "projections" as ViewType,
    name: "Financial Projections",
    icon: ChartPieIcon,
  },
  {
    id: "market" as ViewType,
    name: "Market Analysis",
    icon: MagnifyingGlassCircleIcon,
  },
  { id: "ai" as ViewType, name: "AI Deal Scoring", icon: SparklesIcon },
  {
    id: "export" as ViewType,
    name: "Export Reports",
    icon: DocumentArrowDownIcon,
  },
  {
    id: "collaboration" as ViewType,
    name: "Collaboration Hub",
    icon: UsersIcon,
  },
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
        <header className="fixed top-0 left-0 right-0 h-14 bg-institutional-slate border-b border-slate-800 z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Deal Triage</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
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
            "fixed top-14 left-0 right-0 bg-institutional-slate border-b border-slate-800 z-40 transition-transform duration-300 md:hidden",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          {/* Search */}
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-sm text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 max-h-[60vh] overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 mb-1",
                    isActive
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>
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
        "fixed left-0 top-0 h-full bg-institutional-slate border-r border-slate-800 transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <HomeIcon className="w-6 h-6 text-primary-400" />
            <span className="font-semibold text-lg text-white tracking-tight">
              Deal Triage
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={clsx(
              "w-5 h-5 transition-transform",
              isCollapsed && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Search Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-sm text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-2 mt-2 overflow-y-auto h-[calc(100vh-180px)]">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 mb-0.5",
                isActive
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-[13px]">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-institutional-slate/95 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-800/50 rounded-sm p-2 border border-slate-700/50">
              <div className="text-lg font-bold text-white tabular-nums">
                {propertyCount}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Deals
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-sm p-2 border border-slate-700/50">
              <div className="text-lg font-bold text-success tabular-nums">
                {platinumCount}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Prime
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
