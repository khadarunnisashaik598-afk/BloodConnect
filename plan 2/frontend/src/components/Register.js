import React, { useState } from "react";
import axios from "axios";

function Register() {

  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    city: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Phone validation (only 10 digits)
    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("⚠️ Enter valid 10-digit phone number (numbers only)");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/donors", form);

      alert("✅ Donor Registered Successfully");

      setForm({
        name: "",
        bloodGroup: "",
        city: "",
        phone: ""
      });

    } catch (err) {
      alert("❌ Registration Failed");
    }
  };

  return (

    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
    }}>

      <div className="glass-container" style={{ width: "400px" }}>

        <h2 className="page-title">
          🩸 Become a Blood Donor
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="👤 Full Name"
            value={form.name}
            onChange={handleChange}
            className="glass-input"
            required
          />

          <br /><br />

          <select
            name="bloodGroup"
            value={form.bloodGroup}
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
            value={form.city}
            onChange={handleChange}
            className="glass-input"
            required
          />

          <br /><br />

          {/* 🔥 UPDATED PHONE INPUT */}
          <input
            type="text"
            name="phone"
            placeholder="📞 Phone Number"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value;

              // only numbers allow
              if (/^[0-9]*$/.test(value)) {
                setForm({ ...form, phone: value });
              }
            }}
            className="glass-input"
            required
          />

          <br /><br />

          <button type="submit" className="glass-btn" style={{ width: "100%" }}>
            ❤️ Register as Donor
          </button>

        </form>

      </div>

    </div>

  );

}

export default Register;