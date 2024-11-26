import React, { useState } from "react";
import "./EditPage.css"; // 스타일을 적용하기 위한 CSS 파일

const Board = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [nextId, setNextId] = useState(1); // 게시물 번호를 관리

  const handlePostSubmit = () => {
    if (title && content) {
      setPosts([
        ...posts,
        {
          id: nextId, // 고유 번호 부여
          title: title,
          content: content,
          date: new Date().toLocaleString(),
        },
      ]);
      setNextId(nextId + 1); // 다음 게시물 번호를 위해 증가
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className="board-container">
      <div className="post-list">
        <h3>수정내역</h3>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <h4>
                  {post.id}. {post.title}
                </h4>{" "}
                {/* 게시물 번호 표시 */}
                <p>{post.content}</p>
                <span>{post.date}</span>
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
