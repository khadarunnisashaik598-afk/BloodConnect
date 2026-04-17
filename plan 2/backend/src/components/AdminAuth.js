import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.role !== "admin") {
        alert("Access Denied: Not an Admin account");
        return;
      }
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/admin-dashboard");
      window.location.reload();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Invalid credentials"));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
      <div className="glass-card" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 style={{ textAlign: "center", color: "#b30000", marginBottom: "30px", fontWeight: "700" }}>
          🛡️ Admin Portal
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              className="glass-input"
              style={{ background: "white", color: "black", border: "1px solid #ddd" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Password</label>
            <input
              type="password"
              className="glass-input"
              style={{ background: "white", color: "black", border: "1px solid #ddd" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-premium" style={{ width: "100%" }}>
            Unlock Admin Access
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAuth;
