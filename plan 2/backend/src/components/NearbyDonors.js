import React, { useEffect, useState } from "react";
import axios from "axios";

function NearbyDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchDonors(lat, lon);
      },
      (error) => {
        setErrorMsg("Please enable location access to find nearby donors.");
        setLoading(false);
      }
    );
  }, []);

  const fetchDonors = async (lat, lon) => {
    try {
      const res = await axios.get("/api/donors");
      const nearby = res.data.filter((donor) => {
        if (!donor.latitude || !donor.longitude || !donor.available) return false;
        const distance = getDistance(lat, lon, donor.latitude, donor.longitude);
        return distance < 50; // 50km radius
      });
      setDonors(nearby);
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="pulse-btn" style={{ display: "inline-block", background: "white", borderRadius: "50%", padding: "20px" }}>📍</div>
          <p style={{ marginTop: "20px" }}>Detecting your location...</p>
        </div>
      ) : errorMsg ? (
        <div className="glass-container" style={{ textAlign: "center", color: "#ff4d4d", padding: "40px" }}>
          <h3>⚠️ Access Needed</h3>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <div className="donor-grid">
          {donors.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px" }} className="glass-container">
              <p>No available donors found within 50km of your location.</p>
            </div>
          ) : (
            donors.map((donor) => (
              <div key={donor._id} className="glass-card animate-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0 }}>{donor.name}</h3>
                  <span className="blood-chip active" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>{donor.bloodGroup}</span>
                </div>
                <p style={{ marginBottom: "8px" }}><b>City:</b> {donor.city}</p>
                <p style={{ marginBottom: "20px" }}><b>Distance:</b> Very Close</p>
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