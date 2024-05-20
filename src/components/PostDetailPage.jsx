import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "../App.scss";
import "./PostDetailPage.scss";

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

export default function PostDetailPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // 인증된 사용자 정보 저장
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postUserId, setPostUserId] = useState(null);

  useEffect(() => {
    // 현재 사용자 정보 확인
    const user = getAuth().currentUser;
    setUser(user);

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
        setPostUserId(postData.userId);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [postId]);

  const updatePostHandler = () => {
    navigate(`/community/editPost/${postId}`);
  };

  const deletePost = (postId) => {
    const postRef = firebase.database().ref(`posts/${postId}`);

    const checkDeletePost = window.confirm("삭제 하시겠습니까?");
    if (!checkDeletePost) return;
    postRef
      .remove()
      .then(() => {
        console.log("게시물이 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("게시물을 삭제하는 동안 오류가 발생했습니다:", error);
      });
  };

  const closeViewDetailHandler = () => {
    navigate("/community");
  };

  return (
    <div className="align-center">
      <section className="PostDetailPage">
        <div className="contents">
          <div className="nav-top"></div>
          <header className="contents-header">
            <button
              className="close-btn"
              onClick={() => closeViewDetailHandler}
            >
              <img src="/images/close.png" alt="뒤로가기" />
            </button>
            {user && postUserId === user.uid && (
              <div className="actions">
                <button className="text-btn" onClick={() => updatePostHandler}>
                  수정
                </button>
                <button onClick={() => deletePost(postId)} className="text-btn">
                  삭제
                </button>
              </div>
            )}
          </header>
          <div className="post-detail">
            <h3>{title}</h3>
            <p>{content}</p>
          </div>
          {/* 댓글 영역 추가 */}
        </div>
      </section>
    </div>
  );
}
