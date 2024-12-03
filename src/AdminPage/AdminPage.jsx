import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [currentTable, setCurrentTable] = useState(null);
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [updatedRow, setUpdatedRow] = useState({});

  const tables = [
    "admins",
    "defensestat",
    "edithistory",
    "editrequest",
    "gamerecords",
    "gamescheduel",
    "hitstat",
    "members",
    "players",
    "position",
    "referees",
    "seasons",
    "stadium",
    "teamhistory",
    "teams",
  ]; // 필요한 테이블 추가

  const fieldMappings = {
    admins: [
      "Admin_ID",
      "Admin_Name",
      "Admin_Phone",
      "Admin_Email",
      "Admin_PW",
    ],
    defensestat: [
      "Player_ID",
      "Raa",
      "Error",
      "DefenseInning",
      "Pass",
      "StealingBlockRate",
    ],
    edithistory: ["Edit_Num", "Admin_ID", "EditRequest_Num", "Content"],
    editrequest: ["EditRequest_Num", "Member_ID", "Content"],
    gamerecords: [
      "Game_Num",
      "Victory_Pitcher",
      "Victory_Hitter",
      "Victory_Team",
      "Defeat_Team",
      "Defeat_Score",
      "Victory_Score",
      "Arena_Name",
      "Referee_ID",
      "date",
      "Season",
    ],
    gamescheduel: ["Game_Num", "Season", "HomeTeam", "AwayTeam", "Game_Date"],
    hitstat: [
      "Player_ID",
      "Hit",
      "Homerun",
      "BattingAvh",
      "Ops",
      "Wrc",
      "Hit_War",
    ],
    members: ["Member_ID", "Member_Name", "Member_Phone", "Member_Email"],
    players: [
      "Player_ID",
      "Player_Name",
      "Player_Team",
      "Player_Num",
      "Position_ID",
    ],
    position: ["Position_ID", "Position_Name"],
    referees: ["Referee_ID", "Referee_Name"],
    seasons: ["Season", "Team_ID", "Player_ID"],
    stadium: ["Arena_Name", "Arena_Region"],
    teamhistory: [
      "TeamHistory_ID",
      "Team_ID",
      "Player_ID",
      "TeamHistory_Date",
      "BeforeTeam",
      "AfterTeam",
    ],
    teams: [
      "Team_ID",
      "Arena_Name",
      "Team_Name",
      "Team_Award",
      "Team_Director",
    ],
  };

  const fetchData = async (table) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/${table}`);
      let records = response.data;

      // 'gamerecords' 테이블에 특수한 데이터 처리 로직
      if (table === "gamerecords") {
        // 데이터 평탄화
        records = Object.entries(records).flatMap(([month, dates]) =>
          Object.entries(dates).flatMap(([date, games]) =>
            games.map((game) => ({ month, date, ...game }))
          )
        );
      }

      setData(records);
      setCurrentTable(table);
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => {
    if (!currentTable) {
      alert("Please select a table first!");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/${currentTable}`, newRow);
      alert("Row added successfully!");
      fetchData(currentTable);
      setNewRow({});
    } catch (error) {
      console.error("Error adding row:", error);
      alert("Failed to add row. Please check your input.");
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setUpdatedRow({});
  };

  const getUniqueId = (row) => {
    // 각 테이블에 따라 고유 ID 값을 동적으로 반환
    if (currentTable === "admins") {
      return row.Admin_ID;
    } else if (currentTable === "defensestat") {
      return row.Player_ID;
    } else if (currentTable === "edithistory") {
      return row.Edit_Num;
    } else if (currentTable === "editrequest") {
      return row.EditRequest_Num;
    } else if (currentTable === "gamerecords") {
      return row.Game_Num;
    } else if (currentTable === "gamescheduel") {
      return row.Game_Num;
    } else if (currentTable === "hitstat") {
      return row.Player_ID;
    } else if (currentTable === "members") {
      return row.Member_ID;
    } else if (currentTable === "players") {
      return row.Player_ID;
    } else if (currentTable === "position") {
      return row.Position_ID;
    } else if (currentTable === "referees") {
      return row.Referee_ID;
    } else if (currentTable === "seasons") {
      return row.Season;
    } else if (currentTable === "stadium") {
      return row.Arena_Name;
    } else if (currentTable === "teamhistory") {
      return row.TeamHistory_ID;
    } else if (currentTable === "teams") {
      return row.Team_ID;
    }
    // 추가적인 테이블들을 처리할 수 있도록 필요에 따라 여기에 추가합니다.
    return null; // 기본적으로는 null을 반환
  };

  const handleEditRow = (id, row) => {
    setEditingRowId(id); // 고유 ID를 설정
    setUpdatedRow({ ...row }); // 수정하려는 행의 데이터를 updatedRow로 복사
  };

  const handleSaveRow = async () => {
    if (!currentTable || !editingRowId) return;

    try {
      await axios.put(
        `http://localhost:5000/${currentTable}/${editingRowId}`,
        updatedRow
      );
      alert("Row updated successfully!");
      fetchData(currentTable);
      setEditingRowId(null);
      setUpdatedRow({});
    } catch (error) {
      console.error("Error updating row:", error);
      alert("Failed to update row.");
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/${currentTable}/${id}`);
      alert("Row deleted successfully!");
      fetchData(currentTable);
    } catch (error) {
      console.error("Error deleting row:", error);
      alert("Failed to delete row.");
    }
  };

  return (
    <div style={{ padding: "20px", overflowX: "auto" }}>
      <h1>Admin Page</h1>
      <div style={{ marginBottom: "20px" }}>
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => fetchData(table)}
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor: currentTable === table ? "#007BFF" : "white",
              color: currentTable === table ? "white" : "#333",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s ease",
            }}
          >
            {table}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : currentTable ? (
        <>
          <h2>Table: {currentTable}</h2>
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <table
              border="1"
              cellPadding="10"
              cellSpacing="0"
              style={{
                width: "100%",
                tableLayout: "fixed",
                marginBottom: "20px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {fieldMappings[currentTable]?.map((field) => (
                    <th key={field}>{field}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                  const uniqueId = getUniqueId(row); // 고유 ID 값 가져오기
                  return (
                    <tr key={uniqueId}>
                      {fieldMappings[currentTable]?.map((field) => (
                        <td key={field}>
                          {editingRowId === uniqueId ? (
                            <input
                              type="text"
                              value={updatedRow[field] || ""}
                              onChange={(e) =>
                                setUpdatedRow((prev) => ({
                                  ...prev,
                                  [field]: e.target.value,
                                }))
                              }
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                              }}
                            />
                          ) : (
                            row[field]
                          )}
                        </td>
                      ))}
                      <td>
                        {editingRowId === uniqueId ? (
                          <>
                            <button onClick={handleSaveRow}>Save</button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditRow(uniqueId, row)}
                            >
                              Edit
                            </button>
                            <button onClick={() => handleDeleteRow(uniqueId)}>
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  {fieldMappings[currentTable]?.map((field) => (
                    <td key={field}>
                      <input
                        type="text"
                        placeholder={`Enter ${field}`}
                        value={newRow[field] || ""}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={handleAddRow}>Add</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Please select a table to view data.</p>
      )}
    </div>
  );
};

export default AdminPage;
