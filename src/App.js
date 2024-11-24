import React, { useState } from "react";
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
import "./App.css";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [games, setGames] = useState([]);

  const scheduleData = {
    "2024-11-23": ["KIA vs LG", "삼성 vs 롯데", "SSG vs 한화"],
    "2024-11-24": ["두산 vs KT"],
  };

  const events = [
    {
      title: "KIA vs LG",
      start: new Date(2024, 10, 23),
      end: new Date(2024, 10, 23),
    },
    {
      title: "삼성 vs 롯데",
      start: new Date(2024, 10, 23),
      end: new Date(2024, 10, 23),
    },
    {
      title: "두산 vs KT",
      start: new Date(2024, 10, 24),
      end: new Date(2024, 10, 24),
    },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const formatted = date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(".", "");
    setFormattedDate(formatted);
    setGames(scheduleData[formatted] || []);
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
                <Schedule events={events} onDateChange={handleDateChange} />
                <MainPage formattedDate={formattedDate} games={games} />
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
          {/* 팀 랭킹 페이지 */}
          <Route path="/team-rankings" element={<TeamRankings />} />
          {/* 수정요청 페이지 */}
          <Route path="/request-board" element={<RequestBoard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
