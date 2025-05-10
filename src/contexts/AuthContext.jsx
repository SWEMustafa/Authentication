import {
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase"; // make sure this is correct
import { sendEmailVerification } from "firebase/auth";
import React, { useContext, useState, useEffect } from "react";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password, rememberMe = false) {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  
    return setPersistence(auth, persistence)
      .then(() => createUserWithEmailAndPassword(auth, email, password))
      .then((userCredential) => {
        return sendEmailVerification(userCredential.user).then(() => userCredential);
      });
  }

  function login(email, password, rememberMe = false) {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    return setPersistence(auth, persistence).then(() =>
      signInWithEmailAndPassword(auth, email, password)
  );
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return fbUpdateEmail(auth.currentUser, email); // ✅ modular way
  }

  function updatePassword(password) {
    return fbUpdatePassword(auth.currentUser, password); // ✅ modular way
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
