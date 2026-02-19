'use client';

import { useMemo, useState } from 'react';
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
  ColumnDef,
  FilterFn,
  Row,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { 
  getDecisionColor, 
  Decision,
  Strategy,
} from '@/data/properties';
import { PropertyWithCalculations } from '@/lib/calculations';

interface PropertyDataTableProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  onToggleFavorite?: (id: string) => void;
  getIsFavorite?: (id: string) => boolean;
}

// Typed column helper for PropertyWithCalculations type
const columnHelper = createColumnHelper<PropertyWithCalculations>();

// Type-safe strategy colors
const STRATEGY_COLORS: Record<Strategy, string> = {
  'Retail Flip': '#3b82f6',
  'Section 8': '#22c55e',
  'BRRR': '#a855f7',
  'Owner Finance': '#06b6d4',
  'Wholesaling': '#ec4899',
};

// Type-safe decision filter options
const DECISION_FILTER_OPTIONS: readonly { value: Decision | 'all'; label: string }[] = [
  { value: 'all', label: 'All Decisions' },
  { value: 'Pass Platinum', label: 'Platinum' },
  { value: 'Pass Gold', label: 'Gold' },
  { value: 'Pass Silver', label: 'Silver' },
  { value: 'Hard Fail', label: 'Hard Fail' },
  { value: 'Caution', label: 'Caution' },
] as const;

// Type-safe decision filter function
const decisionFilterFn: FilterFn<PropertyWithCalculations> = (
  row: Row<PropertyWithCalculations>,
  columnId: string,
  filterValue: string
): boolean => {
  if (filterValue === 'all') return true;
  const decision = row.getValue(columnId) as Decision;
  return decision === filterValue;
};

// Interface for one percent rule calculation result
interface OnePercentRuleResult {
  passes: boolean;
  ratio: number;
  rent: number;
}

// Interface for rent state
type RentState = Record<string, number>;

export default function PropertyDataTable({ 
  properties, 
  onPropertyClick,
  onToggleFavorite,
  getIsFavorite,
}: PropertyDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [estimatedRent, setEstimatedRent] = useState<RentState>({});

  // Typed columns array
  const columns = useMemo(
    () => [
      // Favorites column
      columnHelper.display({
        id: 'favorite',
        header: '★',
        cell: (info) => {
          const property = info.row.original;
          const isFavorite = getIsFavorite?.(property.id) ?? property.isFavorite;
          return (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onToggleFavorite?.(property.id);
              }}
              className={clsx(
                'text-xl transition-colors hover:scale-110',
                isFavorite ? 'text-amber-400' : 'text-dark-500 hover:text-amber-300'
              )}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          );
        },
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => (
          <div>
            <div className="font-medium text-white">{info.getValue()}</div>
            <div className="text-xs text-dark-400">{info.row.original.city}</div>
          </div>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('listPrice', {
        header: 'List Price',
        cell: (info) => {
          const price = info.getValue();
          return (
            <span className="text-emerald-400 font-medium">
              ${price.toLocaleString()}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('sqft', {
        header: 'SqFt',
        cell: (info) => {
          const sqft = info.getValue();
          return sqft > 0 ? sqft.toLocaleString() : 'N/A';
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('pricePerSqft', {
         id: 'pricePerSqft',
         header: '$/SqFt',
         cell: (info) => {
           const value = info.getValue();
           const avgPricePerSqft = properties.length > 0
             ? properties.reduce((sum, p) => sum + p.pricePerSqft, 0) / properties.length
             : 0;
           const isBelowAverage = value < avgPricePerSqft;
           return (
             <span className={clsx(isBelowAverage && 'text-emerald-400 font-medium')}>
               ${value.toFixed(2)}
             </span>
           );
         },
         footer: (props) => props.column.id,
       }),
       columnHelper.accessor('bedrooms', {
         header: 'Beds',
         cell: (info) => info.getValue(),
         footer: (props) => props.column.id,
       }),
       columnHelper.accessor('pricePerDoor', {
         id: 'pricePerDoor',
         header: '$/Door',
         cell: (info) => (
           <span className="text-primary-400">
             ${info.getValue().toLocaleString()}
           </span>
         ),
         footer: (props) => props.column.id,
       }),
      columnHelper.accessor('decision', {
        header: 'Decision',
        cell: (info) => {
          const decision = info.getValue() as Decision;
          const color = getDecisionColor(decision);
          return (
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              {decision}
            </span>
          );
        },
        footer: (props) => props.column.id,
        filterFn: decisionFilterFn,
      }),
      columnHelper.accessor('strategy', {
        header: 'Strategy',
        cell: (info) => {
          const strategy = info.getValue() as Strategy;
          const color = STRATEGY_COLORS[strategy] || '#6b7280';
          return (
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              {strategy}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('equityGap', {
        header: 'Equity Gap',
        cell: (info) => {
          const gap = info.getValue();
          return (
            <span className="text-amber-400 font-medium">
              ${gap.toLocaleString()}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('capRate', {
         id: 'capRate',
         header: 'Cap Rate',
         cell: (info) => {
           const capRate = info.getValue();
           return (
             <span className={clsx(
               'text-sm font-medium',
               capRate >= 8 ? 'text-emerald-400' : 
               capRate >= 6 ? 'text-amber-400' : 'text-red-400'
             )}>
               {capRate.toFixed(2)}%
             </span>
           );
         },
         footer: (props) => props.column.id,
       }),
       columnHelper.accessor('cashOnCashReturn', {
         id: 'cashOnCash',
         header: 'Cash-on-Cash',
         cell: (info) => {
           const coc = info.getValue();
           return (
             <span className={clsx(
               'text-sm font-medium',
               coc >= 15 ? 'text-emerald-400' : 
               coc >= 10 ? 'text-amber-400' : 'text-red-400'
             )}>
               {coc.toFixed(2)}%
             </span>
           );
         },
         footer: (props) => props.column.id,
       }),
       columnHelper.accessor('mao', {
         id: 'mao',
         header: 'MAO',
         cell: (info) => (
           <span className="text-emerald-400 font-medium">
             ${info.getValue().toLocaleString()}
           </span>
         ),
         footer: (props) => props.column.id,
       }),
       columnHelper.accessor('grossYield', {
         id: 'grossYield',
         header: 'Gross Yield',
         cell: (info) => {
           const yield_ = info.getValue();
           return (
             <span className={clsx(
               'text-sm font-medium',
               yield_ >= 12 ? 'text-emerald-400' : 
               yield_ >= 8 ? 'text-amber-400' : 'text-red-400'
             )}>
               {yield_.toFixed(2)}%
             </span>
           );
         },
         footer: (props) => props.column.id,
       }),
       columnHelper.accessor((row: PropertyWithCalculations): OnePercentRuleResult => {
         const rent = estimatedRent[row.id] ?? row.estimatedRent ?? 0;
         const price = row.listPrice;
         if (rent <= 0 || price <= 0) return { passes: false, ratio: 0, rent };
         const ratio = (rent / price) * 100;
         return { passes: ratio >= 1, ratio, rent };
       }, {
        id: 'onePercentRule',
        header: '1% Rule',
        cell: (info) => {
          const { passes, ratio, rent } = info.getValue();
          const propertyId = info.row.original.id;
          
          return (
            <div className="flex flex-col gap-1">
              <input
                type="number"
                placeholder="Est. Rent"
                value={rent || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = parseFloat(e.target.value) || 0;
                  setEstimatedRent((prev: RentState) => ({
                    ...prev,
                    [propertyId]: value,
                  }));
                }}
                className="w-20 px-2 py-1 text-xs bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-primary-500"
                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
              />
              {rent > 0 && (
                <span
                  className={clsx(
                    'text-xs font-medium',
                    passes ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {ratio.toFixed(2)}% {passes ? '✓' : '✗'}
                </span>
              )}
            </div>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('rationale', {
        header: 'Rationale',
        cell: (info) => {
          const rationale = info.getValue();
          return (
            <div className="max-w-xs truncate text-xs text-dark-300" title={rationale}>
              {rationale}
            </div>
          );
        },
        footer: (props) => props.column.id,
      }),
    ],
    [properties, estimatedRent]
  );

  const table = useReactTable({
    data: properties,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Get current decision filter value with type safety
  const currentDecisionFilter = (columnFilters.find((f) => f.id === 'decision')?.value as string) || 'all';

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalFilter as string}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64 px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Decision Filter */}
          <select
            value={currentDecisionFilter}
            onChange={(e) => {
              const value = e.target.value;
              table.getColumn('decision')?.setFilterValue(value);
            }}
            className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          >
            {DECISION_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-dark-300">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-dark-800 rounded-lg border border-dark-700">
        <table className="w-full">
          <thead className="bg-dark-900 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-semibold text-dark-300 uppercase tracking-wider cursor-pointer hover:bg-dark-700 transition-colors',
                      header.column.getIsSorted() && 'text-primary-400'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span>
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-dark-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onPropertyClick?.(row.original)}
                className="hover:bg-dark-700/50 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            No properties found matching your criteria
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between text-sm text-dark-400">
        <div>
          Showing {table.getRowModel().rows.length} of {properties.length} properties
        </div>
        <div className="flex items-center gap-4">
          <span>
            Total Equity Gap:{' '}
            <span className="text-amber-400 font-medium">
              ${properties.reduce((sum, p) => sum + p.equityGap, 0).toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}