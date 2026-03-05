"use client";

import { analyzeDOMOpportunity, DOMOpportunity } from "@/lib/calculations";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import clsx from "clsx";

interface DOMBadgeProps {
  daysOnMarket: number;
  size?: "sm" | "md" | "lg";
  showRecommendation?: boolean;
}

export default function DOMBadge({
  daysOnMarket,
  size = "sm",
  showRecommendation = false,
}: DOMBadgeProps) {
  const analysis = analyzeDOMOpportunity(daysOnMarket);

  // Map badge types to colors
  const variantMap: Record<string, BadgeVariant> = {
    "Fresh Listing": "warning", // Yellow - caution
    "Normal Listing": "success", // Green - good
    "Stale Listing": "info", // Blue - opportunity
    "Motivated Seller": "danger", // Red - strong opportunity
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge
        variant={variantMap[analysis.badge] || "neutral"}
        size={size}
        className={clsx(
          analysis.scoreAdjustment > 0 && "font-bold",
          analysis.badge === "Motivated Seller" && "animate-pulse"
        )}
      >
        {analysis.badge}
        {analysis.scoreAdjustment !== 0 && (
          <span className="ml-1 opacity-75">
            {analysis.scoreAdjustment > 0 ? "+" : ""}
            {analysis.scoreAdjustment}
          </span>
        )}
      </Badge>

      {showRecommendation && (
        <span className="text-[10px] text-slate-500 leading-tight max-w-[200px]">
          {analysis.recommendation}
        </span>
      )}
    </div>
  );
}

// Helper function to get color class for DOM
export function getDOMColorClass(daysOnMarket: number): string {
  if (daysOnMarket < 30) return "text-warning";
  if (daysOnMarket < 90) return "text-success";
  if (daysOnMarket < 180) return "text-info";
  return "text-danger";
}
