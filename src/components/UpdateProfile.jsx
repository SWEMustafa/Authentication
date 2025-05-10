import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    const newEmail = emailRef.current.value;
    const newPassword = passwordRef.current.value;

    if (newEmail !== currentUser.email) {
      promises.push(updateEmail(newEmail));
    }

    if (newPassword) {
      promises.push(updatePassword(newPassword));
    }

    if (promises.length === 0) {
      setLoading(false);
      return setError("No changes were made.");
    }

    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Update error:", err.code);

        let message = "";

        if (err.code === "auth/requires-recent-login") {
          message = "Please log in again to update your profile.";
        } else if (err.code === "auth/password-does-not-meet-requirements") {
          message =
            "Passwords require at least 12 characters, a special character, an uppercase letter, and a number.";
        } else {
          const code = err.code || "auth/unknown-error";
          message = code
            .replace("auth/", "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }

        setError(message || "Failed to update account.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
      </div>
      </div>
  
  );
}