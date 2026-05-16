import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const citizenLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/report', icon: '📝', label: 'Report Issue' },
    { to: '/map', icon: '🗺️', label: 'City Map' },
    { to: '/analytics', icon: '📈', label: 'Analytics' },
  ];

  const adminLinks = [
    { to: '/admin', icon: '🏛️', label: 'Admin Panel' },
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/map', icon: '🗺️', label: 'City Map' },
    { to: '/analytics', icon: '📈', label: 'Analytics' },
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="logo-icon">CV</span>
          <span className="logo-text">Civic Voice</span>
        </div>
        <p className="sidebar-tagline">Smart City Platform</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon">{link.icon}</span>
            <span className="link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="user-avatar">{user?.avatar || '👤'}</span>
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{isAdmin ? 'Staff' : 'Citizen'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
