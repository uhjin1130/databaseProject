import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeamRankings.css";

const TeamRankings = () => {
  const [year, setYear] = useState("2024");
  const [seasonType, setSeasonType] = useState("정규시즌");
  const [rankings, setRankings] = useState([]);

  // 팀 순위 가져오기
  const fetchRankings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/team-rankings", {
        params: { seasonType }, // 선택된 시즌을 파라미터로 전달
      });
      setRankings(response.data);
    } catch (error) {
      console.error("Error fetching team rankings:", error);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [seasonType]); // 시즌 유형이 변경될 때마다 순위 재조회

  const handleSeasonChange = (event) => {
    setSeasonType(event.target.value);
  };

  return (
    <div className="team-rankings-container">
      <h2>
        {year} {seasonType == "Regular" ? "정규시즌" : "포스트시즌"} 팀 순위
      </h2>
      <div className="controls">
        <select
          value={seasonType}
          onChange={handleSeasonChange}
          className="season-selector"
        >
          <option value="Regular">정규시즌</option>
          <option value="Post">포스트시즌</option>
        </select>
      </div>
      <table className="team-rankings-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>팀</th>
            <th>승</th>
          </tr>
        </thead>
        <tbody>
          {rankings.length > 0 ? (
            rankings.map((team, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{team.team}</td>
                <td>{team.wins}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamRankings;
