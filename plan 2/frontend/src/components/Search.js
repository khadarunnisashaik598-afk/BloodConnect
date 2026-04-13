import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [donors, setDonors] = useState([]);
  const [searching, setSearching] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const searchDonors = async () => {
    setSearching(true);
    try {
      const res = await axios.get("/api/donors/search", {
        params: { bloodGroup, city }
      });
      setDonors(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSearching(false);
    }
  };

  const handleRequest = async (donor) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to request blood");
      return;
    }
    try {
      await axios.post("/api/stats/request", {
        requesterName: user.username,
        bloodGroup: donor.bloodGroup,
        phone: user.phone || "—",
        city: user.city || donor.city
      });
      alert(`✅ Request sent to ${donor.name}! Blood packets updated.`);
      // Re-fetch donors to reflect availability change
      searchDonors();
    } catch (err) {
      alert("❌ Error sending request");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="page-title">🔍 Find Blood Donors</h2>

      <div className="glass-container" style={{ marginBottom: "40px", padding: "30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#ddd" }}>Select Blood Group</label>
            <div className="blood-group-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`blood-chip ${bloodGroup === group ? "active" : ""}`}
                  onClick={() => setBloodGroup(group)}
                  style={{ padding: "10px", fontSize: "1rem" }}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#ddd" }}>Location / City</label>
            <input
              type="text"
              className="glass-input"
              placeholder="Enter City Name (e.g. Vizianagaram)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <button
              onClick={searchDonors}
              className="glass-btn pulse-btn"
              style={{ width: "100%", fontSize: "1.1rem", padding: "15px" }}
              disabled={searching}
            >
              {searching ? "Searching..." : "🔍 Search Available Donors"}
            </button>
          </div>
        </div>
      </div>

      <div className="donor-grid">
        {donors.length > 0 ? (
          donors.map((donor) => (
            <div key={donor._id} className="glass-card animate-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ color: "#fff", marginBottom: "15px" }}>{donor.name}</h3>
                <span className="blood-chip active" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>{donor.bloodGroup}</span>
              </div>
              <p style={{ marginBottom: "8px" }}><b>📍 City:</b> {donor.city}</p>
              <p style={{ marginBottom: "20px" }}><b>📞 Phone:</b> {donor.phone}</p>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <a href={`tel:${donor.phone}`} style={{ flex: 1 }}>
                  <button className="glass-btn" style={{ width: "100%", background: "#444", fontSize: "0.9rem" }}>📞 Call</button>
                </a>
                <button
                  onClick={() => handleRequest(donor)}
                  className="glass-btn"
                  style={{ flex: 1.5, background: "linear-gradient(45deg, #28a745, #218838)", fontSize: "0.9rem" }}
                >
                  💉 Request
                </button>
              </div>
            </div>
          ))
        ) : (
          !searching && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px", color: "#aaa" }}>
            {bloodGroup || city ? "No donors found for your criteria." : "Select a blood group or enter a city to start searching."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;