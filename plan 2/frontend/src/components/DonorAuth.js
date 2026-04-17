import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(""); // 🔥 For better UI feedback
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { username, password } : { username, email, password, role: "user" };

    try {
      const res = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/user-dashboard");
        window.location.reload();
      } else {
        alert("✅ Registration successful! Please log in now.");
        setIsLogin(true);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Connection error. Please try again.";
      setLocalError(msg);
      console.error("Auth error:", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
      <div className="glass-card" style={{ maxWidth: "500px", width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
        <h2 style={{ textAlign: "center", color: "#b30000", marginBottom: "10px", fontWeight: "700" }}>
          🩸 Donor {isLogin ? "Sign In" : "Registration"}
        </h2>
        <p style={{ textAlign: "center", color: "#ccc", marginBottom: "25px", fontSize: "0.95rem" }}>
          {isLogin ? "Welcome back! Please enter your details." : "Join our community of life-savers today."}
        </p>

        {/* --- Tab Switcher --- */}
        <div style={{ 
          display: "flex", 
          background: "rgba(0,0,0,0.2)", 
          borderRadius: "15px", 
          marginBottom: "25px", 
          padding: "5px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <button 
            onClick={() => { setIsLogin(true); setLocalError(""); }}
            style={{ 
              flex: 1, padding: "12px", border: "none", borderRadius: "12px", 
              background: isLogin ? "white" : "transparent", 
              color: isLogin ? "#b30000" : "white", 
              fontWeight: "700", cursor: "pointer", transition: "0.3s" 
            }}
          >
            Log In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setLocalError(""); }}
            style={{ 
              flex: 1, padding: "12px", border: "none", borderRadius: "12px", 
              background: !isLogin ? "white" : "transparent", 
              color: !isLogin ? "#b30000" : "white", 
              fontWeight: "700", cursor: "pointer", transition: "0.3s" 
            }}
          >
            Register
          </button>
        </div>

        {/* --- Error Message --- */}
        {localError && (
          <div style={{ 
            background: "rgba(255,0,0,0.2)", 
            color: "#ff8080", 
            padding: "12px", 
            borderRadius: "10px", 
            marginBottom: "20px", 
            textAlign: "center",
            fontWeight: "bold",
            border: "1px solid rgba(255,0,0,0.3)"
          }}>
            ⚠️ {localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="glass-input"
              style={{ background: "white", color: "black", border: "1px solid #ddd" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Email Address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="glass-input"
                style={{ background: "white", color: "black", border: "1px solid #ddd" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="glass-input"
              style={{ background: "white", color: "black", border: "1px solid #ddd" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-premium" style={{ width: "100%", padding: "15px" }}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem", color: "#ccc" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setLocalError(""); }} 
            style={{ color: "#ff4d4d", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}
          >
            {isLogin ? "Register here" : "Log in here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default DonorAuth;
