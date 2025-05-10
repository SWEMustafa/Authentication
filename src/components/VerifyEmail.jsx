import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Spinner, Button } from "react-bootstrap";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmail() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      auth.currentUser
        .reload()
        .then(() => {
          setCheckCount((prev) => prev + 1);
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Error reloading user:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  // ✅ Move resend inside the component
  function handleResend() {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setResent(true);
      })
      .catch((err) => {
        console.error("Resend verification failed:", err);
        alert("Failed to resend verification email.");
      });
  }

  return (
    <div className="text-center mt-5">
      <h2>Verify Your Email</h2>
      <p>
        We sent a verification link to <strong>{currentUser?.email}</strong>.
      </p>
      <p>Once you verify, you'll be redirected automatically.</p>

      {loading && (
        <div className="mt-3">
          <Spinner animation="border" size="sm" /> Checking... ({checkCount})
        </div>
      )}

      <div className="mt-4">
        <Button onClick={handleResend} disabled={resent || loading}>
          {resent ? "Verification email sent!" : "Resend Email"}
        </Button>
      </div>
    </div>
  );
}
