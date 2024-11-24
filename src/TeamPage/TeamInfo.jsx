import React, { useState } from "react";
import "./TeamInfo.css";

const teams = [
  { id: 1, name: "KIA", logo: "Image/KIA.png", info: "팀1의 정보" },
  { id: 2, name: "삼성", logo: "Image/삼성.png", info: "팀2의 정보" },
  { id: 3, name: "LG", logo: "Image/LG.png", info: "팀3의 정보" },
  { id: 4, name: "두산", logo: "Image/두산.png", info: "팀4의 정보" },
  { id: 5, name: "KT", logo: "Image/KT.png", info: "팀5의 정보" },
  { id: 6, name: "SSG", logo: "Image/SSG.png", info: "팀6의 정보" },
  { id: 7, name: "롯데", logo: "Image/롯데.png", info: "팀7의 정보" },
  { id: 8, name: "한화", logo: "Image/한화.png", info: "팀8의 정보" },
  { id: 9, name: "NC", logo: "Image/NC.png", info: "팀9의 정보" },
  { id: 10, name: "키움", logo: "Image/키움.png", info: "팀10의 정보" },
];

function TeamInfo() {
  const [selectedTeam, setSelectedTeam] = useState(null);

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
            key={team.id}
            className="team-logo"
            onClick={() => handleClick(team)}
          >
            <img src={`${team.logo}`} alt={team.name} />
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="popup">
          <div className="popup-content">
            <h2>{selectedTeam.name}</h2>
            <p>{selectedTeam.info}</p>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamInfo;
