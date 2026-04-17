import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Icons
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

function DonorMap() {

  const [donors, setDonors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchDonors();
    getUserLocation();
  }, []);

  // ✅ CORRECTED API HANDLING
  
  const fetchDonors = async () => {
    try {
      const res = await axios.get("http://3.27.174.175:5000/api/donors");

      console.log("API DATA:", res.data);

      if (Array.isArray(res.data)) {
        setDonors(res.data);
      } else if (Array.isArray(res.data.data)) {
        setDonors(res.data.data);
      } else {
        setDonors([]);
      }

    } catch (err) {
      console.log("API Error:", err);
      setDonors([]);
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
        (err) => console.log("Location error:", err)
      );
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>

      <MapContainer
        center={[17.385044, 78.486671]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Donors */}
        {Array.isArray(donors) && donors.map((donor, idx) => {

          const lat = parseFloat(donor.latitude) || 17.385044;
          const lng = parseFloat(donor.longitude) || 78.486671;

          const distance = userLocation
            ? getDistance(userLocation.lat, userLocation.lng, lat, lng)
            : 999;

          const isNearby = distance < 50;

          return (
            <Marker
              key={donor._id || idx}
              position={[lat, lng]}
              icon={isNearby ? premiumIcon : standardIcon}
            >
              <Popup>
                <div>
                  <h3>{donor.name}</h3>
                  <p>🩸 {donor.bloodGroup}</p>
                  <p>📍 {donor.city}</p>
                  <p>📞 {donor.phone}</p>
                  <p>Distance: {distance.toFixed(1)} km</p>
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