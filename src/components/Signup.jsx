import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // controls persistence
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Check for matching passwords
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      // Sign up with persistence choice
      await signup(emailRef.current.value, passwordRef.current.value, rememberMe);
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err.code);

      let message = "";

      if (err.code === "auth/password-does-not-meet-requirements") {
        message = "Passwords require at least 12 characters, a special character, an uppercase letter, and a number.";
      } else {
        const code = err.code || "auth/unknown-error";
        message = code
          .replace("auth/", "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, char => char.toUpperCase());
      }

      setError(message || "Signup failed.");
    } finally {
      setLoading(false); // ✅ Always resets button
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>

              <Form.Group id="password" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>

              <Form.Group id="password-confirm" className="mt-2">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Keep me logged in"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
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
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
