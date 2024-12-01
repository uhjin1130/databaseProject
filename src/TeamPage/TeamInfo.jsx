import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeamInfo.css";

const TeamInfo = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // API에서 팀 정보를 가져오는 함수
  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/teams-info");
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams data:", error);
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchTeams();
  }, []);

  const handleClick = (team) => {
    setSelectedTeam(team);
  };

  const closePopup = () => {
    setSelectedTeam(null);
  };

  return (
    <div className="team-info-container">
      <div className="team-grid">
        {teams.map((team) => (
          <div
            key={team.Team_ID}
            className="team-logo"
            onClick={() => handleClick(team)}
          >
            <img
              src={`Image/${team.Team_Name}.png`}
              alt={team.Team_Name}
              onError={(e) => (e.target.src = "Image/default.png")}
            />
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="popup">
          <div className="popup-content">
            <h2>{selectedTeam.Team_Name}</h2>
            <p>
              <strong>구장:</strong> {selectedTeam.Arena_Name}
            </p>
            <p>
              <strong>감독:</strong> {selectedTeam.Team_Director}
            </p>
            <p>
              <strong>수상 경력:</strong> {selectedTeam.Team_Award}
            </p>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamInfo;
