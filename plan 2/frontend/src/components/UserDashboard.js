import React, { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    city: "",
    phone: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState(""); // 🔥 NEW
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/donors/my-profile/${user._id || user.email || user.username}`
        );

        if (res.data) {
          setFormData({
            name: res.data.name || "",
            bloodGroup: res.data.bloodGroup || "",
            city: res.data.city || "",
            phone: res.data.phone || ""
          });

          if (res.data.latitude) {
            setCoords({ lat: res.data.latitude, lng: res.data.longitude });
          }
        }
      } catch (err) {
        console.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Final validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setMessage("⚠️ Enter valid 10-digit phone number");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/donors/upsert", {
        ...formData,
        userId: user._id || user.email || user.username,
        latitude: coords.lat,
        longitude: coords.lng
      });

      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to update profile");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading Profile...
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh"
      }}
    >
      <div className="glass-container" style={{ width: "400px" }}>
        <h2 className="page-title">🩸 Manage Your Donor Profile</h2>

        {message && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              textAlign: "center",
              borderRadius: "8px",
              background: message.includes("✅") ? "#d4edda" : "#f8d7da",
              color: message.includes("✅") ? "#155724" : "#721c24"
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            padding: "8px",
            marginBottom: "15px",
            textAlign: "center",
            borderRadius: "8px",
            background: "#e3f2fd",
            fontSize: "0.9rem"
          }}
        >
          {coords.lat
            ? `📍 ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : "⏳ Detecting location..."}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="👤 Full Name"
            value={formData.name}
            onChange={handleChange}
            className="glass-input"
            required
          />

          <br /><br />

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="glass-select"
            required
          >
            <option value="">🩸 Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <br /><br />

          <input
            type="text"
            name="city"
            placeholder="📍 City"
            value={formData.city}
            onChange={handleChange}
            className="glass-input"
            required
          />

          <br /><br />

          {/* 🔥 PHONE INPUT WITH LIVE VALIDATION */}
          <input
            type="text"
            name="phone"
            placeholder="📞 Phone Number"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;

              if (!/^[0-9]*$/.test(value)) {
                setPhoneError("❌ Only numbers allowed");
              } else {
                setPhoneError("");
                setFormData({ ...formData, phone: value });
              }
            }}
            className="glass-input"
            required
          />

          {/* 🔥 LIVE ERROR MESSAGE */}
          {phoneError && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {phoneError}
            </p>
          )}

          <br />

          <button
            type="submit"
            className="glass-btn"
            style={{ width: "100%" }}
          >
            ❤️ Save Profile Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserDashboard;