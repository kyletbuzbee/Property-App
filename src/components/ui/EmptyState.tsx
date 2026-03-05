"use client";

import React from "react";
import { cn } from "@/components/ui/Card";
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// HeroIcon type definition
type HeroIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type EmptyStateIcon = "search" | "property" | "document" | "filter" | "error";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: EmptyStateIcon | React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ICON_MAP: Record<EmptyStateIcon, HeroIcon> = {
  search: MagnifyingGlassIcon,
  property: BuildingOfficeIcon,
  document: DocumentTextIcon,
  filter: FunnelIcon,
  error: ExclamationTriangleIcon,
};

/**
 * EmptyState - Enterprise-grade empty state component
 *
 * @example
 * <EmptyState
 *   title="No properties match this filter"
 *   description="Try adjusting your search criteria or clear filters to see all deals"
 *   icon="filter"
 *   action={{ label: "Clear Filters", onClick: handleClear }}
 * />
 */
export function EmptyState({
  title,
  description,
  icon = "search",
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const IconComponent =
    typeof icon === "string" ? ICON_MAP[icon as EmptyStateIcon] : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "px-6 py-12 text-center",
        "bg-white border border-slate-200 rounded-sm",
        className,
      )}
    >
      <div className="mb-4">
        {typeof icon === "string" && IconComponent ? (
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-slate-400" />
          </div>
        ) : (
          icon
        )}
      </div>

      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>

      {description && (
        <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-semibold",
                "bg-slate-900 text-white",
                "hover:bg-slate-800 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
              )}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-semibold",
                "bg-white text-slate-700 border border-slate-300",
                "hover:bg-slate-50 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
              )}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * TableEmptyState - Specialized empty state for data tables
 */
interface TableEmptyStateProps {
  searchTerm?: string;
  filterCount?: number;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  className?: string;
}

export function TableEmptyState({
  searchTerm,
  filterCount = 0,
  onClearSearch,
  onClearFilters,
  className,
}: TableEmptyStateProps) {
  const hasSearch = searchTerm && searchTerm.length > 0;
  const hasFilters = filterCount > 0;

  let title = "No properties found";
  let description = "Get started by adding your first property to analyze";
  let icon: EmptyStateIcon = "property";

  if (hasSearch && hasFilters) {
    title = "No matches found";
    description = `"${searchTerm}" doesn't match any properties with the current filters applied`;
    icon = "filter";
  } else if (hasSearch) {
    title = "No search results";
    description = `"${searchTerm}" doesn't match any property addresses or cities`;
    icon = "search";
  } else if (hasFilters) {
    title = "No properties match this filter";
    description = "Try adjusting your filter criteria to see more deals";
    icon = "filter";
  }

  return (
    <EmptyState
      title={title}
      description={description}
      icon={icon}
      action={
        hasSearch || hasFilters
          ? {
              label: hasSearch ? "Clear Search" : "Clear Filters",
              onClick: hasSearch
                ? onClearSearch || (() => {})
                : onClearFilters || (() => {}),
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * ErrorState - For error conditions
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  retry,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="error"
      action={retry ? { label: "Try Again", onClick: retry } : undefined}
      className={className}
    />
  );
}

export default EmptyState;
