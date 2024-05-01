import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "./CommunityPage.scss";

const firebaseConfig = {
  apiKey: "AIzaSyDJIKpp9yOyKk46wKRmFzVhXn3LD6TpipY",
  authDomain: "gudok-87985.firebaseapp.com",
  databaseURL:
    "https://gudok-87985-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gudok-87985",
  storageBucket: "gudok-87985.appspot.com",
  messagingSenderId: "359891219478",
  appId: "1:359891219478:web:25b97dd447f5379f9b3137",
  measurementId: "G-BE9K8XNCTR",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function EditPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // 현재 사용자 정보 확인
    const user = getAuth().currentUser;
    if (!user) {
      // 사용자가 인증되지 않은 경우
      const loginRequired = window.confirm(
        "로그인이 필요합니다. 확인을 누르면 로그인으로 이동합니다."
      );
      if (loginRequired) {
        navigate("/");
      }
      return;
    }

    // 게시글 데이터 가져오기
    const fetchPost = async () => {
      try {
        const postSnapshot = await firebase
          .database()
          .ref(`posts/${postId}`)
          .once("value");
        const postData = postSnapshot.val();
        setTitle(postData.title);
        setContent(postData.content);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleUpdatePost = async () => {
    try {
      // Firebase 데이터베이스에 게시글 업데이트
      await firebase.database().ref(`posts/${postId}`).update({
        title,
        content,
      });
      alert("게시글이 수정되었습니다.");
      navigate("/community");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const cancelEditPostHandler = () => {
    navigate("/community");
  };

  return (
    <div className="align-center">
      <section className="EditPostPage">
        <div className="contents">
          <div className="nav-top"></div>
          <header className="contents-header">
            <button className="close-btn" onClick={cancelEditPostHandler}>
              <img src="/images/close.png" alt="수정 취소" />
            </button>
            <h6>글쓰기</h6>
            <button className="text-btn" onClick={handleUpdatePost}>
              완료
            </button>
          </header>
          <div className="community-form">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="community-input"
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              className="community-textarea"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
