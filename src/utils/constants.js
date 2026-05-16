export const CATEGORIES = [
  { id: 'roads', label: 'Roads & Potholes', icon: '🛣️', color: '#f59e0b' },
  { id: 'water', label: 'Water Supply', icon: '💧', color: '#3b82f6' },
  { id: 'electricity', label: 'Electricity', icon: '⚡', color: '#eab308' },
  { id: 'sanitation', label: 'Sanitation', icon: '🗑️', color: '#10b981' },
  { id: 'safety', label: 'Public Safety', icon: '🛡️', color: '#ef4444' },
  { id: 'drainage', label: 'Drainage', icon: '🌊', color: '#6366f1' },
  { id: 'parks', label: 'Parks & Gardens', icon: '🌳', color: '#22c55e' },
  { id: 'other', label: 'Other', icon: '📌', color: '#8b5cf6' },
];

export const STATUS_LIST = [
  { id: 'pending', label: 'Pending', color: '#f59e0b', badge: 'badge-pending' },
  { id: 'acknowledged', label: 'Acknowledged', color: '#6366f1', badge: 'badge-progress' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6', badge: 'badge-progress' },
  { id: 'resolved', label: 'Resolved', color: '#10b981', badge: 'badge-resolved' },
];

export const PRIORITY_LIST = [
  { id: 'low', label: 'Low', color: '#10b981' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high', label: 'High', color: '#f97316' },
  { id: 'critical', label: 'Critical', color: '#ef4444' },
];

export const DEPARTMENTS = [
  'Public Works', 'Water Board', 'Electricity Board',
  'Sanitation Dept', 'Police', 'Municipal Corp', 'Parks Authority'
];
