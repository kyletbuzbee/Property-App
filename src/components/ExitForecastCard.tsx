"use client";

import { ExitValuePrediction } from "@/lib/ai/marketForecast";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface ExitForecastCardProps {
  forecast: ExitValuePrediction;
}

export default function ExitForecastCard({ forecast }: ExitForecastCardProps) {
  const growthRate =
    (forecast.predicted_exit_arv - forecast.current_arv) / forecast.current_arv;

  return (
    <Card className="border-l-4 border-l-primary-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-primary-500" />
            Exit Forecast ({forecast.months_ahead} months)
          </h3>
          <span
            className={clsx(
              "text-xs font-bold px-2 py-0.5 rounded-sm uppercase",
              forecast.market_phase === "hot" && "bg-danger/10 text-danger",
              forecast.market_phase === "warm" && "bg-warning/10 text-warning",
              forecast.market_phase === "stable" &&
                "bg-success/10 text-success",
              forecast.market_phase === "cooling" && "bg-info/10 text-info",
              forecast.market_phase === "declining" &&
                "bg-slate-100 text-slate-600",
            )}
          >
            {forecast.market_phase}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded-sm">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
              Current ARV
            </p>
            <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">
              ${forecast.current_arv.toLocaleString()}
            </p>
          </div>

          <div className="bg-primary-50 p-3 rounded-sm border border-primary-100">
            <p className="text-[10px] text-primary-600 uppercase font-bold mb-1">
              Predicted Exit
            </p>
            <p className="text-lg font-mono font-bold text-primary-700 tabular-nums">
              ${forecast.predicted_exit_arv.toLocaleString()}
            </p>
            <p
              className={clsx(
                "text-xs font-medium mt-1",
                growthRate > 0 ? "text-success" : "text-danger",
              )}
            >
              {growthRate > 0 ? "+" : ""}
              {Math.round(growthRate * 100)}%
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <ChartBarIcon className="w-3.5 h-3.5" />
              Confidence Range
            </span>
            <span className="font-mono text-slate-700 tabular-nums">
              ${forecast.confidence_low.toLocaleString()} - $
              {forecast.confidence_high.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <ClockIcon className="w-3.5 h-3.5" />
              Est. Days on Market
            </span>
            <span className="font-mono text-slate-700 tabular-nums">
              {forecast.days_on_market_estimate} days
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <CalendarIcon className="w-3.5 h-3.5" />
              Optimal Exit Month
            </span>
            <span className="font-mono text-slate-700 tabular-nums">
              Month {forecast.optimal_exit_month}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
