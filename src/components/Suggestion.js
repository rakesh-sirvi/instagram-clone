import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import firebase, { firestore } from "../firebase/firebase";
import "../styles/Suggestion.css";

export default function Suggestion({ user }) {
  const [users, setUsers] = useState([]);
  const follow = (id) => {
    firestore
      .collection("users")
      .doc(user.uid)
      .update({
        following: firebase.firestore.FieldValue.arrayUnion(id),
      });
    firestore
      .collection("users")
      .doc(id)
      .update({
        followers: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
  };
  useEffect(() => {
    firestore.collection("users").onSnapshot((snap) => {
      setUsers(snap.docs.filter((doc) => doc.id !== user.uid));
    });
    firestore
      .collection("users")
      .doc(user.uid)
      .onSnapshot((snap) => {
        setUsers((c) =>
          c.filter((x) => !snap.data().following.includes(x.data().user_id))
        );
      });
  }, [user.uid]);
  return (
    <div className="sugg">
      <h3 style={{ textAlign: "center" }}>Suggestion</h3>
      {users.map((user) => (
        <div className="sugg-body" key={user.data().user_id}>
          <div className="sugg-image">
            <img src={user.data().image} alt="eror" />
          </div>
          <div className="sugg-name">
            <span>{user.data().name}</span>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => follow(user.data().user_id)}
          >
            follow
          </Button>
        </div>
      ))}
    </div>
  );
}
