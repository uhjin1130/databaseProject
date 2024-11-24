import React, { useState } from "react";
import "./TeamRankings.css";

const TeamRankings = () => {
  const [year, setYear] = useState("2024");
  const [seasonType, setSeasonType] = useState("정규시즌");

  const rankings = [
    { rank: 1, team: "KIA", totalPlay: 144, wins: 80, losses: 60, draws: 4 },
    { rank: 2, team: "LG", totalPlay: 144, wins: 78, losses: 62, draws: 4 },
    { rank: 3, team: "두산", totalPlay: 144, wins: 75, losses: 65, draws: 4 },
    { rank: 4, team: "SSG", totalPlay: 144, wins: 72, losses: 68, draws: 4 },
    { rank: 5, team: "삼성", totalPlay: 144, wins: 70, losses: 70, draws: 4 },
  ];

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSeasonChange = (event) => {
    setSeasonType(event.target.value);
  };

  return (
    <div className="team-rankings-container">
      <h2>
        {year} {seasonType} 팀 순위
      </h2>
      <div className="controls">
        <select
          value={year}
          onChange={handleYearChange}
          className="year-selector"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <select
          value={seasonType}
          onChange={handleSeasonChange}
          className="season-selector"
        >
          <option value="정규시즌">정규시즌</option>
          <option value="포스트시즌">포스트시즌</option>
        </select>
      </div>
      <table className="team-rankings-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>팀</th>
            <th>경기수</th>
            <th>승</th>
            <th>패</th>
            <th>무</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((team, index) => (
            <tr key={index}>
              <td>{team.rank}</td>
              <td>{team.team}</td>
              <td>{team.totalPlay}</td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
              <td>{team.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamRankings;
