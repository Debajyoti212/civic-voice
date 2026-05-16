import { useState } from 'react';
import { useIssues } from '../context/IssueContext.jsx';
import { getCategoryIcon, formatDate } from '../utils/helpers.js';
import { STATUS_LIST, DEPARTMENTS } from '../utils/constants.js';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { issues, updateIssueStatus, assignDepartment } = useIssues();
  const [filter, setFilter] = useState('all');

  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress' || i.status === 'acknowledged').length;

  const filteredIssues = issues.filter(i => filter === 'all' ? true : i.status === filter).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="page-container admin-page">
      <div className="page-header">
        <h1>Admin Control Panel</h1>
        <p>Manage and resolve city-wide issues.</p>
      </div>

      <div className="admin-overview grid-3">
        <div className="stat-card">
          <div className="stat-icon amber">⏳</div>
          <div className="stat-value">{pendingIssues}</div>
          <div className="stat-label">Pending Triage</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🔄</div>
          <div className="stat-value">{inProgressIssues}</div>
          <div className="stat-label">Active Work</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">⚠️</div>
          <div className="stat-value">{issues.filter(i=>i.priority==='critical').length}</div>
          <div className="stat-label">Critical Issues</div>
        </div>
      </div>

      <div className="admin-table-section card">
        <div className="table-header">
          <h3>Issue Queue</h3>
          <select className="form-input" value={filter} onChange={e=>setFilter(e.target.value)} style={{width: 'auto'}}>
            <option value="all">All Issues</option>
            {STATUS_LIST.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Status</th>
                <th>Assignment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue.id}>
                  <td className="td-id">#{issue.id.substring(0, 6)}</td>
                  <td>
                    <div className="td-title-cell">
                      <span className="td-icon">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <strong>{issue.title}</strong>
                        <span className="td-date">{formatDate(issue.createdAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td>{issue.location?.area?.substring(0,20)}...</td>
                  <td>
                    <span className={`badge badge-${issue.status === 'in_progress' || issue.status === 'acknowledged' ? 'progress' : issue.status}`}>
                      {STATUS_LIST.find(s=>s.id===issue.status)?.label || issue.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-input td-select" 
                      value={issue.department || ''}
                      onChange={(e) => assignDepartment(issue.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td>
                    <Link to={`/issue/${issue.id}`} className="btn btn-secondary btn-sm">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
