import React from "react";
import style from "./Login.module.css";

function Login() {
  return (
    <div className={style.loginContainer}>
      <div className={style.logoContainer}>{/*추후 로고 삽입*/}</div>
      <div className={style.formBox}>
        <form>
          <div className={style.inputGroup}>
            <label htmlFor="id" className={style.loginLabel}>
              ID
            </label>
            <input id="id" type="text" placeholder="Enter ID" />
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="pw" className={style.loginLabel}>
              PW
            </label>
            <input id="pw" type="password" placeholder="Enter Password" />
          </div>
          <button className={style.loginBtn} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
