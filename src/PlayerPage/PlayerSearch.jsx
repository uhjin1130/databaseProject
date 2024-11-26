import React, { useState } from "react";
import "./PlayerSearch.css";

const sampleData = [
  {
    rank: 1,
    name: "김선빈",
    team: "KIA",
    avg: 0.588,
    g: 5,
    pa: 23,
    ab: 17,
    h: 10,
    doubles: 3,
    triples: 1,
    hr: 0,
    rbi: 2,
    sb: 0,
    cs: 0,
    bb: 3,
    hbp: 1,
    so: 0,
    gdp: 0,
    e: 0,
  },
  {
    rank: 2,
    name: "문지혁",
    team: "삼성",
    avg: 0.4,
    g: 5,
    pa: 16,
    ab: 15,
    h: 6,
    doubles: 0,
    triples: 0,
    hr: 0,
    rbi: 1,
    sb: 0,
    cs: 0,
    bb: 2,
    hbp: 0,
    so: 4,
    gdp: 0,
    e: 0,
  },
  // 추가 데이터...
];

const PlayerRecords = () => {
  const [activeTab, setActiveTab] = useState("타자");
  const [year, setYear] = useState("2024");
  const [league, setLeague] = useState("KBO 한국시리즈");
  const [team, setTeam] = useState("팀 선택");
  const [position, setPosition] = useState("포지션 선택");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["타자", "투수", "수비", "주루"];

  // 필터링된 데이터
  const filteredData = sampleData.filter((player) =>
    player.name.includes(searchQuery)
  );

  return (
    <div className="player-records-container">
      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filters">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          {/* 추가 연도 */}
        </select>
        <select value={league} onChange={(e) => setLeague(e.target.value)}>
          <option value="KBO 한국시리즈">KBO 한국시리즈</option>
          <option value="KBO 정규시즌">KBO 정규시즌</option>
          {/* 추가 리그 */}
        </select>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="팀 선택">팀 선택</option>
          <option value="KIA">KIA</option>
          <option value="삼성">삼성</option>
          {/* 추가 팀 */}
        </select>
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="포지션 선택">포지션 선택</option>
          <option value="내야수">내야수</option>
          <option value="외야수">외야수</option>
          {/* 추가 포지션 */}
        </select>
        <input
          type="text"
          className="search-box"
          placeholder="선수 이름 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="records-section">
        <h4>{activeTab} 기록</h4>
        <table className="player-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>선수명</th>
              <th>팀명</th>
              <th>AVG</th>
              <th>G</th>
              <th>PA</th>
              <th>AB</th>
              <th>H</th>
              <th>2B</th>
              <th>3B</th>
              <th>HR</th>
              <th>RBI</th>
              <th>SB</th>
              <th>CS</th>
              <th>BB</th>
              <th>HBP</th>
              <th>SO</th>
              <th>GDP</th>
              <th>E</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((player) => (
              <tr key={player.rank}>
                <td>{player.rank}</td>
                <td>{player.name}</td>
                <td>{player.team}</td>
                <td>{player.avg.toFixed(3)}</td>
                <td>{player.g}</td>
                <td>{player.pa}</td>
                <td>{player.ab}</td>
                <td>{player.h}</td>
                <td>{player.doubles}</td>
                <td>{player.triples}</td>
                <td>{player.hr}</td>
                <td>{player.rbi}</td>
                <td>{player.sb}</td>
                <td>{player.cs}</td>
                <td>{player.bb}</td>
                <td>{player.hbp}</td>
                <td>{player.so}</td>
                <td>{player.gdp}</td>
                <td>{player.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button>1</button>
        {/* 추가 페이지 번호 */}
      </div>
    </div>
  );
};

export default PlayerRecords;
