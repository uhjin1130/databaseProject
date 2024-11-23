import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">야구 전적 검색</Link>
      </div>
      <ul className="menu">
        <li>
          <Link to="/teams">팀</Link>
        </li>
        <li>
          <Link to="/players">선수</Link>
        </li>
        <li>
          <Link to="/ranking">순위</Link>
        </li>
        <li>
          <Link to="/request-board">수정요청</Link>
        </li>
      </ul>
      <div className="auth-buttons">
        <button className="login-btn">로그인</button>
        <button className="signup-btn">회원가입</button>
      </div>
    </nav>
  );
};

export default Navbar;
