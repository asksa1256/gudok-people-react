import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddPostPage() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 사용자 정보 확인
    const user = getAuth().currentUser;
    setUser(user);
  }, []);

  const addPostHandler = () => {
    if (newPostTitle.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    } else if (newPostContent.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    const checkAddPost = window.confirm("게시글을 등록하시겠습니까?");
    if (!checkAddPost) return;

    const postsRef = firebase.database().ref("posts");
    const newPostKey = postsRef.push().key;
    const newPost = {
      id: newPostKey,
      title: newPostTitle,
      content: newPostContent,
      userId: user.uid, // 현재 사용자의 UID를 게시물에 저장
    };
    postsRef
      .child(newPostKey)
      .set(newPost)
      .then(() => {
        alert("게시물이 등록되었습니다.");
        navigate("/community");
      })
      .catch((error) => {
        console.error("게시물을 추가하는 동안 오류가 발생했습니다:", error);
      });
  };

  const cancelAddPostHandler = () => {
    const checkCancel = window.confirm("작성을 취소하시겠습니까?");
    if (checkCancel) {
      navigate("/community");
    } else {
      return;
    }
  };

  return (
    <div className="align-center">
      <section className="AddPostPage">
        <div className="contents">
          <div className="nav-top"></div>
          <header className="community-form-header">
            <button className="close-btn" onClick={cancelAddPostHandler}>
              <img src="/images/close.png" alt="작성 취소" />
            </button>
            <h6>글쓰기</h6>
            <button className="text-btn" onClick={addPostHandler}>
              완료
            </button>
          </header>
          <div className="community-form">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="community-input"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="구독 플랫폼 관련 내용을 자유롭게 남겨주세요"
              className="community-textarea"
            />
            {/* <button onClick={addPostHandler} className="community-button">
              게시
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
}
