import { Button } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import "../styles/Profile.css";
import { firestore } from "../firebase/firebase";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then((docSnap) => {
        if (docSnap.exists) {
          setProfile(docSnap.data());
          setLoading(false);
        }
      });
  }, [uid]);
  return loading ? (
    <div>Loading....</div>
  ) : (
    <div className="profile">
      <div className="profile-body">
        <div className="profile-head-left">
          <img alt="lol" src={profile.image} />
        </div>
        <div className="profile-head-right">
          <h1>{profile.name}</h1>
          <div className="follow-status">
            <Button variant="contained" color="primary">
              Follow
            </Button>
          </div>
        </div>
      </div>
      <div className="profile-info">
        <h4>{profile.name}</h4>
      </div>
      <div className="profile-posts-info">
        <div className="profile-strats">
          <h5>
            <span>{profile.posts.length}</span>
          </h5>
          <span>posts</span>
        </div>
        <div className="profile-strats">
          <h5>
            <span>{profile.followers.length}</span>
          </h5>
          <span>followers</span>
        </div>
        <div className="profile-strats">
          <h5>
            <span>{profile.following.length}</span>
          </h5>
          <span>following</span>
        </div>
      </div>
      <div className="profile-posts">
        {profile.posts.map((post, idx) => (
          <div className="post-data" key={idx}>
            <img
              alt="LoL"
              src={`https://firebasestorage.googleapis.com/v0/b/insta-clone-psy.appspot.com/o/posts%2F${post}?alt=media`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
