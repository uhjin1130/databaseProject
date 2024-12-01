import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MatchRecords.css";

const MatchRecords = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-08"); // 기본 월 설정
  const [records, setRecords] = useState({});

  // API에서 월별 경기 기록을 가져오는 함수
  const fetchMatchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/gamerecords");
      console.log(response.data); // 데이터 확인
      setRecords(response.data); // 데이터 저장
    } catch (error) {
      console.error("Error fetching match records:", error);
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchMatchRecords();
  }, []);

  // 선택된 월의 데이터
  const monthRecords = records[selectedMonth] || {};

  return (
    <div className="match-records-container">
      <div className="header">
        <h2>경기 기록</h2>
        <select
          className="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Object.keys(records).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      {Object.keys(monthRecords).length > 0 ? (
        Object.keys(monthRecords).map((date) => (
          <div key={date} className="daily-records">
            <table className="records-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>경기</th>
                  <th>점수</th>
                  <th>구장</th>
                  <th>승리투수</th>
                  <th>승리타자</th>
                  <th>심판</th>
                </tr>
              </thead>
              <tbody>
                {monthRecords[date].map((record, index) => (
                  <tr key={index}>
                    <td>{date}</td>
                    <td>
                      {record.Victory_Team} vs {record.Defeat_Team}
                    </td>
                    <td>
                      {record.Victory_Score} - {record.Defeat_Score}
                    </td>
                    <td>{record.Arena_Name}</td>
                    <td>{record.Victory_Pitcher}</td>
                    <td>{record.Victory_Hitter}</td>
                    <td>{record.Referee_Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>해당 월에 경기가 없습니다.</p>
      )}
    </div>
  );
};

export default MatchRecords;
