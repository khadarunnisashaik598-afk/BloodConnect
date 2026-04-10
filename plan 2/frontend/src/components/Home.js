import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {

useEffect(()=>{
// Scroll animation
const handleScroll=()=>{
const elements=document.querySelectorAll(".fade-on-scroll");
elements.forEach(el=>{
const rect=el.getBoundingClientRect();
if(rect.top<window.innerHeight-100){
el.classList.add("show");
}
});
};
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    fetchStats();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [availablePackets, setAvailablePackets] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await (await fetch("http://localhost:5000/api/stats/admin-stats")).json();
      setAvailablePackets(res.availablePackets);
    } catch (err) {
      console.error("Error fetching stats");
    }
  };

// Create blood drops dynamically
const drops=[];
for(let i=0;i<40;i++){
drops.push(<div key={i} className="blood-drop" style={{left: `${Math.random()*100}%`, animationDuration:`${2+Math.random()*3}s`}}></div>);
}

return(
<div className="home-container" style={{position:"relative",overflow:"hidden"}}>

{/* Animated blood drops */}
{drops}

{/* Hero Section */}
<div className="hero-section fade-on-scroll">
<h1 className="hero-title">🩸 Welcome to BloodConnect</h1>
<p className="hero-subtitle">Find & Donate Blood Effortlessly</p>

{/* Live Stats Banner */}
<div style={{
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  padding: "15px 30px",
  borderRadius: "50px",
  display: "inline-block",
  marginTop: "20px",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
}}>
  <span style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "600" }}>
    💉 <span style={{ color: "#ff4d4d", fontSize: "1.4rem", fontWeight: "800" }}>{availablePackets}</span> Blood Packets Currently Available
  </span>
</div>

<div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "30px" }}>
  <a href="/donor-login">
    <button className="btn-premium">❤️ Donor</button>
  </a>
  <a href="/admin-login">
    <button className="btn-premium" style={{ background: "linear-gradient(135deg, #333 0%, #555 100%)" }}>🛡️ Admin Portal</button>
  </a>
</div>
</div>


{/* Feature Cards */}
<div className="feature-cards fade-on-scroll">
  <Link to="/map" className="glass-card animate-card" style={{ textDecoration: "none" }}>
    <h3>📍 Locate Donors</h3>
    <p>Find nearby donors instantly on the map.</p>
  </Link>
  <Link to="/emergency" className="glass-card animate-card" style={{ textDecoration: "none" }}>
    <h3>🚨 Emergency Alerts</h3>
    <p>Request blood quickly during emergencies.</p>
  </Link>
  <Link to="/search" className="glass-card animate-card" style={{ textDecoration: "none" }}>
    <h3>📊 Blood Stats</h3>
    <p>Track blood group availability and distribution.</p>
  </Link>
</div>

</div>
);
}

export default Home;