import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditPage.css";

const Board = () => {
  const [content, setContent] = useState("");
  const [memberId, setMemberId] = useState(""); // 작성자 ID
  const [posts, setPosts] = useState([]); // 게시글 목록

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/edithistory");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching edit history:", error);
      }
    };
    fetchPosts();
  }, []); // 빈 배열로 한 번만 실행

  return (
    <div className="board-container">
      <div className="post-list">
        <h3>수정목록</h3>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.Edit_Num}>
                <h4>
                  {post.Edit_Num}. {post.Admin_ID}
                </h4>
                <p>{post.content}</p>
                <span>요청게시물번호: {post.EditRequest_Num}</span>
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
