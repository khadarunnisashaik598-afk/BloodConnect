import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Register from "./components/Register";
import DonorList from "./components/DonorList";
import Search from "./components/Search";
import Emergency from "./components/Emergency";
import DonorMap from "./components/DonorMap";
import "./index.css";
import NearbyDonors from "./components/NearbyDonors";
import AdminAuth from "./components/AdminAuth";
import DonorAuth from "./components/DonorAuth";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <Router>
      <div className="overlay">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donors" element={<DonorList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/map" element={<DonorMap />} />
          <Route path="/nearby" element={<NearbyDonors />} />
          <Route path="/admin-login" element={<AdminAuth />} />
          <Route path="/donor-login" element={<DonorAuth />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;