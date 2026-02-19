'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Strategy, getDecisionColor } from '@/data/properties';
import { PropertyWithCalculations } from '@/lib/calculations';

interface StrategyKanbanProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

const strategyConfig: { strategy: Strategy; label: string; color: string; icon: string }[] = [
  { strategy: 'Retail Flip', label: 'Retail Flip', color: '#3b82f6', icon: '🏠' },
  { strategy: 'Section 8', label: 'Section 8', color: '#22c55e', icon: '🏘️' },
  { strategy: 'BRRR', label: 'BRRR', color: '#a855f7', icon: '🔄' },
  { strategy: 'Owner Finance', label: 'Owner Finance', color: '#06b6d4', icon: '💰' },
  { strategy: 'Wholesaling', label: 'Wholesaling', color: '#ec4899', icon: '🤝' },
];

// Sortable Card Component
interface SortableCardProps {
  property: PropertyWithCalculations;
  isDragging?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const SortableCard = ({ property, isDragging, selected, onSelect }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dndDragging,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || dndDragging ? 0.5 : 1,
    zIndex: isDragging || dndDragging ? 999 : 'auto',
  };

  const getDecisionBadgeClass = (decision: PropertyWithCalculations['decision']) => {
    switch (decision) {
      case 'Pass Platinum':
        return 'decision-platinum';
      case 'Pass Gold':
        return 'decision-gold';
      case 'Pass Silver':
        return 'decision-silver';
      case 'Hard Fail':
        return 'decision-hardfail';
      case 'Caution':
        return 'decision-caution';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={clsx(
        'kanban-card bg-dark-800 border border-dark-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all',
        selected && 'ring-2 ring-primary-500'
      )}
      {...attributes}
      {...listeners}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {property.address}
          </div>
          <div className="text-xs text-dark-400">
            {property.city}, {property.state}
          </div>
        </div>
        <span className={clsx('decision-badge ml-2', getDecisionBadgeClass(property.decision))}>
          {property.decision.split(' ')[1] || property.decision}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <span className="text-dark-400">Price: </span>
          <span className="text-emerald-400 font-medium">
            ${property.listPrice.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-dark-400">Equity: </span>
          <span className="text-amber-400 font-medium">
            ${property.equityGap.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-dark-400">SqFt: </span>
          <span>{property.sqft.toLocaleString()}</span>
        </div>
        <div>
           <span className="text-dark-400">$/SqFt: </span>
           <span className="text-primary-400">
             ${property.pricePerSqft.toFixed(0)}
           </span>
         </div>
      </div>

      {/* Beds/Baths */}
      <div className="flex items-center gap-3 text-xs text-dark-400">
        <span>🛏️ {property.bedrooms}</span>
        <span>🚿 {property.bathrooms}</span>
      </div>

      {/* Expanded Details */}
      {selected && (
        <div className="mt-3 pt-3 border-t border-dark-600 animate-fade-in">
          <div className="text-xs text-dark-300 mb-2">
            {property.rationale}
          </div>
          <a
             href={property.url ?? '#'}
             target="_blank"
             rel="noopener noreferrer"
             className="text-xs text-primary-400 hover:text-primary-300"
             onClick={(e) => e.stopPropagation()}
           >
             View on Zillow →
           </a>
        </div>
      )}
    </div>
  );
};

export default function StrategyKanban({ properties, onPropertyClick }: StrategyKanbanProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [groupedProperties, setGroupedProperties] = useState<Record<Strategy, PropertyWithCalculations[]>>(() => {
    const groups: Record<Strategy, PropertyWithCalculations[]> = {
      'Retail Flip': [],
      'Section 8': [],
      'BRRR': [],
      'Owner Finance': [],
      'Wholesaling': [],
    };

    properties.forEach((property) => {
      groups[property.strategy as Strategy].push(property);
    });

    return groups;
  });

  // Initialize sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Find source and destination columns
    let sourceColumn: Strategy | null = null;
    let destColumn: Strategy | null = null;

    Object.entries(groupedProperties).forEach(([strategy, props]) => {
      if (props.some((p) => p.id === active.id)) {
        sourceColumn = strategy as Strategy;
      }
      if (over.id.toString().startsWith('column-')) {
        destColumn = over.id.toString().replace('column-', '') as Strategy;
      } else if (props.some((p) => p.id === over.id)) {
        // If dropped on a card, find the column
        destColumn = strategy as Strategy;
      }
    });

    if (!sourceColumn) {
      setActiveId(null);
      return;
    }

    if (sourceColumn === destColumn) {
      // Reorder within the same column
      const sourceItems = [...groupedProperties[sourceColumn]] as PropertyWithCalculations[];
      const activeIndex = sourceItems.findIndex((p) => p.id === active.id);
      const overId = over.id as string;
      const overIndex = sourceItems.findIndex((p) => p.id === overId);

      if (activeIndex !== overIndex) {
        const reordered = arrayMove(sourceItems, activeIndex, overIndex);
        setGroupedProperties((prev) => ({
          ...prev,
          [sourceColumn as string]: reordered,
        }));
      }
    } else if (destColumn) {
      // Move to different column
      const sourceItems = [...groupedProperties[sourceColumn]] as PropertyWithCalculations[];
      const destItems = [...groupedProperties[destColumn]] as PropertyWithCalculations[];
      const activeIndex = sourceItems.findIndex((p) => p.id === active.id);

      if (activeIndex !== -1) {
        const [movedProperty] = sourceItems.splice(activeIndex, 1);
        const updatedProperty = {
          ...movedProperty,
          strategy: destColumn,
        };

        // Find the position to insert
        if (over.id.toString().startsWith('column-')) {
          destItems.push(updatedProperty);
        } else {
          const overIndex = destItems.findIndex((p) => p.id === over.id);
          destItems.splice(overIndex + 1, 0, updatedProperty);
        }

        setGroupedProperties((prev) => ({
          ...prev,
          [sourceColumn as string]: sourceItems,
          [destColumn as string]: destItems,
        }));
      }
    }

    setActiveId(null);
  };

  const totalEquityGap = useMemo(() => {
    return Object.values(groupedProperties).flat().reduce((sum, p) => sum + p.equityGap, 0);
  }, [groupedProperties]);

  const activeProperty = useMemo(() => {
    return activeId ? Object.values(groupedProperties)
      .flat()
      .find((p) => p.id === activeId) : null;
  }, [activeId, groupedProperties]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full flex flex-col">
        {/* Header Stats */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {strategyConfig.map(({ strategy, label, color, icon }) => {
            const props = groupedProperties[strategy];
            const totalEquity = props.reduce((sum, p) => sum + p.equityGap, 0);
            
            return (
              <div
                key={strategy}
                className="bg-dark-800 rounded-lg p-3 border border-dark-700"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{icon}</span>
                  <span className="text-xs font-medium text-dark-300">{label}</span>
                </div>
                <div className="text-lg font-bold text-white">{props.length}</div>
                <div className="text-xs text-emerald-400">
                  ${totalEquity.toLocaleString()} equity
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Equity Summary */}
        <div className="bg-gradient-to-r from-primary-500/20 to-emerald-500/20 rounded-lg p-4 mb-4 border border-primary-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-dark-300">Total Portfolio Equity Gap</div>
              <div className="text-2xl font-bold text-white">
                ${totalEquityGap.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-dark-300">Properties Analyzed</div>
              <div className="text-2xl font-bold text-primary-400">
                {Object.values(groupedProperties).flat().length}
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max h-full">
            {strategyConfig.map(({ strategy, label, color, icon }) => {
              const columnProperties = groupedProperties[strategy];
              
              return (
                <div
                  key={strategy}
                  className="kanban-column flex-shrink-0 w-72"
                  style={{ borderTopColor: color, borderTopWidth: 3 }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-600">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <span className="font-semibold text-white">{label}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${color}30`, color }}
                    >
                      {columnProperties.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div
                    id={`column-${strategy}`}
                    className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1"
                  >
                    <SortableContext
                      items={columnProperties.map((p) => p.id)}
                      strategy={rectSortingStrategy}
                    >
                      {columnProperties.length === 0 ? (
                        <div className="text-center py-8 text-dark-500 text-sm">
                          No properties
                        </div>
                      ) : (
                        columnProperties.map((property) => (
                          <SortableCard
                            key={property.id}
                            property={property}
                            isDragging={activeId === property.id}
                            selected={selectedProperty === property.id}
                            onSelect={() => {
                              setSelectedProperty(
                                selectedProperty === property.id ? null : property.id
                              );
                              onPropertyClick?.(property);
                            }}
                          />
                        ))
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeProperty ? (
          <SortableCard
            property={activeProperty}
            isDragging={true}
            selected={selectedProperty === activeProperty.id}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
