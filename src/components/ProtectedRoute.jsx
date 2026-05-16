import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'var(--gray-900)' }}><span className="spinner" style={{width: 40, height: 40, borderWidth: 4, borderColor: 'var(--accent)', borderRightColor: 'transparent'}}></span></div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
