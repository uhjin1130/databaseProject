import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RequestBoard.css";

const Board = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [memberId, setMemberId] = useState(""); // 작성자 ID

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/editrequest");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching edit requests:", error);
      }
    };
    fetchPosts();
  }, []);

  // 게시글 추가하기
  const handlePostSubmit = async () => {
    if (content && memberId) {
      try {
        const response = await axios.post("http://localhost:5000/editrequest", {
          memberId,
          content,
        });

        console.log("Response from server:", response.data);

        if (response.data.success) {
          setPosts([
            {
              EditRequest_Num: response.data.insertedId, // DB에서 생성된 ID
              Member_ID: memberId,
              Content: content,
            },
            ...posts, // 기존 게시글 유지
          ]);
          setContent("");
          setMemberId(""); // ID 초기화
        }
      } catch (error) {
        console.error("Error adding edit request:", error);
      }
    } else {
      console.warn("Content or Member ID is missing");
    }
  };

  return (
    <div className="board-container">
      <div className="post-form">
        <div className="input-group">
          <label htmlFor="memberId">작성자 ID</label>
          <input
            type="text"
            id="memberId"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>
        <button onClick={handlePostSubmit} className="submit-btn">
          등록
        </button>
      </div>

      <div className="post-list">
        <h3>요청목록</h3>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.EditRequest_Num}>
                <h4>
                  {post.EditRequest_Num}. {post.Member_ID}
                </h4>
                <p>{post.Content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Board;
