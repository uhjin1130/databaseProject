const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcrypt");
const saltRounds = 10; // bcrypt 해시화 시 사용할 saltRounds 정의

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API: admins 테이블 데이터 가져오기
app.get("/admins", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM admins");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// admins 테이블에 데이터 추가
app.post("/admins", async (req, res) => {
  const { Admin_ID, Admin_Name, Admin_Phone, Admin_Email, Admin_PW } = req.body;

  if (!Admin_ID || !Admin_Name || !Admin_Phone || !Admin_Email || !Admin_PW) {
    return res.status(400).send("모든 필드를 입력해야 합니다.");
  }

  try {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(Admin_PW, saltRounds); // saltRounds 정의한 후 사용

    const query = `
      INSERT INTO admins (Admin_ID, Admin_Name, Admin_Phone, Admin_Email, Admin_PW)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      Admin_ID,
      Admin_Name,
      Admin_Phone,
      Admin_Email,
      hashedPassword, // 해시된 비밀번호 저장
    ]);
    res.json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error("admins 추가 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

/// admins 테이블 데이터 수정
app.put("/admins/:id", async (req, res) => {
  const { id } = req.params; // URL에서 ID 추출
  const { Admin_Name, Admin_Phone, Admin_Email, Admin_PW } = req.body;

  if (!Admin_Name || !Admin_Phone || !Admin_Email) {
    return res.status(400).send("모든 필드를 입력해야 합니다.");
  }

  try {
    let hashedPassword = null;
    if (Admin_PW) {
      // 비밀번호가 수정되었을 때만 해시화
      hashedPassword = await bcrypt.hash(Admin_PW, saltRounds);
    }

    const query = `
      UPDATE admins 
      SET Admin_Name = ?, Admin_Phone = ?, Admin_Email = ?, Admin_PW = ?
      WHERE Admin_ID = ?
    `;
    const [result] = await db.query(query, [
      Admin_Name,
      Admin_Phone,
      Admin_Email,
      hashedPassword || null, // 비밀번호가 없으면 기존 비밀번호 그대로 두기
      id, // 조건절에 사용하는 ID
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("해당 ID를 가진 관리자가 없습니다.");
    }
    res.json({ success: true, message: "수정 완료" });
  } catch (error) {
    console.error("admins 수정 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// admins 테이블 데이터 삭제
app.delete("/admins/:id", async (req, res) => {
  const { id } = req.params; // URL의 id 값 가져오기
  try {
    const query = `
      DELETE FROM admins
      WHERE Admin_ID = ?
    `;
    const [result] = await db.query(query, [id]); // id 매핑
    if (result.affectedRows === 0) {
      return res.status(404).send("해당 ID를 가진 관리자가 없습니다.");
    }
    res.json({ success: true, message: "삭제 완료" });
  } catch (error) {
    console.error("admins 삭제 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// API: defensestat 테이블 데이터 가져오기
app.get("/defensestat", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM defensestat");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// defensestat 테이블에 데이터 추가
app.post("/defensestat", async (req, res) => {
  const { Player_ID, Raa, Error, DefenseInning, Pass, StealingBlockRate } =
    req.body;

  // 필요한 필드들이 모두 입력됐는지 확인
  if (
    Player_ID == null ||
    Raa == null ||
    Error == null ||
    DefenseInning == null ||
    Pass == null ||
    StealingBlockRate == null
  ) {
    return res.status(400).send("모든 필드를 입력해야 합니다.");
  }

  try {
    const query = `
      INSERT INTO defensestat (Player_ID, Raa, Error, DefenseInning, Pass, StealingBlockRate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      Player_ID,
      Raa,
      Error,
      DefenseInning,
      Pass,
      StealingBlockRate,
    ]);

    res.status(201).json({
      success: true,
      message: "데이터 추가 완료",
      id: result.insertId,
    });
  } catch (error) {
    console.error("defensestat 추가 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// defensestat 테이블 데이터 수정
app.put("/defensestat/:id", async (req, res) => {
  const { id } = req.params; // URL에서 Player_ID 추출
  const { Raa, Error, DefenseInning, Pass, StealingBlockRate } = req.body;

  // 필요한 필드들이 모두 입력됐는지 확인
  if (
    Raa == null ||
    Error == null ||
    DefenseInning == null ||
    Pass == null ||
    StealingBlockRate == null
  ) {
    return res.status(400).send("모든 필드를 입력해야 합니다.");
  }

  try {
    const query = `
      UPDATE defensestat 
      SET Raa = ?, Error = ?, DefenseInning = ?, Pass = ?, StealingBlockRate = ?
      WHERE Player_ID = ?
    `;
    const [result] = await db.query(query, [
      Raa,
      Error,
      DefenseInning,
      Pass,
      StealingBlockRate,
      id, // 조건절에 사용하는 Player_ID
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("해당 ID를 가진 선수 기록이 없습니다.");
    }

    res.json({ success: true, message: "수정 완료" });
  } catch (error) {
    console.error("defensestat 수정 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// defensestat 테이블 데이터 삭제
app.delete("/defensestat/:id", async (req, res) => {
  const { id } = req.params; // URL의 id 값 가져오기
  try {
    const query = `
      DELETE FROM defensestat
      WHERE Player_ID = ?
    `;
    const [result] = await db.query(query, [id]); // id 매핑

    if (result.affectedRows === 0) {
      return res.status(404).send("해당 ID를 가진 선수 기록이 없습니다.");
    }

    res.json({ success: true, message: "삭제 완료" });
  } catch (error) {
    console.error("defensestat 삭제 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// API: edithistory 테이블 데이터 가져오기
app.get("/edithistory", async (req, res) => {
  try {
    const query = `
      SELECT 
        Edit_Num, 
        Admin_ID, 
        EditRequest_Num,
        Content
      FROM edithistory
      ORDER BY Edit_Num DESC;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching edit history:", error);
    res.status(500).send("Server error");
  }
});

// POST: 새로운 edit history 추가
app.post("/edithistory", async (req, res) => {
  const { Edit_Num, Admin_ID, EditRequest_Num, Content } = req.body; // 요청에서 필요한 데이터 추출

  try {
    // editrequest 테이블에 해당 EditRequest_Num이 존재하는지 확인
    const [checkEditRequest] = await db.query(
      "SELECT * FROM editrequest WHERE EditRequest_Num = ?",
      [EditRequest_Num]
    );

    if (checkEditRequest.length === 0) {
      return res
        .status(400)
        .send("EditRequest_Num does not exist in editrequest table.");
    }

    // SQL 쿼리 작성
    const query = `
      INSERT INTO edithistory (Edit_Num, Admin_ID, EditRequest_Num, content)
      VALUES (?, ?, ?, ?);
    `;
    const [result] = await db.query(query, [
      Edit_Num,
      Admin_ID,
      EditRequest_Num,
      Content,
    ]);

    // 성공적으로 추가되었으면 새로운 데이터를 반환
    res.status(201).json({
      id: result.insertId,
      Edit_Num,
      Admin_ID,
      EditRequest_Num,
      Content, // 삽입한 내용 확인
    });
  } catch (error) {
    console.error("Error adding edit history:", error);
    res.status(500).send("Server error");
  }
});

// PUT: edit history 수정
app.put("/edithistory/:id", async (req, res) => {
  try {
    const { id } = req.params; // URL에서 ID 추출
    const { Admin_ID, EditRequest_Num, Content } = req.body; // 수정할 데이터 추출

    // SQL 쿼리 작성
    const query = `
      UPDATE edithistory 
      SET Admin_ID = ?, EditRequest_Num = ?, Content = ?
      WHERE Edit_Num = ?;
    `;
    const [result] = await db.query(query, [
      Admin_ID,
      EditRequest_Num,
      Content,
      id,
    ]);

    // 수정된 행이 없으면 404 반환
    if (result.affectedRows === 0) {
      return res.status(404).send("Edit history not found");
    }

    // 성공적으로 수정되었으면 변경된 데이터를 반환
    res.status(200).json({ id, Admin_ID, EditRequest_Num, Content });
  } catch (error) {
    console.error("Error updating edit history:", error);
    res.status(500).send("Server error");
  }
});

// DELETE: edit history 삭제
app.delete("/edithistory/:id", async (req, res) => {
  try {
    const { id } = req.params; // URL에서 ID 추출

    // SQL 쿼리 작성
    const query = `
      DELETE FROM edithistory WHERE Edit_Num = ?;
    `;
    const [result] = await db.query(query, [id]);

    // 삭제된 행이 없으면 404 반환
    if (result.affectedRows === 0) {
      return res.status(404).send("Edit history not found");
    }

    // 성공적으로 삭제되었으면 삭제된 메시지 반환
    res.status(200).send("Edit history deleted successfully");
  } catch (error) {
    console.error("Error deleting edit history:", error);
    res.status(500).send("Server error");
  }
});

// API: editrequest 테이블 데이터 가져오기
app.get("/editrequest", async (req, res) => {
  try {
    const query = `
      SELECT 
        EditRequest_Num, 
        Member_ID, 
        Content 
      FROM editrequest
      ORDER BY EditRequest_Num DESC;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching edit requests:", error);
    res.status(500).send("Server error");
  }
});

// PUT: editrequest 수정
app.put("/editrequest/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 ID 추출
  const { Member_ID, Content } = req.body; // 요청에서 필요한 데이터 추출

  try {
    // SQL 쿼리 작성
    const query = `
      UPDATE editrequest 
      SET Member_ID = ?, Content = ?
      WHERE EditRequest_Num = ?;
    `;
    const [result] = await db.query(query, [Member_ID, Content, id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("EditRequest_Num not found");
    }

    // 수정된 데이터를 반환
    res.status(200).json({
      EditRequest_Num: id,
      Member_ID,
      Content,
    });
  } catch (error) {
    console.error("Error updating edit request:", error);
    res.status(500).send("Server error");
  }
});

// DELETE: editrequest 삭제
app.delete("/editrequest/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 ID 추출

  try {
    // SQL 쿼리 작성
    const query = `
      DELETE FROM editrequest 
      WHERE EditRequest_Num = ?;
    `;
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("EditRequest_Num not found");
    }

    // 삭제 성공
    res.status(200).send("EditRequest_Num deleted successfully");
  } catch (error) {
    console.error("Error deleting edit request:", error);
    res.status(500).send("Server error");
  }
});

// API: editrequest 테이블에 데이터 추가하기
app.post("/editrequest", async (req, res) => {
  try {
    console.log("Request body:", req.body); // 요청 본문 확인
    const { memberId, content } = req.body;

    if (!memberId || !content) {
      console.error("Missing data:", { memberId, content });
      return res.status(400).send("Member ID and content are required");
    }

    const query = `
      INSERT INTO editrequest (Member_ID, Content)
      VALUES (?, ?);
    `;
    const [result] = await db.query(query, [memberId, content]);

    console.log("Insert result:", result);
    res.json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error("Error inserting into editrequest:", error);
    res.status(500).send("Server error");
  }
});

app.get("/gamerecords", async (req, res) => {
  try {
    // SQL 쿼리 작성
    const query = `
      SELECT 
        DATE_FORMAT(g.Game_Date, '%Y-%m') AS month, 
        DATE_FORMAT(g.Game_Date, '%Y-%m-%d') AS date,
        g.Game_Num,
        g.Victory_Team, 
        g.Defeat_Team, 
        g.Victory_Score, 
        g.Defeat_Score, 
        r.Referee_Name,
        s.Arena_Name,
        g.Victory_Pitcher, 
        g.Victory_Hitter,
        g.Season,
        g.Referee_ID
      FROM 
        gamerecords g
      LEFT JOIN 
        referees r ON g.Referee_ID = r.Referee_ID
      LEFT JOIN 
        stadium s ON g.Arena_Name = s.Arena_Name
      ORDER BY 
        g.Game_Date DESC;
    `;

    const [rows] = await db.query(query);

    // 월별 및 날짜별로 데이터를 그룹화
    const monthlyRecords = rows.reduce((acc, row) => {
      const {
        month,
        date,
        Game_Num,
        Victory_Team,
        Defeat_Team,
        Victory_Score,
        Defeat_Score,
        Referee_Name,
        Arena_Name,
        Victory_Pitcher,
        Victory_Hitter,
        Season,
        Referee_ID,
      } = row;

      if (!acc[month]) {
        acc[month] = {};
      }

      if (!acc[month][date]) {
        acc[month][date] = [];
      }

      acc[month][date].push({
        date,
        Game_Num,
        Victory_Team,
        Defeat_Team,
        Victory_Score,
        Defeat_Score,
        Referee_Name,
        Arena_Name,
        Victory_Pitcher,
        Victory_Hitter,
        Season,
        Referee_ID,
      });

      return acc;
    }, {});

    // JSON 형태로 응답
    res.json(monthlyRecords);
  } catch (error) {
    console.error("Error fetching game records:", error);
    res.status(500).send("Server error");
  }
});

app.post("/gamerecords", async (req, res) => {
  const {
    Game_Num,
    date, // 프론트엔드에서 전달된 'date' 필드
    Victory_Team,
    Defeat_Team,
    Victory_Score,
    Defeat_Score,
    Referee_ID,
    Arena_Name,
    Victory_Pitcher,
    Victory_Hitter,
    Season,
  } = req.body;

  // 'date' 값을 Date 객체로 변환하고 UTC로 처리
  const parsedDate = new Date(date + "T00:00:00Z"); // 날짜를 UTC로 설정
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).send("Invalid date format");
  }

  // 'parsedDate'에서 UTC 날짜 추출 (시간은 00:00:00으로 설정)
  const formattedDate = parsedDate.toISOString().split("T")[0] + " 00:00:00"; // 'YYYY-MM-DD 00:00:00' 형식으로 변환

  try {
    // SQL 쿼리 작성
    const query = `
      INSERT INTO gamerecords 
      (Game_Num, GAME_DATE, Victory_Team, Defeat_Team, Victory_Score, Defeat_Score, Referee_ID, Arena_Name, Victory_Pitcher, Victory_Hitter, Season)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await db.query(query, [
      Game_Num,
      formattedDate, // 변환된 'formattedDate' 사용
      Victory_Team,
      Defeat_Team,
      Victory_Score,
      Defeat_Score,
      Referee_ID,
      Arena_Name,
      Victory_Pitcher,
      Victory_Hitter,
      Season,
    ]);

    res.status(201).json({
      id: result.insertId, // 자동 증가된 ID
      Game_Num,
      GAME_DATE: formattedDate, // 변환된 'Game_Date' 반환
      Victory_Team,
      Defeat_Team,
      Victory_Score,
      Defeat_Score,
      Referee_ID,
      Arena_Name,
      Victory_Pitcher,
      Victory_Hitter,
      Season,
    });
  } catch (error) {
    console.error("Error adding game record:", error);
    res.status(500).send("Server error");
  }
});

app.put("/gamerecords/:id", async (req, res) => {
  const { id } = req.params;
  const {
    date, // 프론트엔드에서 전달된 'date' 필드
    Victory_Team,
    Defeat_Team,
    Victory_Score,
    Defeat_Score,
    Referee_ID,
    Arena_Name,
    Victory_Pitcher,
    Victory_Hitter,
    Season,
  } = req.body;

  // 'date' 값을 'Game_Date'로 변환
  const parsedDate = new Date(date); // 'date' 값을 Date 객체로 변환
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).send("Invalid date format");
  }

  // 시간을 00:00:00으로 설정하여 DATETIME 형식으로 변환
  const formattedDate = parsedDate.toISOString().split("T")[0] + " 00:00:00";

  try {
    const query = `
      UPDATE gamerecords 
      SET 
        GAME_DATE = ?, 
        Victory_Team = ?, 
        Defeat_Team = ?, 
        Victory_Score = ?, 
        Defeat_Score = ?, 
        Referee_ID = ?, 
        Arena_Name = ?, 
        Victory_Pitcher = ?, 
        Victory_Hitter = ?, 
        Season = ?
      WHERE Game_Num = ?;
    `;
    const [result] = await db.query(query, [
      formattedDate, // 변환된 'formattedDate' 사용
      Victory_Team,
      Defeat_Team,
      Victory_Score,
      Defeat_Score,
      Referee_ID,
      Arena_Name,
      Victory_Pitcher,
      Victory_Hitter,
      Season,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Game record not found");
    }

    res.status(200).json({
      Game_Num: id,
      GAME_DATE: formattedDate, // 변환된 'Game_Date' 반환
      Victory_Team,
      Defeat_Team,
      Victory_Score,
      Defeat_Score,
      Referee_ID,
      Arena_Name,
      Victory_Pitcher,
      Victory_Hitter,
      Season,
    });
  } catch (error) {
    console.error("Error updating game record:", error);
    res.status(500).send("Server error");
  }
});

// DELETE: 게임 기록 삭제
app.delete("/gamerecords/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 ID 추출

  try {
    // SQL 쿼리 작성
    const query = `
      DELETE FROM gamerecords 
      WHERE Game_Num = ?;
    `;
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Game record not found");
    }

    // 삭제 성공
    res.status(200).send("Game record deleted successfully");
  } catch (error) {
    console.error("Error deleting game record:", error);
    res.status(500).send("Server error");
  }
});

app.get("/team-rankings", async (req, res) => {
  try {
    const { seasonType } = req.query; // 정규시즌 또는 포스트시즌

    // 쿼리 파라미터 확인
    console.log("Selected season type:", seasonType);

    // 시즌에 맞는 게임 기록 가져오기
    const query = `
      SELECT 
        Season, 
        Victory_Team, 
        Defeat_Team
      FROM 
        gamerecords
      WHERE 
        Season = ?
      ORDER BY 
        GAME_DATE DESC;
    `;
    const [rows] = await db.query(query, [seasonType]);

    // 쿼리 실행 결과 확인
    console.log("Fetched rows:", rows);

    if (!rows.length) {
      return res
        .status(404)
        .send("No game records found for the selected season.");
    }

    // 팀별 승리 횟수 계산
    const teamWins = rows.reduce((acc, row) => {
      acc[row.Victory_Team] = (acc[row.Victory_Team] || 0) + 1;
      return acc;
    }, {});

    // 팀 순위 계산
    const sortedTeams = Object.keys(teamWins)
      .map((team) => ({
        team,
        wins: teamWins[team],
      }))
      .sort((a, b) => b.wins - a.wins); // 승수 기준으로 내림차순 정렬

    console.log("Sorted teams:", sortedTeams);

    res.json(sortedTeams);
  } catch (error) {
    console.error("Error fetching team rankings:", error);
    res.status(500).send("Server error");
  }
});

// API: gamescheduel 테이블 데이터 가져오기
app.get("/gamescheduel", async (req, res) => {
  try {
    const query = `
      SELECT
        Game_Num,
        Season,
        HomeTeam,
        AwayTeam,
        DATE_FORMAT(gamescheduel.Game_Date, '%Y-%m-%d') AS Game_Date
      FROM
        gamescheduel
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// POST: 새로운 게임 일정 추가
app.post("/gamescheduel", async (req, res) => {
  const { Game_Num, Season, HomeTeam, AwayTeam, Game_Date } = req.body;

  // 'Game_Date'가 ISO 8601 형식으로 들어왔다고 가정하고 UTC로 변환
  const parsedDate = new Date(Game_Date); // 클라이언트에서 전달된 'Game_Date'는 이미 ISO 형식일 것
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).send("Invalid date format");
  }

  // 'Season'이 실제 'seasons' 테이블에 존재하는지 확인
  const checkSeasonQuery =
    "SELECT COUNT(*) AS count FROM seasons WHERE Season = ?";
  const [checkSeasonResult] = await db.query(checkSeasonQuery, [Season]);

  if (checkSeasonResult[0].count === 0) {
    return res.status(400).send("Season does not exist in seasons table");
  }

  try {
    // 'Game_Date'를 ISO 형식으로 변환하여 UTC 날짜로 저장
    const query = `
      INSERT INTO gamescheduel (Game_Num, Season, HomeTeam, AwayTeam, Game_Date)
      VALUES (?, ?, ?, ?, ?);
    `;
    // UTC로 변환된 날짜를 'YYYY-MM-DD 00:00:00' 형식으로 저장
    const utcDate = new Date(parsedDate.toISOString()); // ISO 형식으로 변환된 UTC 날짜
    const formattedDate = utcDate.toISOString().split("T")[0] + " 00:00:00"; // 'YYYY-MM-DD 00:00:00' 형식

    const [result] = await db.query(query, [
      Game_Num,
      Season,
      HomeTeam,
      AwayTeam,
      formattedDate, // 'Game_Date'를 UTC 날짜로 저장
    ]);

    res.status(201).send("Game schedule added successfully");
  } catch (error) {
    console.error("Error adding game schedule:", error);
    res.status(500).send("Server error");
  }
});

// PUT: 게임 일정 수정
app.put("/gamescheduel/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 게임 ID 추출
  const { Game_Num, Season, HomeTeam, AwayTeam, Game_Date } = req.body;

  const parsedDate = new Date(Game_Date); // 클라이언트에서 전달된 'Game_Date'는 이미 ISO 형식일 것
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).send("Invalid date format");
  }

  // 'Season'이 실제 'seasons' 테이블에 존재하는지 확인
  const checkSeasonQuery =
    "SELECT COUNT(*) AS count FROM seasons WHERE Season = ?";
  const [checkSeasonResult] = await db.query(checkSeasonQuery, [Season]);

  if (checkSeasonResult[0].count === 0) {
    return res.status(400).send("Season does not exist in seasons table");
  }

  try {
    // 'Game_Num'을 기준으로 수정하도록 쿼리 변경
    const query = `
      UPDATE gamescheduel
      SET 
        Season = ?, 
        HomeTeam = ?, 
        AwayTeam = ?, 
        Game_Date = ?
      WHERE Game_Num = ?;
    `;
    // UTC로 변환된 날짜를 'YYYY-MM-DD 00:00:00' 형식으로 저장
    const utcDate = new Date(parsedDate.toISOString()); // ISO 형식으로 변환된 UTC 날짜
    const formattedDate = utcDate.toISOString().split("T")[0] + " 00:00:00"; // 'YYYY-MM-DD 00:00:00' 형식

    const [result] = await db.query(query, [
      Season,
      HomeTeam,
      AwayTeam,
      formattedDate, // 'Game_Date'를 UTC 날짜로 저장
      id, // id는 게임을 찾을 때 사용
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Game schedule not found");
    }

    res.status(200).send("Game schedule updated successfully");
  } catch (error) {
    console.error("Error updating game schedule:", error);
    res.status(500).send("Server error");
  }
});

// DELETE: 게임 일정 삭제
app.delete("/gamescheduel/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 게임 ID 추출

  try {
    // 게임 일정 삭제 쿼리
    const query = "DELETE FROM gamescheduel WHERE Game_Num = ?";
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Game schedule not found");
    }

    // 삭제 성공
    res.status(200).send("Game schedule deleted successfully");
  } catch (error) {
    console.error("Error deleting game schedule:", error);
    res.status(500).send("Server error");
  }
});

// API: hitstat 테이블 데이터 가져오기
app.get("/hitstat", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hitstat");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// POST: 새로운 타격 통계 추가
app.post("/hitstat", async (req, res) => {
  const { Player_ID, Hit, Homerun, BattingAvh, Ops, Wrc, Hit_War } = req.body;

  try {
    // 유효성 검사
    if (
      !Player_ID ||
      Hit < 0 ||
      Homerun < 0 ||
      BattingAvh < 0 ||
      Ops < 0 ||
      Wrc < 0 ||
      Hit_War < 0
    ) {
      return res.status(400).send("Invalid input data");
    }

    const query = `
      INSERT INTO hitstat (Player_ID, Hit, Homerun, BattingAvh, Ops, Wrc, Hit_War)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await db.query(query, [
      Player_ID,
      Hit,
      Homerun,
      BattingAvh,
      Ops,
      Wrc,
      Hit_War,
    ]);

    res.status(201).send("Hit stat added successfully");
  } catch (error) {
    console.error("Error adding hit stat:", error);
    res.status(500).send("Server error");
  }
});

// PUT: 타격 통계 수정
app.put("/hitstat/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 Player_ID 추출
  const { Hit, Homerun, BattingAvh, Ops, Wrc, Hit_War } = req.body;

  try {
    // 유효성 검사
    if (
      Hit < 0 ||
      Homerun < 0 ||
      BattingAvh < 0 ||
      Ops < 0 ||
      Wrc < 0 ||
      Hit_War < 0
    ) {
      return res.status(400).send("Invalid input data");
    }

    const query = `
      UPDATE hitstat
      SET 
        Hit = ?, 
        Homerun = ?, 
        BattingAvh = ?, 
        Ops = ?, 
        Wrc = ?, 
        Hit_War = ?
      WHERE Player_ID = ?;
    `;
    const [result] = await db.query(query, [
      Hit,
      Homerun,
      BattingAvh,
      Ops,
      Wrc,
      Hit_War,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Player not found");
    }

    res.status(200).send("Hit stat updated successfully");
  } catch (error) {
    console.error("Error updating hit stat:", error);
    res.status(500).send("Server error");
  }
});

// DELETE: 타격 통계 삭제
app.delete("/hitstat/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 Player_ID 추출

  try {
    const query = "DELETE FROM hitstat WHERE Player_ID = ?";
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Player not found");
    }

    res.status(200).send("Hit stat deleted successfully");
  } catch (error) {
    console.error("Error deleting hit stat:", error);
    res.status(500).send("Server error");
  }
});

// 관리자 로그인 API 추가
app.post("/adminlogin", async (req, res) => {
  const { id, pw } = req.body;

  if (!id || !pw) {
    return res.status(400).json({ message: "ID and Password are required" });
  }

  try {
    // members 테이블에서 해당 ID의 사용자 정보를 조회
    const query = `SELECT * FROM admins WHERE Admin_ID = ?`;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid ID or Password" });
    }

    const user = rows[0];

    // 비밀번호 비교 (입력된 비밀번호와 암호화된 비밀번호)
    const isMatch = await bcrypt.compare(pw, user.Admin_PW);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid ID or Password" });
    }

    // 로그인 성공 시, 사용자 정보 반환
    res.json({
      message: "Login successful",
      user: {
        id: user.Admin_ID,
        name: user.Admin_Name,
        email: user.Admin_Phone,
        phone: user.Admin_Email,
        pw: user.Admin_PW,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 로그인 API 추가
app.post("/login", async (req, res) => {
  const { id, pw } = req.body;

  if (!id || !pw) {
    return res.status(400).json({ message: "ID and Password are required" });
  }

  try {
    // members 테이블에서 해당 ID의 사용자 정보를 조회
    const query = `SELECT * FROM members WHERE Member_ID = ?`;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid ID or Password" });
    }

    const user = rows[0];

    // 비밀번호 비교 (입력된 비밀번호와 암호화된 비밀번호)
    const isMatch = await bcrypt.compare(pw, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid ID or Password" });
    }

    // 로그인 성공 시, 사용자 정보 반환
    res.json({
      message: "Login successful",
      user: {
        id: user.Member_ID,
        name: user.Member_Name,
        email: user.Member_Email,
        phone: user.Member_Phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 서버 (Express) - 회원가입 API
app.post("/signup", async (req, res) => {
  const { id, password, name, email, phone } = req.body;

  if (!id || !password || !name || !email) {
    return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
  }

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // members 테이블에 데이터 삽입
    const query = `
      INSERT INTO members (Member_ID, Password, Member_Name, Member_Email, Member_Phone)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [id, hashedPassword, name, email, phone]);

    // 성공적으로 회원가입 완료
    res.json({ success: true, message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// GET: 마이페이지에 회원 정보 출력
app.get("/members/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 Member_ID 추출
  try {
    const query = "SELECT * FROM members WHERE Member_ID = ?";
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send("Member not found");
    }

    res.json(rows[0]); // 해당 회원 정보 반환
  } catch (error) {
    console.error("Error fetching member data:", error);
    res.status(500).send("Server error");
  }
});

// 마이페이지에서 회원 정보 수정 API
app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const { Member_Name, Member_Phone, Member_Email, Password } = req.body;

  try {
    // 기존의 업데이트 필드 정의
    const updateFields = {
      Member_Name,
      Member_Phone,
      Member_Email,
    };

    // 비밀번호가 전달된 경우 새로 해시화
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      updateFields.Password = hashedPassword;
    }

    // 업데이트 SQL 실행
    const result = await db.query("UPDATE members SET ? WHERE Member_ID = ?", [
      updateFields,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "회원 정보가 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("Error updating member data:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 회원 삭제 API
app.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. editrequest 테이블의 ID와 연결된 모든 EditRequest_Num을 가져옴
    const [editRequestRows] = await db.query(
      "SELECT EditRequest_Num FROM editrequest WHERE Member_ID = ?",
      [id]
    );

    const editRequestIds = editRequestRows.map((row) => row.EditRequest_Num);

    if (editRequestIds.length > 0) {
      // 2. edithistory에서 EditRequest_Num에 해당하는 모든 데이터를 삭제
      await db.query("DELETE FROM edithistory WHERE EditRequest_Num IN (?)", [
        editRequestIds,
      ]);

      // 3. editrequest에서 Member_ID에 해당하는 데이터 삭제
      await db.query("DELETE FROM editrequest WHERE Member_ID = ?", [id]);
    }

    // 4. members 테이블에서 사용자 삭제
    const result = await db.query("DELETE FROM members WHERE Member_ID = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "회원 탈퇴가 성공적으로 처리되었습니다." });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// GET: 모든 회원 정보 가져오기 (비밀번호 제외)
app.get("/members", async (req, res) => {
  try {
    const query = `
      SELECT 
        Member_ID, 
        Member_Name, 
        Member_Phone, 
        Member_Email,
        Password 
      FROM members;
    `; // 비밀번호는 반환하지 않음
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).send("Server error");
  }
});

// POST: 새로운 회원 추가
app.post("/members", async (req, res) => {
  const { Member_Name, Member_Phone, Member_Email, Password } = req.body;

  try {
    // 유효성 검사
    if (!Member_Name || !Member_Phone || !Member_Email || !Password) {
      return res.status(400).send("All fields are required");
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(Password, 10);

    const query = `
      INSERT INTO members (Member_Name, Member_Phone, Member_Email, Password)
      VALUES (?, ?, ?, ?);
    `;
    const [result] = await db.query(query, [
      Member_Name,
      Member_Phone,
      Member_Email,
      hashedPassword,
    ]);

    res.status(201).send("Member added successfully");
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).send("Server error");
  }
});

// PUT: 회원 정보 수정 (비밀번호 포함 가능)
app.put("/members/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 Member_ID 추출
  const { Member_Name, Member_Phone, Member_Email, Password } = req.body;

  try {
    // 유효성 검사
    if (!Member_Name || !Member_Phone || !Member_Email) {
      return res.status(400).send("Name, phone, and email are required");
    }

    // 비밀번호 해싱 (비밀번호가 제공된 경우)
    let hashedPassword = null;
    if (Password) {
      hashedPassword = await bcrypt.hash(Password, 10);
    }

    const query = `
      UPDATE members
      SET 
        Member_Name = ?, 
        Member_Phone = ?, 
        Member_Email = ?${hashedPassword ? ", Password = ?" : ""}
      WHERE Member_ID = ?;
    `;
    const queryParams = [
      Member_Name,
      Member_Phone,
      Member_Email,
      ...(hashedPassword ? [hashedPassword] : []),
      id,
    ];

    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).send("Member not found");
    }

    res.status(200).send("Member updated successfully");
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).send("Server error");
  }
});

// DELETE: 회원 삭제
app.delete("/members/:id", async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 Member_ID 추출

  try {
    const query = "DELETE FROM members WHERE Member_ID = ?";
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Member not found");
    }

    res.status(200).send("Member deleted successfully");
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).send("Server error");
  }
});

// API: players 테이블 데이터 가져오기
app.get("/players", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM players");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).send("Server error");
  }
});

// API: 새로운 플레이어 추가
app.post("/players", async (req, res) => {
  const { Player_ID, Player_Name, Player_Team, Player_Num, Position_ID } =
    req.body;

  if (
    !Player_ID ||
    !Player_Name ||
    !Player_Team ||
    !Player_Num ||
    !Position_ID
  ) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Position_ID가 유효한지 확인
    const checkPositionQuery =
      "SELECT COUNT(*) AS count FROM position WHERE Position_ID = ?";
    const [checkPositionResult] = await db.query(checkPositionQuery, [
      Position_ID,
    ]);

    if (checkPositionResult[0].count === 0) {
      return res.status(400).send("Invalid Position_ID");
    }

    // 새로운 플레이어 추가
    const insertQuery = `
      INSERT INTO players (Player_ID, Player_Name, Player_Team, Player_Num, Position_ID)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(insertQuery, [
      Player_ID,
      Player_Name,
      Player_Team,
      Player_Num,
      Position_ID,
    ]);

    res.status(201).send("Player added successfully");
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).send("Server error");
  }
});

// API: 플레이어 정보 수정
app.put("/players/:id", async (req, res) => {
  const { id } = req.params;
  const { Player_Name, Player_Team, Player_Num, Position_ID } = req.body;

  try {
    // Position_ID가 유효한지 확인
    if (Position_ID) {
      const checkPositionQuery =
        "SELECT COUNT(*) AS count FROM position WHERE Position_ID = ?";
      const [checkPositionResult] = await db.query(checkPositionQuery, [
        Position_ID,
      ]);

      if (checkPositionResult[0].count === 0) {
        return res.status(400).send("Invalid Position_ID");
      }
    }

    // 플레이어 정보 수정
    const updateQuery = `
      UPDATE players
      SET Player_Name = ?, Player_Team = ?, Player_Num = ?, Position_ID = ?
      WHERE Player_ID = ?
    `;
    const [result] = await db.query(updateQuery, [
      Player_Name,
      Player_Team,
      Player_Num,
      Position_ID,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Player not found");
    }

    res.status(200).send("Player updated successfully");
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).send("Server error");
  }
});

// API: 플레이어 삭제
app.delete("/players/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM players WHERE Player_ID = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Player not found");
    }

    res.status(200).send("Player deleted successfully");
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).send("Server error");
  }
});

// API: players와 hitstat 테이블 데이터 가져오기
app.get("/players", async (req, res) => {
  const { team, position } = req.query;

  // 쿼리 파라미터 확인
  console.log("받은 쿼리 파라미터 - 팀:", team, "포지션:", position);

  const query = `
    SELECT 
        p.Player_ID, 
        p.Player_Name, 
        p.Player_Team, 
        p.Player_Num,
        p.Position_ID,
        h.Hit,
        h.Homerun,
        h.BattingAvh,
        h.Ops,
        h.Wrc,
        h.Hit_War,
        pit.Kbb,
        pit.DeAvg,
        pit.Era,
        pit.Whip,
        pit.PitchWar,
        pit.Inning,
        d.Raa,
        d.Error,
        d.DefenseInning,
        d.Pass,
        d.StealingBlockRate
    FROM 
        players p
    LEFT JOIN 
        hitstat h ON p.Player_ID = h.Player_ID
    LEFT JOIN
        pitchstat pit ON p.Player_ID = pit.Player_ID
    LEFT JOIN
        defensestat d ON p.Player_ID = d.Player_ID
  `;

  try {
    const [rows] = await db.query(query, [team, team, position, position]);
    console.log("쿼리 결과:", rows); // 쿼리 결과 확인
    res.json(rows);
  } catch (error) {
    console.error("선수 정보 조회 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// API: position 테이블 데이터 가져오기
app.get("/position", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM position");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).send("Server error");
  }
});

// API: 새로운 position 추가
app.post("/position", async (req, res) => {
  const { Position_ID, Position_Name } = req.body;

  // 필드 유효성 검사
  if (!Position_ID || !Position_Name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 데이터베이스 쿼리 실행
    const insertQuery = `
      INSERT INTO \`position\` (Position_ID, Position_Name)
      VALUES (?, ?)
    `;
    await db.query(insertQuery, [Position_ID, Position_Name]);

    res.status(201).json({ message: "Position added successfully" });
  } catch (error) {
    console.error("Error adding position:", error);

    // 데이터 중복 또는 기타 데이터베이스 관련 오류 처리
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Position_ID already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// API: position 정보 수정
app.put("/position/:id", async (req, res) => {
  const { id } = req.params;
  const { Position_Name } = req.body;

  if (!Position_Name) {
    return res.status(400).send("Position_Name is required");
  }

  try {
    const updateQuery = `
      UPDATE \`position\`
      SET Position_Name = ?
      WHERE Position_ID = ?
    `;
    const [result] = await db.query(updateQuery, [Position_Name, id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Position not found");
    }

    res.status(200).send("Position updated successfully");
  } catch (error) {
    console.error("Error updating position:", error);
    res.status(500).send("Server error");
  }
});

// API: position 삭제
app.delete("/position/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM position WHERE Position_ID = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Position not found");
    }

    res.status(200).send("Position deleted successfully");
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).send("Server error");
  }
});

// API: referees 테이블 데이터 가져오기
app.get("/referees", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM referees");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// API: referees 테이블에 데이터 추가 (POST)
app.post("/referees", async (req, res) => {
  const { Referee_ID, Referee_Name } = req.body;

  if (!Referee_ID || !Referee_Name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO referees (Referee_ID, Referee_Name)
      VALUES (?, ?)
    `;
    await db.query(insertQuery, [Referee_ID, Referee_Name]);

    res.status(201).json({ message: "Referee added successfully" });
  } catch (error) {
    console.error("Error adding referee:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Referee_ID already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// API: referees 테이블 데이터 수정 (PUT)
app.put("/referees/:id", async (req, res) => {
  const { id } = req.params;
  const { Referee_Name } = req.body;

  if (!Referee_Name) {
    return res.status(400).json({ error: "Referee_Name is required" });
  }

  try {
    const updateQuery = `
      UPDATE referees
      SET Referee_Name = ?
      WHERE Referee_ID = ?
    `;
    const [result] = await db.query(updateQuery, [Referee_Name, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Referee not found" });
    }

    res.status(200).json({ message: "Referee updated successfully" });
  } catch (error) {
    console.error("Error updating referee:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: referees 테이블 데이터 삭제 (DELETE)
app.delete("/referees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = `
      DELETE FROM referees
      WHERE Referee_ID = ?
    `;
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Referee not found" });
    }

    res.status(200).json({ message: "Referee deleted successfully" });
  } catch (error) {
    console.error("Error deleting referee:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: seasons 테이블 데이터 가져오기
app.get("/seasons", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM seasons");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// API: seasons 테이블 데이터 추가 (POST)
app.post("/seasons", async (req, res) => {
  const { Season, Team_ID, Player_ID } = req.body;

  if (!Season || !Team_ID || !Player_ID) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO seasons (Season, Team_ID, Player_ID)
      VALUES (?, ?, ?)
    `;
    await db.query(insertQuery, [Season, Team_ID, Player_ID]);

    res.status(201).json({ message: "Season record added successfully" });
  } catch (error) {
    console.error("Error adding season record:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ error: "Invalid Team_ID or Player_ID" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// API: seasons 테이블 데이터 수정 (PUT)
app.put("/seasons/:id", async (req, res) => {
  const { id } = req.params; // ID로 Season을 식별
  const { Team_ID, Player_ID } = req.body;

  if (!Team_ID && !Player_ID) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided to update" });
  }

  try {
    const updateQuery = `
      UPDATE seasons
      SET Team_ID = COALESCE(?, Team_ID), Player_ID = COALESCE(?, Player_ID)
      WHERE Season = ?
    `;
    const [result] = await db.query(updateQuery, [Team_ID, Player_ID, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Season record not found" });
    }

    res.status(200).json({ message: "Season record updated successfully" });
  } catch (error) {
    console.error("Error updating season record:", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ error: "Invalid Team_ID or Player_ID" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// API: seasons 테이블 데이터 삭제 (DELETE)
app.delete("/seasons/:id", async (req, res) => {
  const { id } = req.params; // ID로 Season을 식별

  try {
    const deleteQuery = `
      DELETE FROM seasons
      WHERE Season = ?
    `;
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Season record not found" });
    }

    res.status(200).json({ message: "Season record deleted successfully" });
  } catch (error) {
    console.error("Error deleting season record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: stadium 테이블 데이터 가져오기
app.get("/stadium", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM stadium");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// API: stadium 테이블 데이터 추가 (POST)
app.post("/stadium", async (req, res) => {
  const { Arena_Name, Arena_Region } = req.body;

  if (!Arena_Name || !Arena_Region) {
    return res
      .status(400)
      .json({ error: "Arena_Name and Arena_Region are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO stadium (Arena_Name, Arena_Region)
      VALUES (?, ?)
    `;
    await db.query(insertQuery, [Arena_Name, Arena_Region]);

    res.status(201).json({ message: "Stadium record added successfully" });
  } catch (error) {
    console.error("Error adding stadium record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: stadium 테이블 데이터 수정 (PUT)
app.put("/stadium/:id", async (req, res) => {
  const { id } = req.params; // Arena_Name으로 Stadium을 식별
  const { Arena_Region } = req.body;

  if (!Arena_Region) {
    return res
      .status(400)
      .json({ error: "Arena_Region is required to update" });
  }

  try {
    const updateQuery = `
      UPDATE stadium
      SET Arena_Region = ?
      WHERE Arena_Name = ?
    `;
    const [result] = await db.query(updateQuery, [Arena_Region, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stadium record not found" });
    }

    res.status(200).json({ message: "Stadium record updated successfully" });
  } catch (error) {
    console.error("Error updating stadium record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: stadium 테이블 데이터 삭제 (DELETE)
app.delete("/stadium/:id", async (req, res) => {
  const { id } = req.params; // Arena_Name으로 Stadium을 식별

  try {
    const deleteQuery = `
      DELETE FROM stadium
      WHERE Arena_Name = ?
    `;
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stadium record not found" });
    }

    res.status(200).json({ message: "Stadium record deleted successfully" });
  } catch (error) {
    console.error("Error deleting stadium record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: teamhistory 테이블 데이터 가져오기
app.get("/teamhistory", async (req, res) => {
  try {
    const query = `
      Select
        TeamHistory_ID,
        Team_ID,
        Player_ID,
        DATE_FORMAT(teamhistory.TeamHistory_Date, '%Y-%m-%d') AS TeamHistory_Date,
        BeforeTeam,
        AfterTeam
      FROM
        teamhistory
    `;
    const [rows] = await db.query(query);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// API: teamhistory 테이블 데이터 추가 (POST)
app.post("/teamhistory", async (req, res) => {
  const {
    TeamHistory_ID,
    Team_ID,
    Player_ID,
    TeamHistory_Date,
    BeforeTeam,
    AfterTeam,
  } = req.body;

  if (
    !TeamHistory_ID ||
    !Team_ID ||
    !Player_ID ||
    !TeamHistory_Date ||
    !BeforeTeam ||
    !AfterTeam
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO teamhistory (TeamHistory_ID, Team_ID, Player_ID, TeamHistory_Date, BeforeTeam, AfterTeam)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertQuery, [
      TeamHistory_ID,
      Team_ID,
      Player_ID,
      TeamHistory_Date,
      BeforeTeam,
      AfterTeam,
    ]);

    res.status(201).json({ message: "Team history record added successfully" });
  } catch (error) {
    console.error("Error adding team history record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: teamhistory 테이블 데이터 수정 (PUT)
app.put("/teamhistory/:id", async (req, res) => {
  const { id } = req.params; // TeamHistory_ID로 TeamHistory를 식별
  let { Team_ID, Player_ID, TeamHistory_Date, BeforeTeam, AfterTeam } =
    req.body;

  if (
    !Team_ID ||
    !Player_ID ||
    !TeamHistory_Date ||
    !BeforeTeam ||
    !AfterTeam
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 날짜 형식이 'YYYY-MM-DD'라면 'YYYY-MM-DD 00:00:00'으로 변환
  if (TeamHistory_Date && TeamHistory_Date.length === 10) {
    TeamHistory_Date += " 00:00:00"; // 날짜 뒤에 시간을 추가
  }

  try {
    const updateQuery = `
      UPDATE teamhistory
      SET Team_ID = ?, Player_ID = ?, TeamHistory_Date = ?, BeforeTeam = ?, AfterTeam = ?
      WHERE TeamHistory_ID = ?
    `;
    const [result] = await db.query(updateQuery, [
      Team_ID,
      Player_ID,
      TeamHistory_Date,
      BeforeTeam,
      AfterTeam,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Team history record not found" });
    }

    res
      .status(200)
      .json({ message: "Team history record updated successfully" });
  } catch (error) {
    console.error("Error updating team history record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: teamhistory 테이블 데이터 삭제 (DELETE)
app.delete("/teamhistory/:id", async (req, res) => {
  const { id } = req.params; // TeamHistory_ID로 TeamHistory를 식별

  try {
    const deleteQuery = `
      DELETE FROM teamhistory
      WHERE TeamHistory_ID = ?
    `;
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Team history record not found" });
    }

    res
      .status(200)
      .json({ message: "Team history record deleted successfully" });
  } catch (error) {
    console.error("Error deleting team history record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: teams와 stadium 테이블 데이터 조인
app.get("/teams-info", async (req, res) => {
  try {
    const query = `
      SELECT 
        t.Team_ID, 
        t.Team_Name, 
        t.Team_Award, 
        t.Team_Director, 
        s.Arena_Name 
      FROM 
        teams t
      LEFT JOIN 
        stadium s ON t.Arena_Name = s.Arena_Name;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching team info:", error);
    res.status(500).send("Server error");
  }
});

// API: teams 테이블 데이터 가져오기 (GET)
app.get("/teams", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// API: teams 테이블 데이터 추가 (POST)
app.post("/teams", async (req, res) => {
  const { Team_ID, Arena_Name, Team_Name, Team_Award, Team_Director } =
    req.body;

  if (!Team_ID || !Arena_Name || !Team_Name || !Team_Award || !Team_Director) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO teams (Team_ID, Arena_Name, Team_Name, Team_Award, Team_Director)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [
      Team_ID,
      Arena_Name,
      Team_Name,
      Team_Award,
      Team_Director,
    ]);

    res
      .status(201)
      .json({ message: "Team added successfully", Team_ID: result.insertId });
  } catch (error) {
    console.error("Error adding team:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: teams 테이블 데이터 수정 (PUT)
app.put("/teams/:id", async (req, res) => {
  const { id } = req.params; // Team_ID로 팀을 식별
  const { Arena_Name, Team_Name, Team_Award, Team_Director } = req.body;

  if (!Arena_Name || !Team_Name || !Team_Award || !Team_Director) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updateQuery = `
      UPDATE teams
      SET Arena_Name = ?, Team_Name = ?, Team_Award = ?, Team_Director = ?
      WHERE Team_ID = ?
    `;
    const [result] = await db.query(updateQuery, [
      Arena_Name,
      Team_Name,
      Team_Award,
      Team_Director,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ message: "Team updated successfully" });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API: teams 테이블 데이터 삭제 (DELETE)
app.delete("/teams/:id", async (req, res) => {
  const { id } = req.params; // Team_ID로 팀을 식별

  try {
    const deleteQuery = "DELETE FROM teams WHERE Team_ID = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
