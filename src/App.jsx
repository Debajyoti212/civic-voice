import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { IssueProvider } from './context/IssueContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import CityMap from './pages/CityMap.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Analytics from './pages/Analytics.jsx';

// Simple Landing Page wrapper using existing index.html content (mocked for react router)
function Landing() {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--gray-900)', color:'white', textAlign:'center', padding:'20px'}}>
      <h1 style={{fontSize:'3rem', marginBottom:'20px', color:'var(--accent)'}}>Civic Voice</h1>
      <p style={{fontSize:'1.2rem', marginBottom:'40px', maxWidth:'600px'}}>Empowering citizens to report, track, and resolve local issues — transforming governance with transparency and trust.</p>
      <a href="/login" className="btn btn-primary btn-lg">Access Platform</a>
    </div>
  );
}

function AppLayout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <div style={{ paddingTop: '64px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IssueProvider>
          <NotificationProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Citizen Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
                <Route path="/issue/:id" element={<ProtectedRoute><IssueDetail /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><CityMap /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </AppLayout>
          </NotificationProvider>
        </IssueProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
