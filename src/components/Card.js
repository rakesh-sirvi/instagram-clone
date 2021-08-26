import React, { useEffect, useState } from "react";
import "../styles/Card.css";
import {
  EmojiEmotions,
  Favorite,
  FavoriteBorder,
  InfoOutlined,
  MoreHoriz,
} from "@material-ui/icons";
import { IconButton, Button, Avatar } from "@material-ui/core";
import firebase, { firestore } from "../firebase/firebase";
import { AuthSelector } from "../redux/auth";
import { useSelector } from "react-redux";

export default function Card({ data }) {
  const { user } = useSelector(AuthSelector);
  const [postInfo, setInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [post_comments, setPostComments] = useState([]);
  const [like, setLike] = useState(false);
  const [btn, setbtn] = useState(false);
  const likePost = () => {
    setbtn(true);
    firestore
      .collection("posts")
      .doc(data.id)
      .update({
        likes: !like
          ? firebase.firestore.FieldValue.arrayUnion(user.uid)
          : firebase.firestore.FieldValue.arrayRemove(user.uid),
      })
      .then(() => setbtn(false));
  };

  const postComment = () => {
    firestore
      .collection("posts")
      .doc(data.id)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          name: user.displayName,
          comment: comment,
          time: Date.now(),
        }),
      });
    setComment("");
  };

  useEffect(() => {
    firestore
      .collection("posts")
      .doc(data.id)
      .onSnapshot((snap) => {
        let temp = snap.data().comments;
        temp.sort((a, b) => b.time - a.time);
        setPostComments(temp);
        setLike(snap.data().likes.includes(user.uid));
        firestore
          .collection("users")
          .doc(snap.data().id)
          .get()
          .then((us) => {
            setInfo(us.data());
            setLoading(false);
          });
      });
    return () => setLoading(true);
  }, [data.id,user.uid]);
  return (
    <div className="card">
      {loading ? (
        <h4>Loading...</h4>
      ) : (
        <>
          <div className="heading">
            <IconButton>
              <Avatar src={postInfo.image} fontSize="large" />
            </IconButton>
            <div className="right">
              <span>{postInfo.name}</span>
              <IconButton>
                <MoreHoriz fontSize="large" />
              </IconButton>
            </div>
          </div>
          <div className="photo">
            <img className="image" alt="Error" src={data.imageURL} />
          </div>
          <div className="footer">
            <div className="action">
              <IconButton onClick={likePost} disabled={btn}>
                {like ? (
                  <Favorite fontSize="large" color="secondary" />
                ) : (
                  <FavoriteBorder fontSize="large" style={{ color: "black" }} />
                )}
              </IconButton>
              <IconButton>
                <InfoOutlined fontSize="large" style={{ color: "black" }} />
              </IconButton>
            </div>
            <div className="likes">
              <span>{data.likes.length} Likes</span>
            </div>
            <div className="post-desc">
              <span>{data.description}</span>
            </div>
            <div className="comments">
              {post_comments.map((post_com, idx) => (
                <div className="comment" key={idx}>
                  <span>
                    <span style={{ fontWeight: "bold" }}>{post_com.name} </span>
                    {post_com.comment}
                  </span>
                </div>
              ))}
            </div>
            <div className="comment-post">
              <IconButton>
                <EmojiEmotions />
              </IconButton>
              <div className="comment-input-body">
                <div className="comment-input">
                  <input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button variant="text" color="primary" onClick={postComment}>
                    POST
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
