import React, { useState, useEffect } from "react";

const MyPage = () => {
  const [userData, setUserData] = useState({
    memberName: "",
    memberPhone: "",
    memberEmail: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // 로그인한 사용자 정보 불러오기
  const loggedInUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!loggedInUser) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login"; // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log(loggedInUser);
        // loggedInUser를 사용하여 해당 ID에 맞는 회원 정보 요청
        const response = await fetch(
          `http://localhost:5000/members/${loggedInUser}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserData({
            memberName: data.Member_Name,
            memberPhone: data.Member_Phone,
            memberEmail: data.Member_Email,
            password: "", // 비밀번호는 비어 있도록 설정
          });
        } else {
          alert("회원 정보 로딩 실패");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("서버 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      Member_Name: userData.memberName,
      Member_Phone: userData.memberPhone,
      Member_Email: userData.memberEmail,
    };

    // 비밀번호가 입력된 경우만 포함
    if (userData.password) {
      updatedData.Password = userData.password;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${loggedInUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        alert("정보가 수정되었습니다.");
      } else {
        alert("정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/members/${loggedInUser}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("currentUser"); // 로그아웃 처리
          window.location.href = "/"; // 홈으로 리다이렉트
        } else {
          alert("회원 탈퇴에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("서버 오류가 발생했습니다.");
      }
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mypage">
      <h1>마이페이지</h1>
      <form onSubmit={handleSubmit}>
        {/* 기존 폼 */}
        <div className="form-group">
          <label htmlFor="memberName">이름</label>
          <input
            type="text"
            id="memberName"
            name="memberName"
            value={userData.memberName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="memberPhone">전화번호</label>
          <input
            type="text"
            id="memberPhone"
            name="memberPhone"
            value={userData.memberPhone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="memberEmail">이메일</label>
          <input
            type="email"
            id="memberEmail"
            name="memberEmail"
            value={userData.memberEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="비밀번호를 수정하려면 입력하세요"
          />
        </div>
      </form>
      <button type="submit">정보 수정</button>
      {/* 회원 탈퇴 버튼 */}
      <button
        onClick={handleDeleteAccount}
        style={{ color: "red", marginTop: "10px", marginLeft: "80px" }}
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default MyPage;
