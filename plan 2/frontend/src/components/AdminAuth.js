import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    // Login uses email; Register uses username + email
    const payload = isLogin
      ? { email, password }
      : { username, email, password, role: "admin" };

    try {
      const res = await axios.post(url, payload);
      if (isLogin) {
        if (res.data.role !== "admin") {
          alert("Access Denied: Not an Admin account");
          return;
        }
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/admin-dashboard");
        window.location.reload();
      } else {
        alert("Admin registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Credentials invalid"));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
      <div className="glass-card" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 style={{ textAlign: "center", color: "#b30000", marginBottom: "30px", fontWeight: "700" }}>
          🛡️ Admin {isLogin ? "Portal" : "Registration"}
        </h2>

        <div style={{ display: "flex", background: "#f0f0f0", borderRadius: "10px", marginBottom: "30px", padding: "5px" }}>
          <button 
            onClick={() => setIsLogin(true)}
            style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: isLogin ? "white" : "none", color: isLogin ? "#b30000" : "#bbb", fontWeight: "600", cursor: "pointer" }}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: !isLogin ? "white" : "none", color: !isLogin ? "#b30000" : "#bbb", fontWeight: "600", cursor: "pointer" }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Username</label>
              <input
                type="text"
                className="glass-input"
                style={{ background: "white", color: "black", border: "1px solid #ddd" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

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
            {isLogin ? "Unlock Admin Access" : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAuth;
