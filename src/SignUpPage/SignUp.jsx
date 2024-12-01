import React from "react";
import style from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/signup", data);
      if (response.data.success) {
        alert("회원가입 성공!");
        navigate("/");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className={style.signupContainer}>
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
          </div>
          <div className={style.errorText}>
            {errors.id && <small>{errors.id.message}</small>}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="password" className={style.signUpLabel}>
              PW
            </label>
            <input
              id="password"
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
            {errors.password && <small>{errors.password.message}</small>}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="repassword" className={style.signUpLabel}>
              Re-enter PW
            </label>
            <input
              id="repassword"
              type="password"
              placeholder="Re-enter Password"
              {...register("repassword", {
                required: "비밀번호 확인은 필수 입력입니다.",
                validate: (value) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              })}
            />
          </div>
          <div className={style.errorText}>
            {errors.repassword && <small>{errors.repassword.message}</small>}
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
            {errors.name && <small>{errors.name.message}</small>}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="email" className={style.signUpLabel}>
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "유효하지 않은 이메일 주소입니다.",
                },
              })}
            />
          </div>
          <div className={style.errorText}>
            {errors.email && <small>{errors.email.message}</small>}
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="phone" className={style.signUpLabel}>
              phone
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Enter your phone"
              {...register("phone", { required: "번호 입력은 필수입니다." })}
            />
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
