import React from "react";
import "./MainPage.css"; // 메인 페이지용 스타일

const MainPage = ({ selectedDate, scheduleData }) => {
  // 선택된 날짜를 "YYYY-MM-DD" 형식으로 변환
  const formattedDate = selectedDate
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "") // '2024-07-23' 형식으로 변환
    .replace(/ /g, "-");

  // scheduleData에서 해당 날짜의 경기 가져오기
  const games = scheduleData[formattedDate] || [];

  return (
    <div className="main-page">
      <h2>{formattedDate}</h2>
      {games.length > 0 ? (
        <ul>
          {games.map((game, index) => (
            <li key={index}>{game}</li>
          ))}
        </ul>
      ) : (
        <p>경기 일정이 없습니다.</p>
      )}
    </div>
  );
};

export default MainPage;
