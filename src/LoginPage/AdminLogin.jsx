import React, { useState } from "react";
import axios from "axios";
import style from "./Login.module.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/adminlogin", {
        id,
        pw,
      });
      console.log(response.data);

      // 로그인 성공 시 localStorage에 로그인 정보 저장
      localStorage.setItem("adminloggedIn", "true");
      alert("Admin Login successful!");
      navigate("/"); // 로그인 후 홈 화면으로 리디렉션
      window.location.reload();
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.logoContainer}>{/* 추후 로고 삽입 */}</div>
      <div className={style.formBox}>
        <form onSubmit={handleSubmit}>
          <div className={style.inputGroup}>
            <label htmlFor="id" className={style.loginLabel}>
              ID
            </label>
            <input
              id="id"
              type="text"
              placeholder="Enter ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="pw" className={style.loginLabel}>
              PW
            </label>
            <input
              id="pw"
              type="password"
              placeholder="Enter Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <button className={style.loginBtn} type="submit">
            Login
          </button>
        </form>
        {errorMessage && (
          <div className={style.errorMessage}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
}

export default Login;
