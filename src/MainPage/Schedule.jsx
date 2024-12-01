import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const Schedule = ({ onDateChange }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState({});

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    const fetchGameSchedule = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gamescheduel");

        // 데이터를 날짜별로 분류하여 scheduleData로 변환
        const newScheduleData = {};

        response.data.forEach((game) => {
          // 날짜를 YYYY-MM-DD 형식으로 변환
          const gameDate = new Date(game.Game_Date)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", ""); // '2024-12-01' 형식으로 변환

          if (!newScheduleData[gameDate]) {
            newScheduleData[gameDate] = [];
          }

          newScheduleData[gameDate].push(
            `${game.HomeTeam} vs ${game.AwayTeam}`
          );
        });

        setScheduleData(newScheduleData);

        // react-big-calendar에서 사용할 수 있도록 events 변환
        const formattedEvents = response.data.map((game) => ({
          title: `${game.HomeTeam} vs ${game.AwayTeam}`,
          start: new Date(game.Game_Date),
          end: new Date(
            new Date(game.Game_Date).getTime() + 2 * 60 * 60 * 1000
          ),
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching game schedule:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameSchedule();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.start;
    onDateChange(selectedDate); // 부모 컴포넌트로 선택된 날짜 전달
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className="schedule-container"
      style={{ height: "700px", width: "1000px", margin: "20px" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: 1000 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default Schedule;
