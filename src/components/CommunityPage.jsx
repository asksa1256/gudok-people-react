import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth"; // Firebase Authentication 추가
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
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [user, setUser] = useState(null); // 인증된 사용자 정보 저장
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 여부 확인
    const authService = getAuth();
    console.log(authService.currentUser);

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
    navigate("/addPost");
  };

  // const addPost = () => {
  //   if (!user) {
  //     // 사용자가 인증되지 않은 경우
  //     const loginRequired = window.confirm(
  //       "로그인이 필요합니다. 확인을 누르면 로그인으로 이동합니다."
  //     );
  //     if (loginRequired) {
  //       navigate("/");
  //     }
  //     return;
  //   } else if (newPostTitle.trim() === "") {
  //     alert("제목을 입력해주세요.");
  //     return;
  //   } else if (newPostContent.trim() === "") {
  //     alert("내용을 입력해주세요.");
  //     return;
  //   }
  //   const postsRef = firebase.database().ref("posts");
  //   const newPostKey = postsRef.push().key;
  //   const newPost = {
  //     id: newPostKey,
  //     title: newPostTitle,
  //     content: newPostContent,
  //     userId: user.uid, // 현재 사용자의 UID를 게시물에 저장
  //   };
  //   postsRef
  //     .child(newPostKey)
  //     .set(newPost)
  //     .then(() => {
  //       alert("게시물이 등록되었습니다.");
  //       setNewPostTitle("");
  //       setNewPostContent("");
  //     })
  //     .catch((error) => {
  //       console.error("게시물을 추가하는 동안 오류가 발생했습니다:", error);
  //     });
  // };

  const deletePost = (postId) => {
    const post = posts.find((post) => post.id === postId);
    if (!user || !post || post.userId !== user.uid) return; // 사용자가 인증되지 않았거나 해당 게시물을 작성한 사용자가 아닌 경우
    const postRef = firebase.database().ref(`posts/${postId}`);
    postRef
      .remove()
      .then(() => {
        console.log("게시물이 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("게시물을 삭제하는 동안 오류가 발생했습니다:", error);
      });
  };

  const updatePost = (postId, updatedPost) => {
    const post = posts.find((post) => post.id === postId);
    if (!user || !post || post.userId !== user.uid) return; // 사용자가 인증되지 않았거나 해당 게시물을 작성한 사용자가 아닌 경우
    const postRef = firebase.database().ref(`posts/${postId}`);
    postRef
      .update(updatedPost)
      .then(() => {
        console.log("게시물이 수정되었습니다.");
        setEditingPostId(null);
      })
      .catch((error) => {
        console.error("게시물을 수정하는 동안 오류가 발생했습니다:", error);
      });
  };

  const handleEditClick = (postId, postTitle, postContent) => {
    setEditingPostId(postId);
    setNewPostTitle(postTitle);
    setNewPostContent(postContent);
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
          {/* <div className="community-form">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="제목을 입력하세요..."
              className="community-input"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="새로운 글을 작성하세요..."
              className="community-textarea"
            />
            <button onClick={addPost} className="community-button">
              게시
            </button>
          </div> */}
          <button className="btn-float" onClick={addPostClickHandler}>
            <img src="/images/add-line.png" alt="" />
            글쓰기
          </button>
          <ul className="community-list">
            {filteredPosts.map((post) => (
              <li key={post.id} className="community-item">
                <h2>{post.title}</h2>
                {editingPostId === post.id ? (
                  <div>
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="community-input"
                    />
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="community-textarea"
                    />
                    <button
                      onClick={() =>
                        updatePost(post.id, {
                          title: newPostTitle,
                          content: newPostContent,
                        })
                      }
                      className="community-button"
                    >
                      수정 완료
                    </button>
                  </div>
                ) : (
                  <p>{post.content}</p>
                )}
                {user && post.userId === user.uid && (
                  <div className="actions">
                    <button
                      onClick={() =>
                        handleEditClick(post.id, post.title, post.content)
                      }
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
