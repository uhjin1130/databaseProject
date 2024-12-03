import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // 로그인 상태를 추적하는 state
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminloggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    // localStorage에서 로그인 상태 확인 (로그인 성공 시 "loggedIn" 저장)
    const loggedIn = localStorage.getItem("loggedIn");
    setIsLoggedIn(loggedIn === "true");

    // localStorage에서 관리자 로그인 상태 확인 (로그인 성공 시 "adminloggedIn" 저장)
    const adminLoggedIn = localStorage.getItem("adminloggedIn");
    setAdminLoggedIn(adminLoggedIn === "true");

    // localStorage가 변경되면 상태를 업데이트
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("loggedIn");
      setIsLoggedIn(loggedIn === "true");

      const adminLoggedIn = localStorage.getItem("adminloggedIn");
      setAdminLoggedIn(adminLoggedIn === "true");
    };

    // 이벤트 리스너를 사용해 localStorage 변경 시 상태 업데이트
    window.addEventListener("storage", handleStorageChange);

    // 컴포넌트가 unmount 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // 컴포넌트가 마운트될 때만 실행

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("adminloggedIn"); // 관리자 로그인 상태도 제거
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setAdminLoggedIn(false); // 관리자의 로그인 상태도 false로 변경
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">야구 전적 검색</Link>
      </div>
      <ul className="menu">
        <li>
          <Link
            to="/matchRecords"
            className={isLoggedIn || adminloggedIn ? "" : "disabled-link"}
          >
            경기기록
          </Link>
        </li>
        <li>
          <Link
            to="/teamInfo"
            className={isLoggedIn || adminloggedIn ? "" : "disabled-link"}
          >
            팀
          </Link>
        </li>
        <li>
          <Link
            to="/players"
            className={isLoggedIn || adminloggedIn ? "" : "disabled-link"}
          >
            선수
          </Link>
        </li>
        <li>
          <Link
            to="/team-rankings"
            className={isLoggedIn || adminloggedIn ? "" : "disabled-link"}
          >
            순위
          </Link>
        </li>
        <li>
          <Link
            to="/request-board"
            className={isLoggedIn || adminloggedIn ? "" : "disabled-link"}
          >
            수정요청
          </Link>
        </li>
        <li>
          <Link
            to="/edit"
            className={isLoggedIn || adminloggedIn ? "" : "disabled-link"}
          >
            수정내역
          </Link>
        </li>
        <li>
          <Link to="/admin" className={adminloggedIn ? "" : "disabled-link"}>
            관리페이지
          </Link>
        </li>
      </ul>

      <div className="auth-buttons">
        {isLoggedIn || adminloggedIn ? ( // 둘 중 하나라도 true일 때
          <>
            <button className="member-btn">
              <Link to="mypage">회원정보</Link>
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="admin-login-btn">
              <Link to="/adminlogin">관리자</Link>
            </button>
            <button className="login-btn">
              <Link to="/login">로그인</Link>
            </button>
            <button className="signup-btn">
              <Link to="/sign-up">회원가입</Link>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
