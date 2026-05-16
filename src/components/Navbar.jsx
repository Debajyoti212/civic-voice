import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { timeAgo } from '../utils/helpers.js';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="top-navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">CV</div>
          <span className="brand-text">Civic Voice</span>
        </Link>
      </div>

      <div className="nav-center">
        <div className="nav-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search issues..." />
        </div>
      </div>

      <div className="nav-right">
        {/* Notifications */}
        <div className="nav-notif-wrapper" ref={notifRef}>
          <button className="nav-icon-btn" onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }} id="notif-bell">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>
          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && <button onClick={markAllRead} className="notif-mark-all">Mark all read</button>}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <p className="notif-empty">No notifications yet</p>
                ) : notifications.slice(0, 8).map(n => (
                  <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => markAsRead(n.id)}>
                    <span className={`notif-dot ${n.type}`}></span>
                    <div>
                      <p className="notif-msg">{n.message}</p>
                      <span className="notif-time">{timeAgo(n.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="nav-profile-wrapper" ref={profileRef}>
          <button className="nav-profile-btn" onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }} id="profile-btn">
            <span className="profile-avatar">{user?.avatar || '👤'}</span>
            <span className="profile-name">{user?.name || 'User'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <span className="profile-avatar-lg">{user?.avatar || '👤'}</span>
                <div>
                  <p className="profile-name-lg">{user?.name}</p>
                  <p className="profile-role">{user?.role === 'admin' ? 'Municipal Staff' : 'Citizen'}</p>
                </div>
              </div>
              <hr />
              <button className="profile-action" onClick={logout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
