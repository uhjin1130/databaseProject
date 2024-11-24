import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 생년월일 달력 스타일의 picker 스타일 추가
import style from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function SignUp({ onBackClick }) {
  const navigate = useNavigate();
  const [birthdate, setBirthdate] = useState(null); // 생년월일 상태
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("회원가입 데이터:", { ...data, birthdate });
    alert("회원가입 성공!");
    navigate("/");
  };

  return (
    <div className={style.signupContainer}>
      <div className={style.logoContainer} onClick={() => navigate("/")}>
        {/*추후 로고 추가*/}
      </div>
      <div className={style.formBox}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.inputGroup}>
            <label htmlFor="id" className={style.signUpLabel}>
              ID
            </label>
            <input
              id="id"
              type="text"
              placeholder="Enter ID"
              {...register("id", { required: "ID는 필수 입력입니다." })}
            />
            <button className={style.checkButton}>중복 확인</button>
          </div>
          <div className={style.errorText}>
            {errors.id && <small role="alert">{errors.id.message}</small>}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="pw" className={style.signUpLabel}>
              PW
            </label>
            <input
              id="pw"
              type="password"
              placeholder="Enter Password"
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                minLength: {
                  value: 6,
                  message: "비밀번호는 6자 이상이어야 합니다.",
                },
              })}
            />
          </div>
          <div className={style.errorText}>
            {errors.password && (
              <small role="alert">{errors.password.message}</small>
            )}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="reenter-pw" className={style.ReEnterPWLabel}>
              Re-enter PW
            </label>
            <input
              id="reenter-pw"
              type="password"
              placeholder="Re-enter Password"
              {...register("repassword", {
                required: "비밀번호 확인은 필수 입력입니다.",
                validate: (value, { password }) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              })}
            />
          </div>
          <div className={style.errorText}>
            {errors.repassword && (
              <small role="alert" className={style.errorText}>
                {errors.repassword.message}
              </small>
            )}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="name" className={style.signUpLabel}>
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "이름은 필수 입력입니다." })}
            />
          </div>
          <div className={style.errorText}>
            {errors.name && (
              <small role="alert" className={style.errorText}>
                {errors.name.message}
              </small>
            )}
          </div>

          <div className={style.inputGroup}>
            <label className={style.signUpLabel}>Email</label>
            <div className={style.emailBox}>
              <input
                type="text"
                placeholder="Enter your E-mail Address"
                {...register("email", {
                  required: "이메일은 필수 입력입니다.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "유효하지 않은 이메일 주소입니다.",
                  },
                })}
              />
            </div>
          </div>
          <div className={style.errorText}>
            {errors.email && (
              <small role="alert" className={style.errorText}>
                {errors.email.message}
              </small>
            )}
          </div>

          <div className={style.inputGroup}>
            <label className={style.signUpLabel}>Birthdate</label>
            <div className={style.birthdateBox}>
              <DatePicker
                selected={birthdate}
                onChange={(date) => setBirthdate(date)} // 날짜 변경 시 상태 업데이트
                dateFormat="yyyy / MM / dd"
                placeholderText="Select your birthdate"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100} // 100개의 연도 항목을 표시
                maxDate={new Date()} // 오늘 날짜 이후로 선택 못하게 설정
              />
            </div>
          </div>
          <button className={style.signupButton} type="submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
