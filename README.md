# ⚡ ChargePath — EV Charging Station Finder

A full-stack web application that helps Electric Vehicle (EV) users find charging stations along their route. Enter a starting point and destination, and ChargePath shows all nearby charging stations on a real interactive map with live availability status.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express)
![Leaflet](https://img.shields.io/badge/Leaflet.js-Map-199900?style=for-the-badge&logo=leaflet)

---

## 📸 Preview

The app shows a split-screen layout:
- **Left Panel** — Search route, view station list with availability status and slot bars
- **Right Panel** — Real interactive map with color-coded station markers and route line

---

## ✨ Features

- 🗺️ **Real Interactive Map** — Powered by Leaflet.js + OpenStreetMap (100% free)
- 🔍 **Route Search** — Enter any start and destination city to find stations along the way
- 🟢 **Live Availability** — Each station shows Available, Partially Free, or Fully Occupied
- ⚡ **Slot Bars** — Visual indicator showing how many ports are free vs occupied
- 📍 **Geocoding** — Converts city names to map coordinates using Nominatim API
- 🛣️ **Route Line** — Draws the path between your start and destination on the map
- ⏱️ **Charge Time Estimate** — Shows estimated charging time at each station
- 💰 **Cost Estimate** — Shows approximate charging cost
- 🖱️ **Clickable Markers** — Click any station on the map to see full details in a popup
- 📱 **REST API** — Full backend API with GET, POST, PATCH, DELETE endpoints

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | Building the user interface |
| Leaflet.js | Interactive map library |
| react-leaflet | React wrapper for Leaflet |
| OpenStreetMap | Free map tiles |
| Nominatim API | Free geocoding (city name → coordinates) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | API framework |
| JSON File (db.json) | Local database for development |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |
| nodemon | Auto-restart on code changes |

---

## 📁 Project Structure

```
chargepath/                    ← Frontend
├── public/
├── src/
│   ├── App.js                 ← Main React component
│   └── App.css
├── package.json
└── README.md

chargepath-backend/            ← Backend
├── index.js                   ← Express server + API routes
├── db.json                    ← JSON database (auto-created on first run)
├── .env                       ← Environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) v18 or higher
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/chargepath.git
```

**2. Setup and run the Backend**
```bash
cd chargepath-backend
npm install
npm run dev
```
You should see: `🚀 Server running on port 5000`

**3. Setup and run the Frontend**

Open a new terminal:
```bash
cd chargepath
npm install
npm start
```
Browser opens automatically at: `http://localhost:3000`

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stations` | Get all charging stations |
| POST | `/api/stations` | Add a new station |
| PATCH | `/api/stations/:id` | Update station status |
| DELETE | `/api/stations/:id` | Delete a station |

### Example Response — GET /api/stations
```json
[
  {
    "id": "1",
    "name": "Tata Power EV — Khopoli",
    "type": "DC Fast 60kW",
    "ports": 4,
    "free": 4,
    "status": "available",
    "pos": [18.7518, 73.3432],
    "city": "Mumbai-Pune"
  }
]
```

---

## 🗺️ How It Works

1. User enters **starting city** and **destination city**
2. App calls **Nominatim API** to convert city names to coordinates
3. App calculates the **midpoint** between the two cities
4. App filters stations within **300km** of the midpoint
5. Stations shown on the **map as colored markers**
6. A **route line** is drawn between the two cities
7. User clicks any marker to see **full station details**

---

## 🎨 Station Status Colors

| Color | Status | Meaning |
|---|---|---|
| 🟢 Green | Available | All ports are free |
| 🟡 Yellow | Partially Free | Some ports are occupied |
| 🔴 Red | Full | All ports are occupied |

---

## 🔮 Future Improvements

- [ ] Connect to real charging network APIs (Tata Power, ChargeZone, Ather)
- [ ] Replace JSON database with MongoDB Atlas
- [ ] Add Socket.io for real-time status updates
- [ ] User authentication and saved routes
- [ ] Mobile app using React Native
- [ ] OCPP protocol integration for real station communication
- [ ] Filter stations by charger type (DC Fast / AC Level 2)
- [ ] Navigation integration

---

## 👨‍💻 Author

**Mohammed Shoeb Bagwan**

---

## 🙏 Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org) — Free map data
- [Leaflet.js](https://leafletjs.com) — Interactive map library
- [Nominatim](https://nominatim.org) — Free geocoding API
- [Express.js](https://expressjs.com) — Backend framework

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
