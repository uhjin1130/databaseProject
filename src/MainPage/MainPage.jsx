import React from "react";
import "./MainPage.css"; // 메인 페이지용 스타일

const MainPage = ({ formattedDate, games }) => {
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
