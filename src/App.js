import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./MainPage/NavBar";
import Schedule from "./MainPage/Schedule";
import MainPage from "./MainPage/MainPage";
import RequestBoard from "./RequestBoard/RequestBoard"; // 수정요청 게시판
import TeamRankings from "./Ranking/TeamRankings";
import MatchRecords from "./MatchRecords/MatchRecords";
import Login from "./LoginPage/Login";
import SignUp from "./SignUpPage/SignUp";
import TeamInfo from "./TeamPage/TeamInfo";
import PlayerSearch from "./PlayerPage/PlayerSearch";
import EditPage from "./editPage/EditPage";
import "./App.css";
import axios from "axios";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});

  // scheduleData 초기화
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gamescheduel");
        const newScheduleData = {};

        response.data.forEach((game) => {
          const gameDate = new Date(game.Game_Date)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\./g, "")
            .replace(/ /g, "-"); // 2024-07-23 형식으로 변환

          if (!newScheduleData[gameDate]) {
            newScheduleData[gameDate] = [];
          }

          newScheduleData[gameDate].push(
            `${game.HomeTeam} vs ${game.AwayTeam}`
          );
        });

        setScheduleData(newScheduleData);
      } catch (error) {
        console.error("Error fetching game schedule:", error);
      }
    };

    fetchScheduleData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* 라우팅 설정 */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-container">
                <Schedule
                  events={scheduleData}
                  onDateChange={handleDateChange}
                />
                <MainPage
                  selectedDate={selectedDate}
                  scheduleData={scheduleData}
                />
              </div>
            }
          />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />
          {/* 회원가입 페이지 */}
          <Route path="/sign-up" element={<SignUp />} />
          {/* 경기기록 페이지 */}
          <Route path="/MatchRecords" element={<MatchRecords />} />
          {/* 팀 정보 페이지 */}
          <Route path="/teamInfo" element={<TeamInfo />} />
          {/* 선수 검색 페이지 */}
          <Route path="/players" element={<PlayerSearch />} />
          {/* 팀 랭킹 페이지 */}
          <Route path="/team-rankings" element={<TeamRankings />} />
          {/* 수정요청 페이지 */}
          <Route path="/request-board" element={<RequestBoard />} />
          {/* 수정내역 페이지 */}
          <Route path="/edit" element={<EditPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
