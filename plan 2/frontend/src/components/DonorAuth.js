import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
    const payload = isLogin ? { username, password } : { username, email, password, role: "user" };

    try {
      const res = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/user-dashboard");
        window.location.reload();
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Invalid entry"));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
      <div className="glass-card" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 style={{ textAlign: "center", color: "#b30000", marginBottom: "10px", fontWeight: "700" }}>
          🩸 Donor {isLogin ? "" : "Registration"}
        </h2>
        <p style={{ textAlign: "center", color: "#ddd", marginBottom: "30px" }}>{isLogin ? "Connect with those who need you" : "Start your journey as a life-saver"}</p>

        <div style={{ display: "flex", background: "#f0f0f0", borderRadius: "10px", marginBottom: "30px", padding: "5px" }}>
          <button 
            onClick={() => setIsLogin(true)}
            style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: isLogin ? "white" : "none", color: isLogin ? "#b30000" : "#bbb", fontWeight: "600", cursor: "pointer" }}
          >
            Log In
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", background: !isLogin ? "white" : "none", color: !isLogin ? "#b30000" : "#bbb", fontWeight: "600", cursor: "pointer" }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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

          {!isLogin && (
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
          )}

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
            {isLogin ? "Sign In" : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonorAuth;
