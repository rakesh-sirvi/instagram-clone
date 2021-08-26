import { Avatar, Link as MatLink } from "@material-ui/core";
import React from "react";
import "../styles/Header.css";
import { PostAdd } from "@material-ui/icons";

export default function Header({ user }) {
  return (
    <div className="header">
      <div className="header-logo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
          alt="logo"
        />
      </div>
      <div className="header-right">
        <div>
          <MatLink href="/upload">
            <PostAdd fontSize="large" />
          </MatLink>
        </div>
        <div>
          <MatLink href={`/profile/${user.uid}`}>
            <Avatar src={user.photoURL} />
          </MatLink>
        </div>
      </div>
    </div>
  );
}
