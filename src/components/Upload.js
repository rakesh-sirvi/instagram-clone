import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "../styles/Upload.css";
import firebase, { storage, firestore } from "../firebase/firebase";
import { useHistory } from "react-router-dom";

export default function Upload({ user }) {
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [process, setProcess] = useState(false);
  const history = useHistory();

  const upload = () => {
    if (image.length == 0) return;
    setProcess(true);
    let postRef = firestore.collection("posts").doc();
    storage
      .ref(`/posts/${postRef.id}`)
      .put(image)
      .then((snap) => {
        setProcess(false);
        setMessage(snap.state);
      })
      .then(() => {
        postRef.set({
          description: desc,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          likes: [],
          comments: [],
          id: user.uid,
        });
        firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((docSnap) => {
            if (docSnap.exists) {
              firestore
                .collection("users")
                .doc(user.uid)
                .update({
                  posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
                });
            }
          });
      })
      .catch((err) => setMessage(err.message));
    setImage("");
  };
  return (
    <div className="upload-image">
      <h3>Post Image</h3>
      <div className="input-group">
        <textarea
          type="text"
          className="input-desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
        <input
          type="file"
          className="input-file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {message && <span>{JSON.stringify(message)}</span>}
        <div className="upload-btn">
          <Button
            variant="text"
            color="secondary"
            onClick={() => history.push("/")}
            disabled={process}
          >
            Home
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={upload}
            disabled={process}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
