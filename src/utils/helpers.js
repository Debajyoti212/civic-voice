export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const seconds = Math.floor((now - d) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getStatusColor(status) {
  const map = { pending: '#f59e0b', acknowledged: '#6366f1', in_progress: '#3b82f6', resolved: '#10b981' };
  return map[status] || '#6b7280';
}

export function getCategoryIcon(catId) {
  const map = { roads: '🛣️', water: '💧', electricity: '⚡', sanitation: '🗑️', safety: '🛡️', drainage: '🌊', parks: '🌳', other: '📌' };
  return map[catId] || '📌';
}
