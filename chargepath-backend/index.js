const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple JSON database
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database with stations if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    stations: [
      { id: "1", name: "Tata Power EV — Khopoli", type: "DC Fast 60kW", ports: 4, free: 4, status: "available", pos: [18.7518, 73.3432], city: "Mumbai-Pune" },
      { id: "2", name: "Ather Grid — Lonavala", type: "AC Level 2 22kW", ports: 6, free: 2, status: "partial", pos: [18.7481, 73.4072], city: "Mumbai-Pune" },
      { id: "3", name: "ChargeZone — Khandala", type: "DC Fast 120kW", ports: 3, free: 0, status: "occupied", pos: [18.7601, 73.3759], city: "Mumbai-Pune" },
      { id: "4", name: "Zeon EV Hub — Talegaon", type: "DC Fast 90kW", ports: 5, free: 4, status: "available", pos: [18.7260, 73.6755], city: "Mumbai-Pune" },
      { id: "5", name: "Magenta ChargeGrid — Hinjewadi", type: "AC Level 2 22kW", ports: 8, free: 7, status: "available", pos: [18.5912, 73.7380], city: "Pune" },
      { id: "6", name: "Tata Power — Indore", type: "DC Fast 60kW", ports: 4, free: 3, status: "available", pos: [22.7196, 75.8577], city: "Indore" },
      { id: "7", name: "Ather Grid — Vijay Nagar Indore", type: "AC Level 2 22kW", ports: 6, free: 0, status: "occupied", pos: [22.7533, 75.8937], city: "Indore" },
      { id: "8", name: "ChargeZone — Bhopal", type: "DC Fast 90kW", ports: 5, free: 4, status: "available", pos: [23.2599, 77.4126], city: "Bhopal" },
      { id: "9", name: "Tata Power — Nagpur", type: "DC Fast 90kW", ports: 5, free: 5, status: "available", pos: [21.1458, 79.0882], city: "Nagpur" },
      { id: "10", name: "BPCL EV Point — Thane", type: "AC Level 2 22kW", ports: 6, free: 0, status: "occupied", pos: [19.2183, 72.9781], city: "Mumbai" },
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const saveDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// GET all stations
app.get('/api/stations', (req, res) => {
  const db = getDB();
  res.json(db.stations);
});

// POST add new station
app.post('/api/stations', (req, res) => {
  const db = getDB();
  const newStation = { id: Date.now().toString(), ...req.body };
  db.stations.push(newStation);
  saveDB(db);
  res.json(newStation);
});

// PATCH update station status
app.patch('/api/stations/:id', (req, res) => {
  const db = getDB();
  const index = db.stations.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Station not found' });
  db.stations[index] = { ...db.stations[index], ...req.body };
  saveDB(db);
  res.json(db.stations[index]);
});

// DELETE station
app.delete('/api/stations/:id', (req, res) => {
  const db = getDB();
  db.stations = db.stations.filter(s => s.id !== req.params.id);
  saveDB(db);
  res.json({ message: 'Deleted successfully' });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
