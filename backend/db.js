const mysql = require("mysql2");

// MySQL 연결 설정
const pool = mysql.createPool({
  host: "localhost", // 데이터베이스 호스트 (예: AWS RDS 주소)
  user: "root", // 사용자 이름
  password: "1234", // 비밀번호
  database: "baseball", // 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,
});

// 내보내기
module.exports = pool.promise();
