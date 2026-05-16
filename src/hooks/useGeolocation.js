import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPosition = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setPosition({ lat: 28.6139, lng: 77.2090, area: 'Delhi, India (default)' });
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let areaName = 'Detected Location';
        
        try {
          // Reverse geocoding using free OpenStreetMap API
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          if (data && data.address) {
            // Try to get the most relevant area name (city, town, or suburb)
            const city = data.address.city || data.address.town || data.address.state_district || '';
            const state = data.address.state || '';
            if (city && state) {
              areaName = `${city}, ${state}`;
            } else if (city || state) {
              areaName = city || state;
            } else if (data.display_name) {
              // Fallback to a shortened version of the full display name
              areaName = data.display_name.split(',').slice(0, 2).join(',');
            }
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }

        setPosition({ lat, lng, area: areaName });
        setLoading(false);
      },
      (error) => {
        let errorMsg = 'Location access denied';
        if (error.code === 1) errorMsg = 'Permission denied by user';
        else if (error.code === 2) errorMsg = 'Position unavailable (No GPS signal)';
        else if (error.code === 3) errorMsg = 'Timeout getting location';
        
        console.warn("Geolocation Error:", errorMsg, error.message);
        setPosition({ lat: 28.6139, lng: 77.2090, area: 'Delhi, India (default)' });
        setError(errorMsg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => { getPosition(); }, []);

  return { position, error, loading, refresh: getPosition };
}
