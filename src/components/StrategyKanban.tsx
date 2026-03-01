"use client";

import { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
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
import { DecisionBadge } from "@/components/ui/Badge";
import { PropertyStatus, getStatusColor, getStatusLabel } from "@/data/properties";
import { PropertyWithCalculations } from "@/lib/calculations";

interface StrategyKanbanProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
  onStatusChange?: (propertyId: string, newStatus: PropertyStatus) => void;
}

const statusColumns: PropertyStatus[] = [
  "NEW_LEAD",
  "UNDERWRITING",
  "OFFER_PENDING",
  "UNDER_CONTRACT",
  "ACTIVE_REHAB",
  "LISTED",
  "CLOSED",
];

// Sortable Card Component
interface SortableCardProps {
  property: PropertyWithCalculations;
  isDragging?: boolean;
  onSelect?: () => void;
}

const SortableCard = ({
  property,
  isDragging,
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

  // Calculate target profit
  const targetProfit = property.afterRepairValue - property.listPrice - property.renovationBudget - property.holdingCosts - property.closingCosts;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={clsx(
        "bg-white border border-slate-200 rounded-sm p-2 cursor-grab active:cursor-grabbing transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-primary-300 group",
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex gap-2">
        {/* Thumbnail Placeholder/Image */}
        <div className="w-12 h-12 bg-slate-100 rounded-sm flex-shrink-0 overflow-hidden relative border border-slate-200">
           {property.images && property.images[0] ? (

             <Image 

               src={property.images[0]} 

               alt="" 

               fill 

               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"

             />

           ) : (

             <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-black">

               P4C

             </div>

           )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <h4 className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase">
              {property.address}
            </h4>
            <span className={clsx("decision-badge scale-[0.7] origin-right -mt-1", 
              property.decision === "PASS" ? "decision-platinum" : 
              property.decision === "CAUTION" ? "decision-caution" : "decision-hardfail"
            )}>
              {property.decision}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>ARV: <span className="text-slate-900 font-black">${(property.afterRepairValue / 1000).toFixed(0)}k</span></span>
            <span className="text-slate-300">|</span>
            <span>Profit: <span className={clsx("font-black", targetProfit > 25000 ? "text-success" : "text-slate-900")}>
              ${(targetProfit / 1000).toFixed(1)}k
            </span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StrategyKanban({
  properties,
  onPropertyClick,
  onStatusChange,
}: StrategyKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Local state for the kanban to allow immediate UI updates
  const [localProperties, setLocalProperties] = useState<PropertyWithCalculations[]>(properties);

  useEffect(() => {
    setLocalProperties(properties);
  }, [properties]);

  const groupedProperties = useMemo(() => {
    const groups: Record<string, PropertyWithCalculations[]> = {};
    statusColumns.forEach(status => {
      groups[status] = localProperties.filter(p => (p.status || "NEW_LEAD") === status);
    });
    return groups;
  }, [localProperties]);

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

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine the destination status
    let newStatus: PropertyStatus | null = null;
    
    if (statusColumns.includes(overId as PropertyStatus)) {
      newStatus = overId as PropertyStatus;
    } else {
      const overProperty = localProperties.find(p => p.id === overId);
      if (overProperty) {
        newStatus = (overProperty.status as PropertyStatus) || "NEW_LEAD";
      }
    }

    if (newStatus) {
      const property = localProperties.find(p => p.id === activeId);
      if (property && property.status !== newStatus) {
        // Update local state for immediate feedback
        setLocalProperties(prev => prev.map(p => 
          p.id === activeId ? { ...p, status: newStatus as PropertyStatus } : p
        ));
        
        // Notify parent of the change
        onStatusChange?.(activeId, newStatus);
        
        // If moving to Underwriting, we could trigger AI scoring here
        if (newStatus === "UNDERWRITING") {
          console.log(`Triggering AI Deal Scoring for ${property.address}...`);
        }
      }
    }

    setActiveId(null);
  };

  const activeProperty = useMemo(() => {
    return activeId ? localProperties.find((p) => p.id === activeId) : null;
  }, [activeId, localProperties]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full flex flex-col bg-slate-100/50 p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
              Deal Flow Pipeline
            </h2>
            <p className="text-2xl font-black text-slate-900 tracking-tight italic">
              Institutional Flip Lifecycle
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Velocity</p>
              <p className="text-lg font-black text-slate-900">{localProperties.length} Units</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-max">
            {statusColumns.map((status) => {
              const columnProperties = groupedProperties[status] || [];
              const color = getStatusColor(status);
              
              return (
                <div
                  key={status}
                  className="flex flex-col flex-shrink-0 w-64 bg-slate-200/40 rounded-sm border border-slate-200/60"
                >
                  {/* Column Header */}
                  <div 
                    className="p-3 border-b-2 flex items-center justify-between bg-white/50"
                    style={{ borderBottomColor: color }}
                  >
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">
                      {getStatusLabel(status)}
                    </h3>
                    <span className="text-[10px] font-black tabular-nums bg-slate-900 text-white px-1.5 py-0.5 rounded-sm">
                      {columnProperties.length}
                    </span>
                  </div>

                  {/* Drop Zone / Sortable Context */}
                  <div
                    id={status}
                    className="flex-1 p-2 space-y-2 overflow-y-auto"
                  >
                    <SortableContext
                      id={status}
                      items={columnProperties.map((p) => p.id)}
                      strategy={rectSortingStrategy}
                    >
                      {columnProperties.map((property) => (
                        <SortableCard
                          key={property.id}
                          property={property}
                          isDragging={activeId === property.id}
                          onSelect={() => onPropertyClick?.(property)}
                        />
                      ))}
                      
                      {columnProperties.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-slate-300 rounded-sm flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Empty</span>
                        </div>
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
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
