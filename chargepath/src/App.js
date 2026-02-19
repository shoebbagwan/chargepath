import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const allStations = [
];

// Helper to get distance between two coordinates in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Component to move map view
function MapController({ center, zoom }) {
  const map = useMap();
  if (center) map.setView(center, zoom);
  return null;
}

function App() {
  const [selected, setSelected] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [stations, setStations] = useState([]);
  const [routeLine, setRouteLine] = useState([]);
  const [mapCenter, setMapCenter] = useState([18.7481, 73.4072]);
  const [mapZoom, setMapZoom] = useState(7);
  const [loading, setLoading] = useState(false);
  const [allStations, setAllStations] = useState([]);

React.useEffect(() => {
  fetch('http://localhost:5000/api/stations')
    .then(res => res.json())
    .then(data => setAllStations(data))
    .catch(err => console.log(err));
}, []);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    if (status === 'available') return '#00ff88';
    if (status === 'partial') return '#ffd60a';
    return '#ff4d6d';
  };

  const getStatusText = (status) => {
    if (status === 'available') return 'Available';
    if (status === 'partial') return 'Partially Free';
    return 'Full';
  };

  const createIcon = (status, isSelected) => L.divIcon({
    className: '',
    html: `<div style="
      width:${isSelected ? 36 : 28}px;
      height:${isSelected ? 36 : 28}px;
      border-radius:50%;
      background:${getStatusColor(status)};
      border:3px solid white;
      box-shadow:0 0 12px ${getStatusColor(status)};
      display:flex;align-items:center;justify-content:center;
      font-size:${isSelected ? 18 : 14}px;
      transition: all 0.2s;
    ">⚡</div>`,
    iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
    iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
  });

  const geocode = async (place) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`);
    const data = await res.json();
    if (data.length === 0) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  const handleSearch = async () => {
    if (!from || !to) { setError('Please enter both start and destination!'); return; }
    setError('');
    setLoading(true);

    const fromCoords = await geocode(from);
    const toCoords = await geocode(to);

    if (!fromCoords || !toCoords) {
      setError('Could not find one of the locations. Try again!');
      setLoading(false);
      return;
    }

    // Find stations within 100km of the route midpoint
    const midLat = (fromCoords[0] + toCoords[0]) / 2;
    const midLon = (fromCoords[1] + toCoords[1]) / 2;

    const nearby = allStations.filter(s => getDistance(midLat, midLon, s.pos[0], s.pos[1]) < 300);

    setStations(nearby);
    setRouteLine([fromCoords, ...nearby.map(s => s.pos), toCoords]);
    setMapCenter([midLat, midLon]);
    setMapZoom(9);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#0a0f1e', color: '#e2e8f0' }}>

      {/* LEFT PANEL */}
      <div style={{ width: 360, background: '#111827', borderRight: '1px solid #1e2d4a', display: 'flex', flexDirection: 'column' }}>

        <div style={{ padding: '20px', borderBottom: '1px solid #1e2d4a' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#00e5ff' }}>⚡ ChargePath</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>EV Route Planner</div>
        </div>

        <div style={{ padding: 16, borderBottom: '1px solid #1e2d4a' }}>
          <input
            style={{ width: '100%', background: '#161f35', border: '1px solid #1e2d4a', borderRadius: 8, padding: '10px 12px', color: '#e2e8f0', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
            placeholder="🟢 Starting point (e.g. Mumbai)"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
          <input
            style={{ width: '100%', background: '#161f35', border: '1px solid #1e2d4a', borderRadius: 8, padding: '10px 12px', color: '#e2e8f0', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
            placeholder="🔵 Destination (e.g. Pune)"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
          {error && <div style={{ color: '#ff4d6d', fontSize: 12, marginBottom: 8 }}>{error}</div>}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#1e2d4a' : '#00e5ff', color: loading ? '#64748b' : '#0a0f1e', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '🔍 Searching...' : '⚡ Find Charging Stations'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {stations.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}>
              <div style={{ fontSize: 40 }}>🔌</div>
              <div style={{ marginTop: 10 }}>Enter a route to find charging stations</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                {stations.length} stations found
              </div>
              {stations.map(station => (
                <div key={station.id} onClick={() => setSelected(station.id)}
                  style={{ background: selected === station.id ? 'rgba(0,229,255,0.07)' : '#161f35', border: `1px solid ${selected === station.id ? '#00e5ff' : '#1e2d4a'}`, borderRadius: 10, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{station.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: getStatusColor(station.status), background: `${getStatusColor(station.status)}22`, padding: '3px 8px', borderRadius: 20 }}>
                      {getStatusText(station.status)}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                    📍 {station.distance} &nbsp;⚡ {station.type} &nbsp;⏱ {station.time}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: station.ports }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < (station.ports - station.free) ? '#ff4d6d' : '#00ff88' }} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #1e2d4a', background: '#0a0f1e', display: 'flex', gap: 16, justifyContent: 'center', fontSize: 13 }}>
          <span style={{ color: '#00e5ff', fontWeight: 700 }}>⚡ 28 min charge</span>
          <span style={{ color: '#64748b' }}>|</span>
          <span>🔋 20% → 80%</span>
          <span style={{ color: '#64748b' }}>|</span>
          <span>💰 ₹180 est.</span>
        </div>
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController center={mapCenter} zoom={mapZoom} />
          {routeLine.length > 0 && <Polyline positions={routeLine} color="#00e5ff" weight={4} dashArray="8,4" />}
          {stations.map(station => (
            <Marker key={station.id} position={station.pos} icon={createIcon(station.status, selected === station.id)}>
              <Popup>
                <div style={{ fontFamily: 'sans-serif', minWidth: 180 }}>
                  <strong>{station.name}</strong><br /><br />
                  Status: <span style={{ color: getStatusColor(station.status), fontWeight: 700 }}>{getStatusText(station.status)}</span><br />
                  Type: {station.type}<br />
                  Free slots: {station.free}/{station.ports}<br />
                  Charge time: {station.time}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}

export default App;