"use client";

import * as React from "react";
import { cn } from "@/components/ui/Card";

/**
 * Enterprise Tooltip Component
 * Provides contextual definitions for financial jargon and acronyms
 *
 * @example
 * <Tooltip content="Maximum Allowable Offer - The highest price you can pay and still hit profit target">
 *   <span>MAO</span>
 * </Tooltip>
 */

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  children,
  content,
  className,
  side = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800",
  };

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <span className="cursor-help border-b border-dotted border-slate-400 hover:border-slate-600 transition-colors">
        {children}
      </span>
      {isVisible && (
        <span
          className={cn(
            "absolute z-50 w-64 px-3 py-2",
            "bg-slate-800 text-white text-[11px] leading-relaxed",
            "rounded-sm shadow-lg",
            "pointer-events-none",
            positionClasses[side],
          )}
        >
          {content}
          <span
            className={cn(
              "absolute w-0 h-0 border-4 border-transparent",
              arrowClasses[side],
            )}
          />
        </span>
      )}
    </span>
  );
}

/**
 * Abbreviated term with tooltip for common real estate jargon
 */
interface JargonTermProps {
  term:
    | "MAO"
    | "ARV"
    | "DOM"
    | "Cap Rate"
    | "COC"
    | "IRR"
    | "LTV"
    | "Equity Gap"
    | "Rehab Tier"
    | "Holding Costs";
  className?: string;
}

const JARGON_DEFINITIONS: Record<JargonTermProps["term"], string> = {
  MAO: "Maximum Allowable Offer - The highest price you can pay while still achieving your target profit margin (typically $25K or $50K)",
  ARV: "After Repair Value - The estimated market value of the property after all renovations are complete",
  DOM: "Days on Market - How long the property has been listed. Higher DOM often indicates motivated sellers",
  "Cap Rate":
    "Capitalization Rate - Net operating income divided by property value. Used for rental valuations",
  COC: "Cash on Cash Return - Annual cash flow divided by total cash invested. Your actual cash yield",
  IRR: "Internal Rate of Return - Annualized rate of return accounting for time value of money",
  LTV: "Loan to Value Ratio - Amount borrowed vs. property value. Lower is safer",
  "Equity Gap":
    "The spread between current list price and estimated After Repair Value (ARV)",
  "Rehab Tier":
    "Classification of renovation scope: Light ($15/sqft), Standard ($35/sqft), Heavy ($55/sqft), or Down to Studs ($85/sqft)",
  "Holding Costs":
    "Expenses during renovation and sale: utilities, insurance, taxes, and capital costs. Typically $350/month + 2.35% of ARV annually",
};

export function JargonTerm({ term, className }: JargonTermProps) {
  return (
    <Tooltip content={JARGON_DEFINITIONS[term]} className={className}>
      <span className="font-semibold text-slate-700">{term}</span>
    </Tooltip>
  );
}

/**
 * Table header with integrated tooltip for financial terms
 */
interface TableHeaderWithTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}

export function TableHeaderWithTooltip({
  children,
  tooltip,
  className,
}: TableHeaderWithTooltipProps) {
  return (
    <Tooltip content={tooltip} side="top">
      <span
        className={cn(
          "cursor-help border-b border-dotted border-slate-400",
          className,
        )}
      >
        {children}
      </span>
    </Tooltip>
  );
}

export default Tooltip;
