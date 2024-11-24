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
          <Link to="/matchRecords">경기기록</Link>
        </li>
        <li>
          <Link to="/teamInfo">팀</Link>
        </li>
        <li>
          <Link to="/players">선수</Link>
        </li>
        <li>
          <Link to="/team-rankings">순위</Link>
        </li>
        <li>
          <Link to="/request-board">수정요청</Link>
        </li>
      </ul>
      <div className="auth-buttons">
        <button className="login-btn">
          <Link to="/login">로그인</Link>
        </button>
        <button className="signup-btn">
          <Link to="/sign-up">회원가입</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
