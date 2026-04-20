import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Helper component to fix Leaflet's common "blank map" issue on mount for AWS/deployed sites
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    // Small delay to ensure the container is fully rendered in the DOM
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function DonorMap() {
  const [donors, setDonors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("detecting"); // detecting, blocked, allowed
  const [loading, setLoading] = useState(false);
  const [errorHeader, setErrorHeader] = useState("");

  // Memoized Icons to ensure they are only created once and are safe from top-level L access issues
  const icons = useMemo(() => ({
    premium: new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/148/148836.png",
      iconSize: [45, 45],
      className: "glow-marker-premium",
      iconAnchor: [22, 45],
      popupAnchor: [0, -45]
    }),
    standard: new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/148/148836.png",
      iconSize: [25, 25],
      className: "marker-standard",
      iconAnchor: [12, 25],
      popupAnchor: [0, -25]
    }),
    user: new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
      iconSize: [35, 35],
      iconAnchor: [17, 35]
    })
  }), []);

  useEffect(() => {
    fetchDonors();
    getUserLocation();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    setErrorHeader("");
    try {
      const res = await axios.get("/api/donors");
      // CRITICAL: Ensure we only set donors if the response is actually an array
      if (res.data && Array.isArray(res.data)) {
        setDonors(res.data);
      } else {
        console.error("API returned non-array data:", res.data);
        setErrorHeader("Unexpected data format from server.");
        setDonors([]); // Fallback to empty array to prevent .map crashes
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorHeader("Could not connect to donor database.");
      setDonors([]); // Fallback to empty array to prevent .map crashes
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLocationStatus("detecting");
    
    // Check for insecure origin (HTTP vs HTTPS)
    const isInsecure = window.location.protocol === "http:" && 
                     window.location.hostname !== "localhost" && 
                     window.location.hostname !== "127.0.0.1";

    if (isInsecure) {
      console.warn("Geolocation requires HTTPS. Using IP fallback.");
      getIPLocation();
      return;
    }

    if (!navigator.geolocation) {
      getIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus("allowed");
      },
      (err) => {
        console.warn("Browser location error:", err.message);
        getIPLocation();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const getIPLocation = async () => {
    try {
      const res = await axios.get("https://ipapi.co/json/");
      if (res.data && res.data.latitude && res.data.longitude) {
        setUserLocation({
          lat: res.data.latitude,
          lng: res.data.longitude
        });
        setLocationStatus("ip"); // New status for showing warning
      } else {
        setLocationStatus("blocked");
      }
    } catch (err) {
      console.error("IP fallback failed:", err);
      setLocationStatus("blocked");
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
    <div style={{ height: "calc(100vh - 80px)", width: "100%", position: "relative", zIndex: 1, backgroundColor: "#222" }}>
      {/* UI Overlay for Controls and Status */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "12px 25px",
        borderRadius: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        minWidth: "250px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", width: "100%", justifyContent: "center" }}>
          <button 
            onClick={fetchDonors} 
            disabled={loading}
            style={{
              border: "none",
              background: "#b30000",
              color: "white",
              padding: "8px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s"
            }}
          >
            {loading ? "⌛ Loading..." : "🔄 Refresh Map"}
          </button>

          {locationStatus === "blocked" && (
            <span style={{ color: "#d9534f", fontSize: "0.8rem", fontWeight: "bold" }}>
               📍 Location Access Denied
            </span>
          )}

          {locationStatus === "ip" && (
            <span style={{ color: "#888", fontSize: "0.75rem", fontWeight: "bold" }}>
               📍 Using Approximate Location (IP-based)
            </span>
          )}
        </div>
        
        {errorHeader && (
          <div style={{ color: "#b30000", fontSize: "0.85rem", fontWeight: "bold" }}>
            ⚠️ {errorHeader}
          </div>
        )}
      </div>

      <MapContainer
        center={[17.385044, 78.486671]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <ResizeMap />
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.user}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Robust check for donors array before mapping */}
        {Array.isArray(donors) && donors.length > 0 ? (
          donors.map((donor, idx) => {
            if (!donor || typeof donor !== 'object') return null;
            const lat = parseFloat(donor.latitude) || 17.385044;
            const lng = parseFloat(donor.longitude) || 78.486671;
            const distance = userLocation ? getDistance(userLocation.lat, userLocation.lng, lat, lng) : null;
            const isNearby = distance !== null && distance < 50;

            return (
              <Marker
                key={donor._id || idx}
                position={[lat, lng]}
                icon={isNearby ? icons.premium : icons.standard}
              >
                <Popup>
                  <div style={{ color: "black", minWidth: "150px" }}>
                    <h3 style={{ margin: "0 0 5px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                      {donor.name || "Unknown Donor"}
                    </h3>
                    <p style={{ margin: "5px 0" }}>🩸 <b>{donor.bloodGroup}</b></p>
                    <p style={{ margin: "5px 0" }}>📍 {donor.city}</p>
                    <p style={{ margin: "5px 0" }}>📞 <a href={`tel:${donor.phone}`} style={{ color: "#b30000", textDecoration: "none" }}>{donor.phone}</a></p>
                    {distance !== null && (
                      <p style={{ margin: "5px 0", color: isNearby ? "#28a745" : "#666", fontWeight: isNearby ? "bold" : "normal" }}>
                        📏 Distance: {distance.toFixed(1)} km
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })
        ) : !loading && (
          // Placeholder if no donors found or map is empty
          <div style={{ display: "none" }}>No donors to display</div>
        )}
      </MapContainer>
    </div>
  );
}

export default DonorMap;
