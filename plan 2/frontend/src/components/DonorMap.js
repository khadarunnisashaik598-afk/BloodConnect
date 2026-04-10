import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function DonorMap() {

  const [donors, setDonors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchDonors();
    getUserLocation();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donors");
      setDonors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.log("Geolocation error:", err)
      );
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Custom Icons
  const premiumIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/148/148836.png",
    iconSize: [45, 45],
    className: "glow-marker-premium",
    iconAnchor: [22, 45],
    popupAnchor: [0, -45]
  });

  const standardIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/148/148836.png",
    iconSize: [25, 25],
    className: "marker-standard",
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
  });

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35]
  });

  return (
    <div style={{ height: "650px", width: "100%", padding: "20px" }}>
      <style>{`
        .glow-marker-premium {
          filter: drop-shadow(0 0 10px #ff0000) drop-shadow(0 0 20px #ff4d4d);
          animation: pulse-glow 1.5s infinite alternate;
        }
        @keyframes pulse-glow {
          from { filter: drop-shadow(0 0 5px #ff0000); opacity: 0.8; }
          to { filter: drop-shadow(0 0 15px #ff0000) drop-shadow(0 0 25px #ff4d4d); opacity: 1; }
        }
        .marker-standard {
          filter: grayscale(0.5) opacity(0.7);
        }
      `}</style>
      
      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <span style={{ marginRight: "20px" }}>🔴 <b>Premium Highlight:</b> Donors &lt; 50km</span>
        <span>⚪ <b>Standard:</b> Other Donors</span>
      </div>

      <MapContainer
        center={[17.385044, 78.486671]}
        zoom={6}
        style={{ height: "100%", width: "100%", borderRadius: "20px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup><b>You are here</b></Popup>
          </Marker>
        )}

        {donors.map((donor, idx) => {
          const distance = userLocation 
            ? getDistance(userLocation.lat, userLocation.lng, donor.latitude, donor.longitude) 
            : 999;
          const isNearby = distance < 50;

          // Add a small jitter so overlapping donors can still be clicked
          const lat = (donor.latitude || 17.385044) + (donor.latitude ? 0 : (Math.random() - 0.5) * 0.1);
          const lng = (donor.longitude || 78.486671) + (donor.longitude ? 0 : (Math.random() - 0.5) * 0.1);

          return (
            <Marker
              key={donor._id || idx}
              position={[lat, lng]}
              icon={isNearby ? premiumIcon : standardIcon}
            >
            <Popup>
              <div style={{ minWidth: "150px" }}>
                <h3>{donor.name}</h3>
                <p>🩸 Blood Group: {donor.bloodGroup}</p>
                <p>📍 Location: {donor.city || donor.address || "Unknown"}</p>
                {userLocation && (
                  <p style={{ color: isNearby ? "#b30000" : "#666", fontWeight: "bold" }}>
                    📏 Distance: {distance.toFixed(1)} km {isNearby ? "(Nearby! 🚀)" : ""}
                  </p>
                )}
                <p>📞 {donor.phone}</p>
                <a href={`tel:${donor.phone}`}>
                  <button className="glass-btn" style={{ marginTop: "10px", width: "100%" }}>
                    Call Donor
                  </button>
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}

      </MapContainer>
    </div>
  );
}

export default DonorMap;