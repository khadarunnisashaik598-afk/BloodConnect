import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        username,
        password
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
      window.location.reload(); // Refresh to update navbar
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container" style={{
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    }}>
      <h2 style={{ textAlign: "center", color: "#b30000" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#b30000",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer"
        }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
