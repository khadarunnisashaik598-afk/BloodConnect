import React, { useEffect, useState } from "react";
import axios from "axios";

function NearbyDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [locationType, setLocationType] = useState("browser"); // browser or ip

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLoading(true);
    setErrorMsg("");

    const isInsecure = window.location.protocol === "http:" && 
                     window.location.hostname !== "localhost" && 
                     window.location.hostname !== "127.0.0.1";

    if (isInsecure) {
      console.warn("Insecure origin detected. Falling back to IP-based location.");
      getIPLocation();
      return;
    }

    if (!navigator.geolocation) {
      getIPLocation("Geolocation not supported. Using approximate location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationType("browser");
        fetchDonors(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Browser geolocation failed:", error.message);
        getIPLocation();
      },
      { timeout: 5000 }
    );
  };

  const getIPLocation = async (customMsg = "") => {
    try {
      const res = await axios.get("https://ipapi.co/json/");
      if (res.data && res.data.latitude && res.data.longitude) {
        setLocationType("ip");
        fetchDonors(res.data.latitude, res.data.longitude);
      } else {
        throw new Error("Invalid response from IP API");
      }
    } catch (err) {
      console.error("IP Location error:", err);
      setErrorMsg(customMsg || "Could not detect location. Please enable GPS or move to a secure site (HTTPS).");
      setLoading(false);
    }
  };

  const fetchDonors = async (lat, lon) => {
    try {
      const res = await axios.get("/api/donors");
      if (Array.isArray(res.data)) {
        const nearby = res.data.filter((donor) => {
          if (!donor.latitude || !donor.longitude || !donor.available) return false;
          const distance = getDistance(lat, lon, donor.latitude, donor.longitude);
          return distance < 50; // 50km radius
        });
        setDonors(nearby);
      } else {
        setErrorMsg("Unexpected data format from server.");
      }
    } catch (error) {
      setErrorMsg("Failed to fetch donor data.");
    } finally {
      setLoading(false);
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

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="page-title">📍 Donors Near You</h2>

      {locationType === "ip" && !errorMsg && !loading && (
        <div style={{ textAlign: "center", marginBottom: "20px", color: "#888", fontSize: "0.85rem", background: "rgba(0,0,0,0.05)", padding: "5px", borderRadius: "8px" }}>
          ⚠️ Using approximate location (IP-based). For better accuracy, use a secure connection (HTTPS).
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="pulse-btn" style={{ display: "inline-block", background: "white", borderRadius: "50%", padding: "20px" }}>📍</div>
          <p style={{ marginTop: "20px" }}>Detecting your location...</p>
        </div>
      ) : errorMsg ? (
        <div className="glass-container" style={{ textAlign: "center", color: "#ff4d4d", padding: "40px" }}>
          <h3>⚠️ Location Access Issue</h3>
          <p>{errorMsg}</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
            <button onClick={getLocation} className="glass-btn">🔄 Retry Detection</button>
            <button 
              onClick={() => {
                setLocationType("browser");
                fetchDonors(17.0005, 81.7835);
              }} 
              className="glass-btn" 
              style={{ background: "#b30000" }}
            >
              📍 Use Rajahmundry
            </button>
          </div>
        </div>
      ) : (
        <div className="donor-grid">
          {!Array.isArray(donors) || donors.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px" }} className="glass-container">
              <p>No available donors found within 50km of your location.</p>
              <button onClick={getLocation} className="glass-btn" style={{ marginTop: "20px" }}>🔄 Refresh Location</button>
            </div>
          ) : (
            donors.map((donor, idx) => (
              <div key={donor._id || idx} className="glass-card animate-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0 }}>{donor.name || "Unknown Donor"}</h3>
                  <span className="blood-chip active" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>{donor.bloodGroup}</span>
                </div>
                <p style={{ marginBottom: "8px" }}><b>City:</b> {donor.city}</p>
                <p style={{ marginBottom: "20px" }}><b>Status:</b> <span style={{ color: "#28a745" }}>Nearby</span></p>
                <a href={`tel:${donor.phone}`} style={{ textDecoration: "none" }}>
                  <button className="glass-btn pulse-btn" style={{ width: "100%" }}>📞 Contact Donor</button>
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NearbyDonors;