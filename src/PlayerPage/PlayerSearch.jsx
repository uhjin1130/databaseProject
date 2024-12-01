import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlayerSearch.css";

const PlayerRecords = () => {
  const [activeTab, setActiveTab] = useState("타자");
  const [searchQuery, setSearchQuery] = useState("");
  const [playersData, setPlayersData] = useState([]);

  // Tabs
  const tabs = ["타자", "투수"];

  // 서버에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching players data"); // 확인용 로그
        const response = await axios.get("http://localhost:5000/players");
        console.log("Received data:", response.data); // 받아온 데이터 확인
        setPlayersData(response.data);
      } catch (error) {
        console.error("Error fetching player data", error);
      }
    };

    fetchData();
  }, []);

  // 필터링된 데이터
  const filteredData = playersData.filter((player) => {
    const isSearchMatch = player.Player_Name.includes(searchQuery);
    // "타자" 또는 "투수" 탭에 맞게 Position_ID를 필터링
    const isPositionMatch =
      activeTab === "타자"
        ? player.Position_ID === 1
        : player.Position_ID === 0;
    return isSearchMatch && isPositionMatch;
  });

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
              <th>선수명</th>
              <th>팀명</th>
              <th>등 번호</th>
              <th>HIT</th>
              <th>HomeRun</th>
              <th>BattingAvh</th>
              <th>Ops</th>
              <th>Wrc</th>
              <th>Hit_War</th>
              <th>Kbb</th>
              <th>DeAvg</th>
              <th>Era</th>
              <th>PitchWar</th>
              <th>Raa</th>
              <th>Error</th>
              <th>DefenseInning</th>
              <th>Pass</th>
              <th>StealingBlockRate</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((player) => (
              <tr key={player.Player_ID}>
                <td>{player.Player_Name}</td>
                <td>{player.Player_Team}</td>
                <td>{player.Player_Num}</td>
                <td>{player.Hit || "N"}</td>
                <td>{player.Homerun || "N"}</td>
                <td>{player.BattingAvh || "N"}</td>
                <td>{player.Ops || "N"}</td>
                <td>{player.Wrc || "N"}</td>
                <td>{player.Hit_War || "N"}</td>
                <td>{player.Kbb || "N"}</td>
                <td>{player.DeAvg || "N"}</td>
                <td>{player.Era || "N"}</td>
                <td>{player.PitchWar || "N"}</td>
                <td>{player.Raa || "N"}</td>
                <td>{player.Error || "N"}</td>
                <td>{player.DefenseInning || "N"}</td>
                <td>{player.Pass || "N"}</td>
                <td>{player.StealingBlockRate || "N"}</td>
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
