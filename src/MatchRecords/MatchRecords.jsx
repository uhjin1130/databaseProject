import React, { useState } from "react";
import "./MatchRecords.css";

const MatchRecords = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-08"); // 기본 월 설정
  const records = [
    {
      date: "2024-08-01",
      match: "KIA vs LG",
      stadium: "잠실",
      winningPitcher: "홍길동",
      umpire: "김철수",
    },
    {
      date: "2024-08-02",
      match: "두산 vs 삼성",
      stadium: "대구",
      winningPitcher: "이영희",
      umpire: "박민수",
    },
    // 추가 데이터 작성
  ];

  const filteredRecords = records.filter((record) =>
    record.date.startsWith(selectedMonth)
  );

  return (
    <div className="match-records-container">
      <div className="header">
        <h2>경기 기록</h2>
        <select
          className="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="2024-08">2024년 8월</option>
          <option value="2024-09">2024년 9월</option>
          <option value="2024-10">2024년 10월</option>
        </select>
      </div>
      <table className="records-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>경기</th>
            <th>구장</th>
            <th>승리투수</th>
            <th>심판</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.match}</td>
                <td>{record.stadium}</td>
                <td>{record.winningPitcher}</td>
                <td>{record.umpire}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">해당 월에 경기가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchRecords;
