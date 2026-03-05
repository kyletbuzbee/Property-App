"use client";

import { MarketHealth } from "@/lib/ai/marketForecast";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import clsx from "clsx";
import {
  FireIcon,
  SunIcon,
  MinusIcon,
  CloudIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface MarketPhaseIndicatorProps {
  health: MarketHealth;
  size?: "sm" | "md" | "lg";
  showForecast?: boolean;
}

interface PhaseConfig {
  label: string;
  variant: BadgeVariant;
  icon: React.ElementType;
  description: string;
}

export default function MarketPhaseIndicator({
  health,
  size = "md",
  showForecast = true,
}: MarketPhaseIndicatorProps) {
  const phaseConfig: Record<string, PhaseConfig> = {
    hot: {
      label: "Hot Market",
      variant: "danger",
      icon: FireIcon,
      description: "Rapid sales, rising prices",
    },
    warm: {
      label: "Warm Market",
      variant: "warning",
      icon: SunIcon,
      description: "Good conditions for flips",
    },
    stable: {
      label: "Stable Market",
      variant: "success",
      icon: MinusIcon,
      description: "Predictable conditions",
    },
    cooling: {
      label: "Cooling Market",
      variant: "info",
      icon: CloudIcon,
      description: "Slower sales, caution advised",
    },
    declining: {
      label: "Declining Market",
      variant: "neutral",
      icon: ExclamationTriangleIcon,
      description: "High risk, longer holds",
    },
  };

  const config = phaseConfig[health.phase] || phaseConfig.stable;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className={sizeClasses[size]}>
          <Icon className="w-3.5 h-3.5 mr-1" />
          {config.label}
        </Badge>

        {showForecast && health.forecast_6mo !== 0 && (
          <span
            className={clsx(
              "text-xs font-mono font-semibold tabular-nums",
              health.forecast_6mo > 0 ? "text-success" : "text-danger",
            )}
          >
            {health.forecast_6mo > 0 ? "+" : ""}
            {Math.round(health.forecast_6mo * 100)}% 6mo
          </span>
        )}
      </div>

      {showForecast && (
        <div className="text-[11px] text-slate-500">
          <span className="font-medium">{config.description}</span>
          <span className="mx-1">•</span>
          <span>YoY: {Math.round(health.zhvi_growth_12mo * 100)}%</span>
          <span className="mx-1">•</span>
          <span>Conf: {Math.round(health.confidence * 100)}%</span>
        </div>
      )}
    </div>
  );
}
