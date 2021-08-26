import React, { useState } from "react";
import "../styles/Login.css";
import { Button } from "@material-ui/core";
import { firebaseAuth, firestore, googleProvider } from "../firebase/firebase";

export default function Login({ data }) {
  const { dispatch, SET_USER } = data;
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState("");
  const login = () => {
    setDisable(true);
    firebaseAuth
      .signInWithPopup(googleProvider)
      .then((data) => {
        firestore
          .collection("users")
          .doc(data.user.uid)
          .get()
          .then((docSnap) => {
            if (!docSnap.exists) {
              firestore.collection("users").doc(data.user.uid).set({
                user_id: data.user.uid,
                name: data.user.displayName,
                email: data.user.email,
                followers: [],
                following: [],
                posts: [],
                image: data.user.photoURL,
                createdAt: Date.now(),
              });
            }
          });
        setDisable(false);
        dispatch(SET_USER({ user: data.user.toJSON() }));
      })
      .catch((err) => {
        setDisable(false);
        setError(err.message);
      });
  };
  return (
    <div className="login">
      <div className="login-form">
        <div className="login-heading">SastaGram</div>
        <div className="logo-image">
          <img
            src="https://img.icons8.com/bubbles/2x/instagram.png"
            alt="logo"
          />
        </div>
        <div className="error-msg">{error}</div>
        <Button
          variant="contained"
          disabled={disable}
          color="primary"
          onClick={login}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
