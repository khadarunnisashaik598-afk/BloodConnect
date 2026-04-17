import React, { useEffect, useState } from "react";
import axios from "axios";

function Emergency(){

  const [blood, setBlood] = useState("");
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [availablePackets, setAvailablePackets] = useState(0);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/stats/admin-stats");
      setAvailablePackets(res.data.availablePackets);
    } catch (err) {
      console.error("Error fetching stats");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!blood) {
      alert("Please select a blood group first!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/stats/request", {
        requesterName: formData.name,
        bloodGroup: blood,
        phone: formData.phone,
        city: formData.city
      });
      alert("✅ Emergency Request Submitted Successfully! Blood packets count updated.");
      setFormData({ name: "", phone: "", city: "" });
      // Re-fetch stats and donors to show automatic change
      fetchStats();
      if (donors.length > 0) searchEmergency(); 
    } catch (err) {
      alert("❌ Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchEmergency = async () => {
    if (!blood) { alert("Select blood group first"); return; }
    try {
      const res = await axios.get(`/api/donors/emergency/${encodeURIComponent(blood)}`);
      setDonors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

return(

<div style={{padding:"40px"}}>

<h2 className="page-title">🚨 Emergency Blood Request</h2>

{/* Stats Bar */}
<div className="glass-container" style={{ marginBottom: "30px", textAlign: "center", background: "rgba(179,0,0,0.1)", border: "1px solid rgba(179,0,0,0.2)" }}>
  <h4 style={{ margin: 0, color: "#b30000" }}>
    💉 Total Available Blood Packets: <span style={{ fontSize: "1.5rem", fontWeight: "800" }}>{availablePackets}</span>
  </h4>
  <p style={{ margin: "5px 0 0", fontSize: "0.85rem", color: "#666" }}>Updates automatically on every request</p>
</div>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", maxWidth: "1200px", margin: "auto" }}>
  
  {/* Request Form */}
  <div className="glass-container" style={{ textAlign: "left" }}>
    <h3 style={{ color: "#b30000", marginBottom: "20px" }}>Request Assistance</h3>
    <form onSubmit={submitRequest}>
      <div style={{ marginBottom: "15px" }}>
        <p>1. Select Needed Blood Group:</p>
        <div className="blood-group-grid" style={{ marginTop: "10px" }}>
          {bloodGroups.map((group)=>(
            <button
              key={group}
              type="button"
              className={`blood-chip ${blood===group ? "active" : ""}`}
              onClick={()=>setBlood(group)}
            >
            {group} </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="glass-input" required placeholder="Enter your name" />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>Phone Number</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="glass-input" required placeholder="Enter your contact number" />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>City / Location</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} className="glass-input" required placeholder="Enter hospital or city location" />
      </div>

      <button 
        type="submit" 
        className="glass-btn pulse-btn" 
        style={{ width: "100%", background: "linear-gradient(45deg, #cc0000, #ff0000)" }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "🚨 Submit Emergency Request"}
      </button>
    </form>
  </div>

  {/* Quick Search */}
  <div className="glass-container" style={{ textAlign: "center" }}>
    <h3 style={{ color: "#b30000", marginBottom: "20px" }}>Quick Donor Search</h3>
    <p>Find available donors for <b style={{color:"#ff0000"}}>{blood || "..."}</b> immediately:</p>
    <br/>
    <button 
      className="glass-btn" 
      style={{width:"100%"}} 
      onClick={searchEmergency}>
      🔍 Find Donors Now
    </button>

    <div className="donor-grid" style={{ marginTop: "30px", maxHeight: "400px", overflowY: "auto", padding: "10px" }}>
      {donors.map((d)=>(
        <div key={d._id} className="glass-card" style={{ marginBottom: "15px", textAlign: "left" }}>
          <h4>{d.name}</h4>
          <p style={{fontSize: "0.9rem"}}><b>City:</b> {d.city}</p>
          <p style={{fontSize: "0.9rem"}}><b>Phone:</b> {d.phone}</p>
          <a href={`tel:${d.phone}`}>
            <button className="glass-btn" style={{marginTop:"10px", padding: "5px 15px", fontSize: "0.85rem"}}>📞 Call</button> </a>
        </div>
      ))}
      {blood && donors.length === 0 && <p style={{ color: "#888" }}>No donors found for this group yet.</p>}
    </div>
  </div>

</div>

</div>

);

}

export default Emergency;
