import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import Dockbar from "./Dockbar";
import "./SettingsPage.scss";

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

firebase.initializeApp(firebaseConfig);

export default function SettingsPage() {
  const [user, setUser] = useState(null); // 인증된 사용자 정보 저장
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 여부 확인
    const authService = getAuth();
    setUser(authService.currentUser);

    // 사용자 상태 변경 이벤트 리스너 추가
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const signInOutHandler = () => {
    if (user) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("로그아웃 되었습니다.");
        })
        .catch((error) => {
          console.error("로그아웃 중 오류 발생:", error);
        });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="align-center">
      <section className="SettingsPage">
        <div className="contents">
          <div className="nav-top"></div>
          <header className="contents-header">
            <h6>설정</h6>
          </header>
          <div className="sub-title">계정 정보</div>
          <dl className="contents-dl">
            <dt>아이디</dt>
            <dd>{user ? user.email : "비회원으로 접속중입니다."}</dd>
            <dt>
              <button className="text-btn" onClick={signInOutHandler}>
                {user ? "로그아웃" : "로그인"}
              </button>
            </dt>
          </dl>
        </div>
        <Dockbar active="settings" />
      </section>
    </div>
  );
}
