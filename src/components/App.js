import React, { useEffect } from "react";
import "../styles/App.css";
import Login from "./Login";
import { SET_USER, AuthSelector } from "../redux/auth";
import { useSelector, useDispatch } from "react-redux";
import { firebaseAuth } from "../firebase/firebase";
import Header from "./Header";
import Profile from "./Profile";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Suggestion from "./Suggestion";
import Upload from "./Upload";
import Posts from "./Posts";

function App() {
  const { user } = useSelector(AuthSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (state) => {
      if (state) {
        dispatch(SET_USER({ user: state.toJSON() }));
      } else {
        dispatch(SET_USER({ user: null }));
      }
    });
  }, []);
  return (
    <Router>
      <div className="app">
        <Route path="/login">
          {!user ? (
            <Login data={{ dispatch, SET_USER }} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <div className="app_body">
          <Route exact path="/">
            {user ? (
              <>
                <Header user={user} />
                <Posts />
                <Suggestion user={user} />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/profile/:uid" component={Profile} />
          <Route path="/upload">
            <Upload user={user} />
          </Route>
        </div>
      </div>
    </Router>
  );
}

export default App;
