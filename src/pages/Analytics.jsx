import { useMemo } from 'react';
import { useIssues } from '../context/IssueContext.jsx';
import { CATEGORIES } from '../utils/constants.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import './Analytics.css';

export default function Analytics() {
  const { issues } = useIssues();

  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      name: cat.label,
      count: issues.filter(i => i.category === cat.id).length,
      fill: cat.color
    })).filter(d => d.count > 0).sort((a,b) => b.count - a.count);
  }, [issues]);

  const statusData = useMemo(() => {
    const counts = { pending: 0, acknowledged: 0, in_progress: 0, resolved: 0 };
    issues.forEach(i => { if(counts[i.status] !== undefined) counts[i.status]++; });
    return [
      { name: 'Pending', value: counts.pending, color: '#f59e0b' },
      { name: 'In Progress', value: counts.acknowledged + counts.in_progress, color: '#3b82f6' },
      { name: 'Resolved', value: counts.resolved, color: '#10b981' }
    ].filter(d => d.value > 0);
  }, [issues]);

  const timelineData = useMemo(() => {
    const days = {};
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toLocaleDateString('en-US', {weekday: 'short'})] = 0;
    }
    
    issues.forEach(issue => {
      const d = new Date(issue.createdAt).toLocaleDateString('en-US', {weekday: 'short'});
      if (days[d] !== undefined) days[d]++;
    });
    
    return Object.keys(days).map(key => ({ name: key, reports: days[key] }));
  }, [issues]);

  const avgResolutionTime = '2.4 days'; // Mock stat
  const totalResolved = issues.filter(i => i.status === 'resolved').length;

  return (
    <div className="page-container analytics-page">
      <div className="page-header">
        <h1>City Analytics</h1>
        <p>Data-driven insights for smarter governance.</p>
      </div>

      <div className="grid-3 mb-24">
        <div className="stat-card">
          <div className="stat-label">Total Issues Reported</div>
          <div className="stat-value" style={{color:'var(--text-primary)', marginTop:'8px'}}>{issues.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolution Rate</div>
          <div className="stat-value" style={{color:'#10b981', marginTop:'8px'}}>
            {issues.length ? Math.round((totalResolved / issues.length) * 100) : 0}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Resolution Time</div>
          <div className="stat-value" style={{color:'#3b82f6', marginTop:'8px'}}>{avgResolutionTime}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card chart-card">
          <div className="card-body">
            <h3>Issues by Category</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                  <Tooltip cursor={{fill: 'var(--gray-50)'}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-body">
            <h3>Status Distribution</h3>
            <div className="chart-wrapper flex-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {statusData.map(d => (
                  <div key={d.name} className="legend-item">
                    <span className="legend-color" style={{background: d.color}}></span>
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card chart-card full-width">
          <div className="card-body">
            <h3>Reports Last 7 Days</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="reports" stroke="var(--accent)" strokeWidth={3} dot={{r:4, fill:'var(--accent)'}} activeDot={{r:6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
