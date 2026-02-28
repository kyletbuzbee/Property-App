"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Strategy, getDecisionColor } from "@/data/properties";
import { PropertyWithCalculations } from "@/lib/calculations";

interface StrategyKanbanProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

const strategyConfig: {
  strategy: Strategy;
  label: string;
  color: string;
  icon: string;
}[] = [
  {
    strategy: "Retail Flip",
    label: "Retail Flip",
    color: "#3b82f6",
    icon: "🏠",
  },
  {
    strategy: "Wholesaling",
    label: "Wholesaling",
    color: "#ec4899",
    icon: "🤝",
  },
];

// Sortable Card Component
interface SortableCardProps {
  property: PropertyWithCalculations;
  isDragging?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const SortableCard = ({
  property,
  isDragging,
  selected,
  onSelect,
}: SortableCardProps) => {
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
    zIndex: isDragging || dndDragging ? 999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={clsx(
        "bg-white border border-slate-200 rounded-sm p-3 cursor-grab active:cursor-grabbing transition-all shadow-sm",
        selected && "ring-1 ring-primary-500 border-primary-500",
      )}
      {...attributes}
      {...listeners}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
            {property.address}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            {property.city}
          </div>
        </div>
        <span className={clsx("decision-badge", 
          property.decision === "PASS" ? "decision-platinum" : 
          property.decision === "CAUTION" ? "decision-caution" : "decision-hardfail"
        )}>
          {property.decision}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] mb-2 border-t border-slate-50 pt-2">
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium uppercase text-[9px]">Price:</span>
          <span className="text-slate-900 font-mono font-bold tabular-nums">
            ${property.listPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium uppercase text-[9px]">MAO:</span>
          <span className="text-info font-mono font-bold tabular-nums">
            ${property.mao50k.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium uppercase text-[9px]">SqFt:</span>
          <span className="font-mono tabular-nums">{property.sqft.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-medium uppercase text-[9px]">ARV:</span>
          <span className="text-primary-600 font-mono font-bold tabular-nums">
            ${property.afterRepairValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {selected && (
        <div className="mt-2 pt-2 border-t border-slate-100 animate-fade-in">
          <div className="text-[10px] text-slate-500 mb-2 line-clamp-2 italic leading-relaxed">
            &ldquo;{property.rationale.split("\n")[0]}&rdquo;
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-success tabular-nums">+${property.equityGap.toLocaleString()} Equity</span>
            <a
              href={property.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700 underline"
              onClick={(e) => e.stopPropagation()}
            >
              Listing Details
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default function StrategyKanban({
  properties,
  onPropertyClick,
}: StrategyKanbanProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [groupedProperties, setGroupedProperties] = useState<
    Record<Strategy, PropertyWithCalculations[]>
  >(() => {
    const groups: Record<Strategy, PropertyWithCalculations[]> = {
      "Retail Flip": [],
      Wholesaling: [],
    };

    properties.forEach((property) => {
      if (groups[property.strategy as Strategy]) {
        groups[property.strategy as Strategy].push(property);
      }
    });

    return groups;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    let sourceColumn: Strategy | null = null;
    let destColumn: Strategy | null = null;

    Object.entries(groupedProperties).forEach(([strategy, props]) => {
      if (props.some((p) => p.id === active.id))
        sourceColumn = strategy as Strategy;
      if (over.id.toString().startsWith("column-"))
        destColumn = over.id.toString().replace("column-", "") as Strategy;
      else if (props.some((p) => p.id === over.id))
        destColumn = strategy as Strategy;
    });

    if (!sourceColumn) {
      setActiveId(null);
      return;
    }

    if (sourceColumn === destColumn) {
      const sourceItems: PropertyWithCalculations[] = [...(groupedProperties[sourceColumn] ?? [])];
      const activeIndex = sourceItems.findIndex((p) => p.id === active.id);
      const overIndex = sourceItems.findIndex((p) => p.id === over.id);
      if (activeIndex !== overIndex) {
        const reordered = arrayMove(sourceItems, activeIndex, overIndex);
        setGroupedProperties((prev) => ({
          ...prev,
          [sourceColumn as string]: reordered,
        }));
      }
    } else if (destColumn) {
      const sourceItems: PropertyWithCalculations[] = [...(groupedProperties[sourceColumn] ?? [])];
      const destItems: PropertyWithCalculations[] = [...(groupedProperties[destColumn] ?? [])];
      const activeIndex = sourceItems.findIndex((p) => p.id === active.id);
      if (activeIndex !== -1) {
        const [movedProperty] = sourceItems.splice(activeIndex, 1);
        if (!movedProperty) {
          setActiveId(null);
          return;
        }
        const updatedProperty: PropertyWithCalculations = { ...movedProperty, strategy: destColumn };
        if (over.id.toString().startsWith("column-"))
          destItems.push(updatedProperty);
        else {
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
    return Object.values(groupedProperties)
      .flat()
      .reduce((sum, p) => sum + p.equityGap, 0);
  }, [groupedProperties]);

  const activeProperty = useMemo(() => {
    return activeId
      ? Object.values(groupedProperties)
          .flat()
          .find((p) => p.id === activeId)
      : null;
  }, [activeId, groupedProperties]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {strategyConfig.map(({ strategy, label, color, icon }) => {
            const props = groupedProperties[strategy] || [];
            const totalEquity = props.reduce((sum, p) => sum + p.equityGap, 0);
            return (
              <div
                key={strategy}
                className="bento-card"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-black text-slate-900 tabular-nums">
                    {props.length}
                  </div>
                  <div className="text-[11px] font-bold text-success tabular-nums">
                    +${totalEquity.toLocaleString()} Equity
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bento-card py-4 mb-4 flex items-center justify-between border-t-4 border-t-primary-600">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
              Total Pipeline Potential
            </p>
            <p className="text-3xl font-black text-slate-900 tabular-nums">
              ${totalEquityGap.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
              Active Deal Flow
            </p>
            <p className="text-3xl font-black text-primary-600 tabular-nums">
              {Object.values(groupedProperties).flat().length}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max h-full">
            {strategyConfig.map(({ strategy, label, color, icon }) => {
              const columnProperties = groupedProperties[strategy] || [];
              return (
                <div
                  key={strategy}
                  className="flex flex-col flex-shrink-0 w-80 bg-slate-50/50 rounded-sm border border-slate-200 shadow-inner p-2"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{icon}</span>
                      <span className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">
                        {label}
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white border border-slate-200 text-slate-600"
                    >
                      {columnProperties.length}
                    </span>
                  </div>
                  <div
                    id={`column-${strategy}`}
                    className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto p-1"
                  >
                    <SortableContext
                      items={columnProperties.map((p) => p.id)}
                      strategy={rectSortingStrategy}
                    >
                      {columnProperties.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 uppercase text-[9px] font-bold tracking-widest border-2 border-dashed border-slate-200 rounded-sm">
                          No Active Deals
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
                                selectedProperty === property.id
                                  ? null
                                  : property.id,
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
