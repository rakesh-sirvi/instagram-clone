import React, { useEffect, useState } from "react";
import Card from "./Card";
import { firestore } from "../firebase/firebase";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const url = (id) =>
    `https://firebasestorage.googleapis.com/v0/b/insta-clone-psy.appspot.com/o/posts%2F${id}?alt=media&`;
  useEffect(() => {
    firestore.collection("posts").onSnapshot((snap) => {
      setPosts(
        snap.docs.map((doc) => {
          return { ...doc.data(), imageURL: url(doc.id), id: doc.id };
        })
      );
    });
  }, []);
  return (
    <>
      {posts.map((post, idx) => (
        <Card data={post} key={idx} />
      ))}
    </>
  );
}
