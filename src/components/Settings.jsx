import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Settings() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added missing state
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.code);
      const code = err.code || "auth/unknown-error";
      const message = code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      setError(message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
     <div className="container mt-3">
      {/* Top-of-page heading */}
      <h3 className="text-center">Settings</h3>

    </div>
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-5">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-5">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : "Log Out"}
        </Button>
      </div>
      </div>
      </div>
    </>
  );
}
