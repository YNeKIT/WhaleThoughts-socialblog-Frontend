import React from "react";
import Button from "@mui/material/Button";
import WhaleLogo from "../../Icons/whaleLogo.svg";
import Avatar from "../../Icons/noavatar.png";
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import LogOut from "../../Icons/logout.svg";
import LogIn from "../../Icons/login.svg";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth, selectUserData, logout } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Header = () => {
  const dispatchc = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserData); // Fetch user data

  const onClickLogout = () => {
    if (window.confirm("You are sure ?")) {
      dispatchc(logout());
      window.localStorage.removeItem("token");
    }

    if(!isAuth) {
      return <Navigate to="/login" />
    }

  };
 
  // Define the avatar source
  const avatarSource = userData?.avatarUrl || Avatar;

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link to={`/`} className={styles.logo}>
            <img src={WhaleLogo} className={styles.whaleLogo} alt="Logo" />
            <div>WhaleThoughts</div>
          </Link>

          <div className={styles.buttons}>
            <div className={styles.headerRight}>
              <Link to={`/Messenger`}>
                <CommentIcon />
                <span>{4}</span>
              </Link>

              {/* Render avatar with default or fetched URL */}
              <Link to={"/Profile"}>
                <img
                 src=
                 {`http://localhost:4444${avatarSource}`}
                  className={styles.avatar}
                  alt="Avatar"
                />
              </Link>

              {!isAuth ? (
                <Link to={`/Login`}>
                  <img src={LogOut} className={styles.logout} alt="Logout" />
                </Link>
              ) : (
                <Link to={`/Login`}>
                  <img
                    src={LogIn}
                    className={styles.logout}
                    alt="Logout"
                    onClick={onClickLogout}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
