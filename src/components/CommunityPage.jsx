import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import "./CommunityPage.scss";
import Dockbar from "./Dockbar";

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

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  // const [newPostTitle, setNewPostTitle] = useState("");
  // const [newPostContent, setNewPostContent] = useState("");
  // const [editingPostId, setEditingPostId] = useState(null);
  const [user, setUser] = useState(null); // 인증된 사용자 정보 저장
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 여부 확인
    const authService = getAuth();
    // console.log(authService.currentUser);

    // 게시물 불러오기
    const postsRef = firebase.database().ref("posts");
    postsRef.on("value", (snapshot) => {
      const postsData = snapshot.val();
      if (postsData) {
        const postsArray = Object.keys(postsData).map((key) => ({
          id: key,
          title: postsData[key].title,
          content: postsData[key].content,
          userId: postsData[key].userId, // 각 게시물의 작성자 정보 저장
        }));
        setPosts(postsArray);
      } else {
        setPosts([]);
      }
    });

    // 사용자 상태 변경 이벤트 리스너 추가
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const viewPostDetailHandler = (postId) => {
    navigate(`/community/postDetail/${postId}`);
  };

  const addPostClickHandler = () => {
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
    navigate("/community/addPost");
  };

  const deletePost = (postId) => {
    const post = posts.find((post) => post.id === postId);
    if (!user || !post || post.userId !== user.uid) return; // 사용자가 인증되지 않았거나 해당 게시물을 작성한 사용자가 아닌 경우
    const postRef = firebase.database().ref(`posts/${postId}`);

    const checkDeletePost = window.confirm("삭제하시겠습니까?");
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

  const handleEditClick = (postId) => {
    // 수정 페이지로 이동
    navigate(`/community/editPost/${postId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="align-center">
      <section className="CommunityPage">
        <div className="contents">
          <div className="nav-top"></div>
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="검색어를 입력하세요..."
              className="search-input"
            />
          </div>
          <button className="btn-float" onClick={addPostClickHandler}>
            <img src="/images/add-line.png" alt="" />
            글쓰기
          </button>
          <ul className="community-list">
            {filteredPosts.map((post) => (
              <li key={post.id} className="community-item">
                <h2 onClick={() => viewPostDetailHandler(post.id)}>
                  {post.title}
                </h2>
                <p onClick={() => viewPostDetailHandler(post.id)}>
                  {post.content}
                </p>
                {user && post.userId === user.uid && (
                  <div className="actions">
                    <button
                      onClick={() => handleEditClick(post.id)}
                      className="community-button edit"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="community-button delete"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Dockbar active="community" />
      </section>
    </div>
  );
}
