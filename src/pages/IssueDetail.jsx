import { useParams, Link, useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssueContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../firebase';
import { getCategoryIcon, formatDate, timeAgo, formatTime } from '../utils/helpers.js';
import { STATUS_LIST, PRIORITY_LIST } from '../utils/constants.js';
import './IssueDetail.css';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIssueById, updateIssueStatus } = useIssues();
  const { user } = useAuth();
  
  const issue = getIssueById(id);
  const isAdmin = user?.role === 'admin';

  if (!issue) {
    return (
      <div className="page-container empty-state">
        <div className="empty-icon">🔍</div>
        <h3>Issue not found</h3>
        <p>The issue you are looking for does not exist or has been removed.</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const statusObj = STATUS_LIST.find(s => s.id === issue.status);
  const priorityObj = PRIORITY_LIST.find(p => p.id === issue.priority);

  const handleStatusChange = (newStatus) => {
    updateIssueStatus(issue.id, newStatus, `Status updated to ${newStatus}`, user.name);
  };

  return (
    <div className="page-container">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <div className="detail-actions">
          {isAdmin && issue.status !== 'resolved' && (
            <select 
              className="form-input status-select" 
              value={issue.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {STATUS_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="card detail-card">
            <div className="card-body">
              <div className="detail-top-meta">
                <span className={`badge ${statusObj?.badge}`}>{statusObj?.label}</span>
                {priorityObj && (
                  <span className="priority-tag" style={{ color: priorityObj.color, background: `${priorityObj.color}15` }}>
                    <span className="pri-dot" style={{ background: priorityObj.color }}></span>
                    {priorityObj.label} Priority
                  </span>
                )}
                <span className="detail-date">{formatDate(issue.createdAt)}</span>
              </div>
              
              <h1 className="detail-title">{issue.title}</h1>
              
              <div className="detail-info-row">
                <div className="detail-info-item">
                  <span className="info-icon">{getCategoryIcon(issue.category)}</span>
                  <div>
                    <small>Category</small>
                    <p>{issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}</p>
                  </div>
                </div>
                <div className="detail-info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <small>Location</small>
                    <p>{issue.location?.area || 'Unknown'}</p>
                  </div>
                </div>
                {issue.department && (
                  <div className="detail-info-item">
                    <span className="info-icon">🏢</span>
                    <div>
                      <small>Assigned To</small>
                      <p>{issue.department}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="detail-desc-section">
                <h3>Description</h3>
                <p>{issue.description}</p>
              </div>

              {issue.photo && (
                <div className="detail-photo">
                  <img src={issue.photo} alt="Issue" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detail-side">
          <div className="card timeline-card">
            <div className="card-body">
              <h3>Status History</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Issue Reported</h4>
                    <p>By {issue.reportedBy === auth.currentUser?.uid ? 'You' : 'Citizen'}</p>
                    <span className="timeline-time">{formatDate(issue.createdAt)} at {formatTime(issue.createdAt)}</span>
                  </div>
                </div>
                
                {issue.updates && issue.updates.map((update, idx) => {
                  const uStatusObj = STATUS_LIST.find(s => s.id === update.status);
                  return (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot" style={{ background: uStatusObj?.color || 'var(--gray-300)' }}></div>
                      <div className="timeline-content">
                        <h4>{uStatusObj?.label || 'Updated'}</h4>
                        {update.note && <p>{update.note}</p>}
                        {update.by && <p className="timeline-by">By {update.by}</p>}
                        <span className="timeline-time">{formatDate(update.timestamp)} at {formatTime(update.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
