'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface ProjectTimelineProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

// Event types for timeline
type EventType = 'purchase' | 'rehab' | 'listing' | 'sale' | 'inspection' | 'closing';

interface TimelineEventData {
  id: string;
  propertyId: string;
  propertyAddress: string;
  title: string;
  eventType: EventType;
  startDate: Date;
  endDate: Date | null;
  isCompleted: boolean;
  assignedTo?: string;
}

// Sample timeline events (in real app, would come from database)
const generateSampleEvents = (properties: PropertyWithCalculations[]): TimelineEventData[] => {
  return properties.slice(0, 5).map((property, index) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (index * 7));
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);

    return {
      id: `event-${property.id}`,
      propertyId: property.id,
      propertyAddress: property.address,
      title: `${property.strategy} - ${index === 0 ? 'Purchase' : index === 1 ? 'Rehab' : 'Listing'}`,
      eventType: ['purchase', 'rehab', 'listing', 'sale'][index % 4] as EventType,
      startDate,
      endDate,
      isCompleted: index < 2,
    };
  });
};

const EVENT_COLORS: Record<EventType, { bg: string; text: string; border: string }> = {
  purchase: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
  rehab: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500' },
  listing: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' },
  sale: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
  inspection: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500' },
  closing: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' },
};

const EVENT_LABELS: Record<EventType, string> = {
  purchase: 'Purchase',
  rehab: 'Rehab',
  listing: 'Listing',
  sale: 'Sale',
  inspection: 'Inspection',
  closing: 'Closing',
};

export default function ProjectTimeline({ properties, onPropertyClick }: ProjectTimelineProps) {
  const [view, setView] = useState<'timeline' | 'gantt'>('timeline');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventData | null>(null);

  // Generate sample events from properties
  const events = useMemo(() => generateSampleEvents(properties), [properties]);

  // Group events by property
  const eventsByProperty = useMemo(() => {
    const grouped: Record<string, TimelineEventData[]> = {};
    events.forEach(event => {
      if (!grouped[event.propertyId]) {
        grouped[event.propertyId] = [];
      }
      grouped[event.propertyId].push(event);
    });
    return grouped;
  }, [events]);

  // Calculate timeline range
  const timelineRange = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return { start: startOfMonth, end: endOfMonth };
  }, []);

  // Get position and width for Gantt chart
  const getEventStyle = (event: TimelineEventData) => {
    const totalDays = (timelineRange.end.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (event.startDate.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const duration = event.endDate 
      ? (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24)
      : 7;

    const left = Math.max(0, (startOffset / totalDays) * 100);
    const width = Math.min(100 - left, (duration / totalDays) * 100);

    return {
      left: `${left}%`,
      width: `${Math.max(width, 3)}%`,
    };
  };

  // Render timeline view
  const renderTimelineView = () => (
    <div className="space-y-4">
      {Object.entries(eventsByProperty).map(([propertyId, propertyEvents]) => (
        <div key={propertyId} className="bg-dark-800 rounded-lg p-4">
          <div 
            className="font-medium text-white mb-3 cursor-pointer hover:text-primary-400"
            onClick={() => {
              const prop = properties.find(p => p.id === propertyId);
              if (prop) onPropertyClick?.(prop);
            }}
          >
            {propertyEvents[0].propertyAddress}
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-dark-600" />
            
            {/* Events */}
            <div className="space-y-3">
              {propertyEvents.map((event, index) => (
                <div key={event.id} className="flex items-start gap-3 ml-1">
                  <div 
                    className={clsx(
                      'w-3 h-3 rounded-full mt-1.5 z-10',
                      EVENT_COLORS[event.eventType].bg,
                      EVENT_COLORS[event.eventType].text,
                      event.isCompleted ? 'opacity-100' : 'opacity-50'
                    )}
                  />
                  <div 
                    className={clsx(
                      'flex-1 p-3 rounded-lg border-l-4 cursor-pointer hover:bg-dark-700 transition-colors',
                      EVENT_COLORS[event.eventType].bg,
                      EVENT_COLORS[event.eventType].border,
                      event.isCompleted ? 'opacity-100' : 'opacity-70'
                    )}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{event.title}</p>
                        <p className="text-xs text-dark-400">
                          {EVENT_LABELS[event.eventType]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-dark-400">
                          {event.startDate.toLocaleDateString()}
                        </p>
                        {event.isCompleted && (
                          <span className="text-xs text-emerald-400">✓ Done</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Gantt view
  const renderGanttView = () => {
    const properties_ = Object.keys(eventsByProperty);
    
    return (
      <div className="overflow-x-auto">
        {/* Header with dates */}
        <div className="flex border-b border-dark-700 pb-2 mb-4">
          <div className="w-48 flex-shrink-0" />
          <div className="flex-1 flex">
            {Array.from({ length: 8 }).map((_, weekIndex) => {
              const date = new Date(timelineRange.start);
              date.setDate(date.getDate() + weekIndex * 7);
              return (
                <div key={weekIndex} className="flex-1 text-xs text-dark-500 text-center">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gantt rows */}
        <div className="space-y-2">
          {properties_.map((propertyId) => {
            const propertyEvents = eventsByProperty[propertyId];
            return (
              <div key={propertyId} className="flex items-center">
                <div className="w-48 flex-shrink-0 pr-4">
                  <p 
                    className="text-sm text-white truncate cursor-pointer hover:text-primary-400"
                    onClick={() => {
                      const prop = properties.find(p => p.id === propertyId);
                      if (prop) onPropertyClick?.(prop);
                    }}
                  >
                    {propertyEvents[0]?.propertyAddress || 'Unknown'}
                  </p>
                </div>
                <div className="flex-1 relative h-8 bg-dark-800 rounded">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex-1 border-l border-dark-700" />
                    ))}
                  </div>
                  
                  {/* Events */}
                  {propertyEvents.map((event) => {
                    const style = getEventStyle(event);
                    return (
                      <div
                        key={event.id}
                        className={clsx(
                          'absolute h-6 top-1 rounded text-xs flex items-center px-2 cursor-pointer hover:opacity-80 transition-opacity',
                          EVENT_COLORS[event.eventType].bg,
                          EVENT_COLORS[event.eventType].text,
                          event.isCompleted && 'opacity-100'
                        )}
                        style={style}
                        onClick={() => setSelectedEvent(event)}
                        title={event.title}
                      >
                        <span className="truncate">{event.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-dark-700">
          {Object.entries(EVENT_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={clsx('w-3 h-3 rounded', EVENT_COLORS[type as EventType].bg)} />
              <span className="text-xs text-dark-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">Project Timeline</h2>
          <p className="text-sm text-dark-400">Track property investment milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('timeline')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              view === 'timeline' 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            )}
          >
            Timeline
          </button>
          <button
            onClick={() => setView('gantt')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              view === 'gantt' 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            )}
          >
            Gantt
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {events.length > 0 ? (
          view === 'timeline' ? renderTimelineView() : renderGanttView()
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400">
            <div className="text-center">
              <p className="text-lg mb-2">No timeline events</p>
              <p className="text-sm">Add properties to see their project timelines</p>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-dark-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-dark-500 uppercase">Event Type</p>
                <p className={clsx('font-medium', EVENT_COLORS[selectedEvent.eventType].text)}>
                  {EVENT_LABELS[selectedEvent.eventType]}
                </p>
              </div>
              <div>
                <p className="text-xs text-dark-500 uppercase">Property</p>
                <p className="text-white">{selectedEvent.propertyAddress}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500 uppercase">Start Date</p>
                <p className="text-white">{selectedEvent.startDate.toLocaleDateString()}</p>
              </div>
              {selectedEvent.endDate && (
                <div>
                  <p className="text-xs text-dark-500 uppercase">End Date</p>
                  <p className="text-white">{selectedEvent.endDate.toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-dark-500 uppercase">Status</p>
                <p className={selectedEvent.isCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                  {selectedEvent.isCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => {
                  const prop = properties.find(p => p.id === selectedEvent.propertyId);
                  if (prop) onPropertyClick?.(prop);
                  setSelectedEvent(null);
                }}
              >
                View Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
