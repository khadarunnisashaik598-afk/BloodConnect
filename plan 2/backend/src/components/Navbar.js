import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav style={{
      backgroundColor: "#b30000",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white"
    }}>

      <h2>🩸 BloodConnect</h2>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Home</Link>
        <Link to="/search" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Search</Link>
        <Link to="/emergency" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Emergency</Link>
        <Link to="/map" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Map</Link>
        <Link to="/nearby" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Nearby</Link>

        {user ? (
          <>
            <Link 
              to={user.role === "admin" ? "/admin-dashboard" : "/user-dashboard"} 
              style={{ color: "white", marginRight: "20px", textDecoration: "none", fontWeight: "bold" }}
            >
              Dashboard
            </Link>
            <button 
              onClick={logout} 
              style={{ padding: "8px 15px", backgroundColor: "white", color: "#b30000", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Logout ({user.username})
            </button>
          </>
        ) : (
          <>
            <Link to="/donor-login" style={{ color: "white", marginRight: "15px", textDecoration: "none", fontWeight: "600" }}>Donor</Link>
            <Link to="/admin-login" style={{ color: "white", marginRight: "10px", textDecoration: "none", border: "1px solid white", padding: "5px 15px", borderRadius: "5px" }}>Admin</Link>
          </>
        )}


      </div>

    </nav>
  );
}


export default Navbar;