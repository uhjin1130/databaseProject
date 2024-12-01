import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  // 로그인 상태를 추적하는 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // localStorage에서 로그인 상태 확인 (로그인 성공 시 "loggedIn" 저장)
    const loggedIn = localStorage.getItem("loggedIn");
    setIsLoggedIn(loggedIn === "true");

    // localStorage가 변경되면 상태를 업데이트
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("loggedIn");
      setIsLoggedIn(loggedIn === "true");
    };

    // 이벤트 리스너를 사용해 localStorage 변경 시 상태 업데이트
    window.addEventListener("storage", handleStorageChange);

    // 컴포넌트가 unmount 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    window.location.reload();
  };

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
        <li>
          <Link to="/edit">수정내역</Link>
        </li>
      </ul>
      <div className="auth-buttons">
        {!isLoggedIn ? (
          <>
            <button className="login-btn">
              <Link to="/login">로그인</Link>
            </button>
            <button className="signup-btn">
              <Link to="/sign-up">회원가입</Link>
            </button>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
