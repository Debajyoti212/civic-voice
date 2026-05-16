import { useEffect, useRef, useState } from 'react';
import { useIssues } from '../context/IssueContext.jsx';
import { getCategoryIcon } from '../utils/helpers.js';
import { CATEGORIES, STATUS_LIST } from '../utils/constants.js';
import { useNavigate } from 'react-router-dom';
import * as L from 'leaflet';
import './CityMap.css';

export default function CityMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const { issues } = useIssues();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([28.6139, 77.2090], 11);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach(m => mapInstance.current.removeLayer(m));
    markersRef.current = [];

    const filteredIssues = issues.filter(i => {
      if (filter !== 'all' && i.status !== filter) return false;
      if (catFilter !== 'all' && i.category !== catFilter) return false;
      return true;
    });

    filteredIssues.forEach(issue => {
      if (!issue.location || !issue.location.lat || !issue.location.lng) return;

      const statusColor = STATUS_LIST.find(s => s.id === issue.status)?.color || '#9ca3af';
      
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${statusColor}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white; font-size: 14px;">${getCategoryIcon(issue.category)}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], { icon: customIcon }).addTo(mapInstance.current);
      
      marker.on('click', () => {
        navigate(`/issue/${issue.id}`);
      });

      const popupContent = `
        <div class="map-popup">
          <h4>${issue.title}</h4>
          <p>${issue.location.area}</p>
          <span style="color: ${statusColor}; font-weight: bold; font-size: 12px; text-transform: uppercase;">${issue.status}</span>
          <div style="margin-top: 8px; font-size: 12px; color: #dc2626; cursor: pointer;">Click to view details &rarr;</div>
        </div>
      `;
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  }, [issues, filter, catFilter, navigate]);

  return (
    <div className="page-container map-page">
      <div className="page-header map-header">
        <div>
          <h1>City Map View</h1>
          <p>Live tracking of all civic issues across the city.</p>
        </div>
        <div className="map-filters">
          <select className="form-input" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {STATUS_LIST.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select className="form-input" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
      </div>
      
      <div className="map-container card">
        <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px' }}></div>
      </div>
    </div>
  );
}
