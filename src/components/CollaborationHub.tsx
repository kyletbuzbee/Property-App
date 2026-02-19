'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface CollaborationHubProps {
  properties: PropertyWithCalculations[];
  onPropertyClick?: (property: PropertyWithCalculations) => void;
}

// Sample team members
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

// Sample comments
interface Comment {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

const SAMPLE_TEAM: TeamMember[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Deal Lead', avatar: 'JS', status: 'online' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Analyst', avatar: 'SW', status: 'online' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Contractor', avatar: 'MJ', status: 'away' },
  { id: '4', name: 'Emily Brown', email: 'emily@example.com', role: 'Investor', avatar: 'EB', status: 'offline' },
];

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: '1',
    propertyId: '1',
    userId: '1',
    userName: 'John Smith',
    userAvatar: 'JS',
    content: 'This property looks great! The cap rate is above our target.',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    propertyId: '1',
    userId: '2',
    userName: 'Sarah Wilson',
    userAvatar: 'SW',
    content: 'I agree. The neighborhood is up and coming with new developments.',
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: '3',
    propertyId: '2',
    userId: '3',
    userName: 'Mike Johnson',
    userAvatar: 'MJ',
    content: 'Rehab estimate looks realistic. Can start in 2 weeks.',
    createdAt: new Date(Date.now() - 7200000),
  },
];

export default function CollaborationHub({ properties, onPropertyClick }: CollaborationHubProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'team' | 'activity'>('comments');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Filter comments by selected property
  const filteredComments = useMemo(() => {
    if (!selectedPropertyId) return SAMPLE_COMMENTS;
    return SAMPLE_COMMENTS.filter(c => c.propertyId === selectedPropertyId);
  }, [selectedPropertyId]);

  // Get comments count per property
  const commentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SAMPLE_COMMENTS.forEach(c => {
      counts[c.propertyId] = (counts[c.propertyId] || 0) + 1;
    });
    return counts;
  }, []);

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-lg font-bold text-white">Collaboration Hub</h2>
        <p className="text-sm text-dark-400">Team communication and activity</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-700">
        {(['comments', 'team', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 py-3 text-sm font-medium transition-colors capitalize',
              activeTab === tab
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-dark-400 hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="p-4">
            {/* Property Filter */}
            <div className="mb-4">
              <label className="text-xs text-dark-500 block mb-2">Filter by Property</label>
              <select
                value={selectedPropertyId || ''}
                onChange={(e) => setSelectedPropertyId(e.target.value || null)}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded text-white"
              >
                <option value="">All Properties</option>
                {properties.slice(0, 10).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.address.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Comments List */}
            <div className="space-y-3 mb-4">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="bg-dark-800 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white">
                      {comment.userAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white text-sm">{comment.userName}</span>
                        <span className="text-xs text-dark-500">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-dark-400 mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Comment */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 bg-dark-800 border border-dark-700 rounded text-white"
              />
              <button
                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                onClick={() => {
                  if (newComment.trim()) {
                    setNewComment('');
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="p-4">
            <div className="space-y-2">
              {SAMPLE_TEAM.map((member) => (
                <div 
                  key={member.id} 
                  className="bg-dark-800 rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center text-sm font-bold text-white">
                      {member.avatar}
                    </div>
                    <div className={clsx(
                      'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-800',
                      member.status === 'online' ? 'bg-emerald-400' :
                      member.status === 'away' ? 'bg-amber-400' : 'bg-dark-500'
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-dark-400">{member.role}</p>
                  </div>
                  <button className="px-3 py-1 bg-dark-700 rounded text-sm text-dark-400 hover:text-white transition-colors">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="p-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dark-700" />
              
              <div className="space-y-4">
                {[
                  { user: 'John Smith', action: 'added a comment', target: '123 Main St', time: '10 minutes ago' },
                  { user: 'Sarah Wilson', action: 'updated deal score', target: '456 Oak Ave', time: '25 minutes ago' },
                  { user: 'Mike Johnson', action: 'uploaded photos', target: '789 Pine Rd', time: '1 hour ago' },
                  { user: 'Emily Brown', action: 'marked as favorite', target: '321 Elm St', time: '2 hours ago' },
                  { user: 'John Smith', action: 'changed strategy to BRRR', target: '654 Maple Dr', time: '3 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 relative">
                    <div className="w-2 h-2 rounded-full bg-primary-500 z-10 mt-2" />
                    <div className="flex-1 bg-dark-800 rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-medium text-white">{activity.user}</span>
                        {' '}
                        <span className="text-dark-400">{activity.action}</span>
                        {' '}
                        <span className="text-primary-400">{activity.target}</span>
                      </p>
                      <p className="text-xs text-dark-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
