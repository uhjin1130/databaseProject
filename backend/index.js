const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcrypt");

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

// API: edithistory 테이블 데이터 가져오기
app.get("/edithistory", async (req, res) => {
  try {
    const query = `
      SELECT 
        Edit_Num AS id, 
        Admin_ID AS Adminid, 
        EditRequest_Num RequestID,
        content AS content
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

// API: editrequest 테이블 데이터 가져오기
app.get("/editrequest", async (req, res) => {
  try {
    const query = `
      SELECT 
        EditRequest_Num AS id, 
        Member_ID AS memberId, 
        Content AS content 
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
          DATE_FORMAT(g.GAME_DATE, '%Y-%m') AS month, 
          DATE_FORMAT(g.GAME_DATE, '%Y-%m-%d') AS date,
          g.Victory_Team, 
          g.Defeat_Team, 
          g.Victory_Score, 
          g.Defeat_Score, 
          r.Referee_Name,
          s.Arena_Name,
          g.Victory_Pitcher, 
          g.Victory_Hitter,
          g.Season
      FROM 
          gamerecords g
      LEFT JOIN 
          referees r ON g.Referee_ID = r.Referee_ID
      LEFT JOIN 
          stadium s ON g.Arena_Name = s.Arena_Name
      ORDER BY 
          g.GAME_DATE DESC;
    `;

    const [rows] = await db.query(query);

    // 월별 및 날짜별로 데이터를 그룹화
    const monthlyRecords = rows.reduce((acc, row) => {
      const {
        month,
        date,
        Victory_Team,
        Defeat_Team,
        Victory_Score,
        Defeat_Score,
        Referee_Name,
        Arena_Name,
        Victory_Pitcher,
        Victory_Hitter,
      } = row;

      if (!acc[month]) {
        acc[month] = {};
      }

      if (!acc[month][date]) {
        acc[month][date] = [];
      }

      acc[month][date].push({
        Victory_Team,
        Defeat_Team,
        Victory_Score,
        Defeat_Score,
        Referee_Name,
        Arena_Name,
        Victory_Pitcher,
        Victory_Hitter,
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
    const [rows] = await db.query("SELECT * FROM gamescheduel");

    // Game_Date를 ISO 형식으로 변환
    const formattedRows = rows.map((row) => ({
      ...row,
      Game_Date: new Date(row.Game_Date).toISOString(), // ISO 8601 형식으로 변환
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error(error);
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

// API: players와 hitstat 테이블 데이터 가져오기 (수정된 부분)
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
    console.error(error);
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

// API: teamhistory 테이블 데이터 가져오기
app.get("/teamhistory", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teamhistory");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
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

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
