import React, { useEffect, useState } from "react";
import axios from "axios";

function DonorList() {

  const [donors, setDonors] = useState([]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await axios.get("/api/donors");
      setDonors(res.data);
    } catch (error) {
      console.log(error);
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
        bloodGroup: donor.bloodGroup
      });
      alert(`Request sent to ${donor.name}!`);
    } catch (err) {
      alert("Error sending request");
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🩸 Available Donors
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px"
      }}>

        {donors.map((donor) => (

          <div key={donor._id} className="glass-card">

            <h3>{donor.name}</h3>

            <p><b>Blood Group:</b> {donor.bloodGroup}</p>

            <p><b>City:</b> {donor.city}</p>

            <p><b>Phone:</b> {donor.phone}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <a href={`tel:${donor.phone}`} style={{ flex: 1 }}>
                <button style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>📞 Call</button>
              </a>
              <button 
                onClick={() => handleRequest(donor)}
                style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                💉 Request
              </button>
            </div>

          </div>

        ))}


      </div>

    </div>
  );
}

export default DonorList;