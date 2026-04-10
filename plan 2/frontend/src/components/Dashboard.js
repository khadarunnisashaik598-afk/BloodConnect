import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {

      const res = await axios.get("http://localhost:5000/api/donors");

      const donors = res.data;

      const count = {};

      donors.forEach((donor) => {
        count[donor.bloodGroup] = (count[donor.bloodGroup] || 0) + 1;
      });

      setStats(count);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{padding:"40px"}}>

      <h2 style={{textAlign:"center", marginBottom:"30px"}}>
        🩸 Blood Availability Dashboard
      </h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
        gap:"20px"
      }}>

        {Object.keys(stats).map((group) => (

          <div key={group} style={{
            background:"white",
            color:"black",
            padding:"30px",
            textAlign:"center",
            borderRadius:"12px",
            boxShadow:"0 5px 15px rgba(0,0,0,0.3)"
          }}>

            <h3>{group}</h3>

            <h1>{stats[group]}</h1>

            <p>Donors Available</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;