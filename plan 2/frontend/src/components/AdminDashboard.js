import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:5000/api/stats";

// Blood group badge colors
const BG_COLORS = {
  "A+": "#e53935", "A-": "#c62828",
  "B+": "#1e88e5", "B-": "#1565c0",
  "AB+": "#6d4c41", "AB-": "#4e342e",
  "O+": "#43a047", "O-": "#2e7d32",
};

function AdminDashboard() {
  const [stats, setStats] = useState({ totalDonors: 0, membersTakingBlood: 0, availablePackets: 0 });
  const [activeView, setActiveView] = useState(null); // 'donors' | 'requests' | 'packets'
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${BASE}/admin-stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCardClick = async (view) => {
    if (activeView === view) {
      setActiveView(null);
      setDetailData(null);
      return;
    }
    setActiveView(view);
    setLoading(true);
    try {
      let res;
      if (view === "donors") res = await axios.get(`${BASE}/all-donors`);
      else if (view === "requests") res = await axios.get(`${BASE}/all-requests`);
      else if (view === "packets") res = await axios.get(`${BASE}/available-packets`);
      setDetailData(res.data);
    } catch (err) {
      console.error(err);
      setDetailData(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#b30000", fontSize: "2rem", fontWeight: "800" }}>
        🛡️ Admin Dashboard
      </h2>
      <p style={{ textAlign: "center", color: "#888", marginBottom: "40px" }}>
        Click a card to view detailed records
      </p>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <StatCard
          title="Total Donors"
          value={stats.totalDonors}
          description="Users donating blood data"
          icon="🩸"
          active={activeView === "donors"}
          onClick={() => handleCardClick("donors")}
        />
        <StatCard
          title="Emergency Requests"
          value={stats.membersTakingBlood}
          description="Pending emergency blood requests"
          icon="🚨"
          active={activeView === "requests"}
          onClick={() => handleCardClick("requests")}
        />
        <StatCard
          title="Total Blood Packets"
          value={stats.availablePackets}
          description="Available for donation"
          icon="💉"
          active={activeView === "packets"}
          onClick={() => handleCardClick("packets")}
        />
      </div>

      {/* Detail Panel */}
      {activeView && (
        <div style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          padding: "32px",
          animation: "fadeIn 0.3s ease"
        }}>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .detail-table { width: 100%; border-collapse: collapse; }
            .detail-table th { background: #b30000; color: white; padding: 12px 16px; text-align: left; font-weight: 600; }
            .detail-table td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #333; }
            .detail-table tr:hover td { background: #fff5f5; }
            .bg-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; color: white; font-weight: 700; font-size: 0.85rem; }
            .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; background: #e8f5e9; color: #2e7d32; font-size: 0.8rem; font-weight: 600; }
            .group-header { background: #fff3f3; padding: 10px 16px; border-radius: 8px; margin: 20px 0 8px; font-weight: 700; color: #b30000; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
          `}</style>

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#b30000", fontSize: "1.2rem" }}>
              ⏳ Loading data...
            </div>
          )}

          {/* DONORS LIST */}
          {!loading && activeView === "donors" && detailData && (
            <>
              <h3 style={{ color: "#b30000", marginBottom: "20px", fontSize: "1.4rem" }}>
                🩸 All Donors ({detailData.length})
              </h3>
              {detailData.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center" }}>No donors registered yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Blood Group</th>
                        <th>City</th>
                        <th>Phone</th>
                        <th>Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.map((d, i) => (
                        <tr key={d._id}>
                          <td>{i + 1}</td>
                          <td><strong>{d.name}</strong></td>
                          <td>
                            <span className="bg-badge" style={{ background: BG_COLORS[d.bloodGroup] || "#b30000" }}>
                              {d.bloodGroup}
                            </span>
                          </td>
                          <td>{d.city || "—"}</td>
                          <td>{d.phone || "—"}</td>
                          <td>
                            <span style={{
                              padding: "3px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600",
                              background: d.available ? "#e8f5e9" : "#fce4ec",
                              color: d.available ? "#2e7d32" : "#c62828"
                            }}>
                              {d.available ? "✅ Yes" : "❌ No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* BLOOD REQUESTS LIST */}
          {!loading && activeView === "requests" && detailData && (
            <>
              <h3 style={{ color: "#b30000", marginBottom: "20px", fontSize: "1.4rem" }}>
                🚨 Emergency Blood Requests ({detailData.length})
              </h3>
              {detailData.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center" }}>No blood requests found.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Requester Name</th>
                        <th>Blood Group Needed</th>
                        <th>City</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.map((r, i) => (
                        <tr key={r._id}>
                          <td>{i + 1}</td>
                          <td><strong>{r.requesterName}</strong></td>
                          <td>
                            <span className="bg-badge" style={{ background: BG_COLORS[r.bloodGroup] || "#b30000" }}>
                              {r.bloodGroup}
                            </span>
                          </td>
                          <td>{r.city || "—"}</td>
                          <td>{r.phone || "—"}</td>
                          <td>{new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td><span className="status-badge">{r.status || "Fulfilled"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* AVAILABLE PACKETS - Grouped by Blood Group */}
          {!loading && activeView === "packets" && detailData && (
            <>
              <h3 style={{ color: "#b30000", marginBottom: "20px", fontSize: "1.4rem" }}>
                💉 Available Blood Packets ({detailData.donors?.length || 0}) — By Blood Group
              </h3>
              {!detailData.donors || detailData.donors.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center" }}>No available packets right now.</p>
              ) : (
                <>
                  {/* Blood Group Summary Chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
                    {Object.keys(detailData.grouped).sort().map(bg => (
                      <div key={bg} style={{
                        padding: "8px 18px", borderRadius: "30px", fontWeight: "700", color: "white",
                        background: BG_COLORS[bg] || "#b30000", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px"
                      }}>
                        {bg} <span style={{ background: "rgba(255,255,255,0.3)", borderRadius: "50%", padding: "1px 7px", fontSize: "0.8rem" }}>
                          {detailData.grouped[bg].length}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Grouped Tables */}
                  {Object.keys(detailData.grouped).sort().map(bg => (
                    <div key={bg} style={{ marginBottom: "28px" }}>
                      <div className="group-header">
                        <span className="bg-badge" style={{ background: BG_COLORS[bg] || "#b30000" }}>{bg}</span>
                        {detailData.grouped[bg].length} packet{detailData.grouped[bg].length > 1 ? "s" : ""} available
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table className="detail-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Donor Name</th>
                              <th>City</th>
                              <th>Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailData.grouped[bg].map((d, i) => (
                              <tr key={d._id}>
                                <td>{i + 1}</td>
                                <td><strong>{d.name}</strong></td>
                                <td>{d.city || "—"}</td>
                                <td>{d.phone || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, description, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? "#b30000" : "white",
        padding: "30px",
        textAlign: "center",
        borderRadius: "16px",
        boxShadow: active ? "0 8px 30px rgba(179,0,0,0.35)" : "0 8px 20px rgba(0,0,0,0.10)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        transform: active ? "translateY(-4px)" : "translateY(0)",
        border: active ? "2px solid #b30000" : "2px solid transparent",
        userSelect: "none"
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)"; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.10)"; }}}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{icon}</div>
      <h3 style={{ color: active ? "rgba(255,255,255,0.85)" : "#555", marginBottom: "8px", fontWeight: "600" }}>{title}</h3>
      <h1 style={{ fontSize: "3.5rem", color: active ? "white" : "#b30000", margin: "10px 0", fontWeight: "800", lineHeight: 1 }}>{value}</h1>
      <p style={{ color: active ? "rgba(255,255,255,0.7)" : "#888", fontSize: "0.9rem" }}>{description}</p>
      <p style={{ color: active ? "rgba(255,255,255,0.6)" : "#ccc", fontSize: "0.78rem", marginTop: "10px" }}>
        {active ? "▲ Click to collapse" : "▼ Click to view details"}
      </p>
    </div>
  );
}

export default AdminDashboard;
