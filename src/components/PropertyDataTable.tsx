"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  Row,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Decision, Strategy } from "@/data/properties";
import { PropertyWithCalculations } from "@/lib/calculations";
import { DecisionBadge } from "@/components/ui/Badge";

interface PropertyDataTableProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  onToggleFavorite?: (id: string) => void;
  getIsFavorite?: (id: string) => boolean;
}

const columnHelper = createColumnHelper<PropertyWithCalculations>();

const DECISION_FILTER_OPTIONS: readonly {
  value: Decision | "all";
  label: string;
}[] = [
  { value: "all", label: "All Decisions" },
  { value: "PASS", label: "PASS" },
  { value: "CAUTION", label: "CAUTION" },
  { value: "HARD_FAIL", label: "HARD_FAIL" },
] as const;

const decisionFilterFn: FilterFn<PropertyWithCalculations> = (
  row: Row<PropertyWithCalculations>,
  columnId: string,
  filterValue: string,
): boolean => {
  if (filterValue === "all") return true;
  const decision = row.getValue(columnId) as string;
  return decision === filterValue;
};

export default function PropertyDataTable({
  properties,
  onPropertyClick,
  onToggleFavorite,
  getIsFavorite,
}: PropertyDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "favorite",
        header: "★",
        cell: (info) => {
          const property = info.row.original;
          const isFavorite = getIsFavorite?.(property.id) ?? property.isFavorite;
          return (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(property.id); }}
              className={clsx("text-lg transition-colors", isFavorite ? "text-warning" : "text-slate-300")}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          );
        },
      }),
      columnHelper.accessor("address", {
        header: "Address",
        cell: (info) => (
          <div className="leading-tight">
            <div className="font-semibold text-slate-900 text-sm tracking-tight">{info.getValue()}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{info.row.original.city}</div>
          </div>
        ),
      }),
      columnHelper.accessor("listPrice", {
        header: "List Price",
        cell: (info) => <span className="text-slate-900 font-mono tabular-nums font-semibold">${info.getValue().toLocaleString()}</span>,
      }),
      columnHelper.accessor("mao25k", {
        header: "MAO 25k",
        cell: (info) => <span className="text-success font-mono tabular-nums font-bold">${info.getValue().toLocaleString()}</span>,
      }),
      columnHelper.accessor("mao50k", {
        header: "MAO 50k",
        cell: (info) => <span className="text-info font-mono tabular-nums font-bold">${info.getValue().toLocaleString()}</span>,
      }),
      columnHelper.accessor("afterRepairValue", {
        header: "ARV",
        cell: (info) => <span className="text-slate-600 font-mono tabular-nums font-medium">${info.getValue().toLocaleString()}</span>,
      }),
      columnHelper.accessor("rehabTier", {
        header: "Tier",
        cell: (info) => <span className="text-[9px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200">{info.getValue()}</span>,
      }),
      columnHelper.accessor("decision", {
        header: "Decision",
        cell: (info) => {
          const decision = info.getValue() as Decision;
          return <DecisionBadge decision={decision} size="sm" />;
        },
        filterFn: decisionFilterFn,
      }),
      columnHelper.accessor("equityGap", {
        header: "Equity Gap",
        cell: (info) => <span className="text-warning font-mono tabular-nums font-bold">${info.getValue().toLocaleString()}</span>,
      }),
    ],
    [getIsFavorite, onToggleFavorite],
  );

  const table = useReactTable({
    data: properties,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const currentDecisionFilter = (columnFilters.find((f) => f.id === "decision")?.value as string) || "all";

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by address..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64 pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={currentDecisionFilter}
            onChange={(e) => table.getColumn("decision")?.setFilterValue(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-semibold text-slate-600 focus:outline-none focus:border-primary-500 shadow-sm"
          >
            {DECISION_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-sm shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={header.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ▴',
                        desc: ' ▾',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={() => onPropertyClick?.(row.original)} className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 border-b border-slate-50 text-xs text-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between py-2 px-1">
        <div className="text-[11px] text-slate-500 font-medium">
          Showing {table.getRowModel().rows.length} of {properties.length} deals
        </div>
        <div className="flex gap-1">
          <button 
            className="p-1 px-2 border border-slate-200 rounded-sm text-[10px] font-bold disabled:opacity-30 hover:bg-white transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            PREV
          </button>
          <button 
            className="p-1 px-2 border border-slate-200 rounded-sm text-[10px] font-bold disabled:opacity-30 hover:bg-white transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
