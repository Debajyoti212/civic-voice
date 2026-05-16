import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useIssues } from '../context/IssueContext.jsx';
import { auth } from '../firebase';
import { CATEGORIES, STATUS_LIST } from '../utils/constants.js';
import { timeAgo, getCategoryIcon } from '../utils/helpers.js';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { issues, stats } = useIssues();
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const myIssues = useMemo(() => {
    let list = issues.filter(i => i.reportedBy === auth.currentUser?.uid);
    if (filter !== 'all') list = list.filter(i => i.status === filter);
    if (catFilter !== 'all') list = list.filter(i => i.category === catFilter);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [issues, filter, catFilter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="dash-header-row">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p>Track your reported civic issues and their resolution status.</p>
          </div>
          <Link to="/report" className="btn btn-primary" id="report-issue-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Report Issue
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 dash-stats">
        <div className="stat-card animate-in" style={{animationDelay:'0.05s'}}>
          <div className="stat-icon red">📋</div>
          <div className="stat-value">{stats.myTotal}</div>
          <div className="stat-label">Total Reported</div>
        </div>
        <div className="stat-card animate-in" style={{animationDelay:'0.1s'}}>
          <div className="stat-icon amber">⏳</div>
          <div className="stat-value">{issues.filter(i=>i.reportedBy===auth.currentUser?.uid&&i.status==='pending').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card animate-in" style={{animationDelay:'0.15s'}}>
          <div className="stat-icon blue">🔄</div>
          <div className="stat-value">{issues.filter(i=>i.reportedBy===auth.currentUser?.uid&&(i.status==='in_progress'||i.status==='acknowledged')).length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card animate-in" style={{animationDelay:'0.2s'}}>
          <div className="stat-icon green">✅</div>
          <div className="stat-value">{issues.filter(i=>i.reportedBy===auth.currentUser?.uid&&i.status==='resolved').length}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter==='all'?'active':''}`} onClick={()=>setFilter('all')}>All</button>
          {STATUS_LIST.map(s => (
            <button key={s.id} className={`filter-tab ${filter===s.id?'active':''}`} onClick={()=>setFilter(s.id)}>{s.label}</button>
          ))}
        </div>
        <select className="form-input filter-select" value={catFilter} onChange={e=>setCatFilter(e.target.value)} id="cat-filter">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
      </div>

      {/* Issues List */}
      <div className="issue-list">
        {myIssues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No issues found</h3>
            <p>{filter === 'all' ? "You haven't reported any issues yet." : 'No issues match the selected filters.'}</p>
            <Link to="/report" className="btn btn-primary">Report Your First Issue</Link>
          </div>
        ) : myIssues.map((issue, idx) => (
          <Link to={`/issue/${issue.id}`} key={issue.id} className="issue-card animate-in" style={{animationDelay:`${idx*0.05}s`}}>
            <div className="issue-card-left">
              <span className="issue-cat-icon">{getCategoryIcon(issue.category)}</span>
            </div>
            <div className="issue-card-body">
              <div className="issue-card-top">
                <h3>{issue.title}</h3>
                <span className={`badge badge-${issue.status === 'in_progress' || issue.status === 'acknowledged' ? 'progress' : issue.status}`}>
                  {STATUS_LIST.find(s=>s.id===issue.status)?.label || issue.status}
                </span>
              </div>
              <p className="issue-card-desc">{issue.description.slice(0, 120)}...</p>
              <div className="issue-card-meta">
                <span>📍 {issue.location?.area}</span>
                <span>🕐 {timeAgo(issue.createdAt)}</span>
                {issue.priority && <span className={`priority-dot priority-${issue.priority}`}>{issue.priority}</span>}
              </div>
            </div>
            <svg className="issue-card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
