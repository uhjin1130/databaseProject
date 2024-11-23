import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const Schedule = ({ onDateChange, events }) => {
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.start;
    onDateChange(selectedDate); // 부모 컴포넌트로 선택된 날짜 전달
  };

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
