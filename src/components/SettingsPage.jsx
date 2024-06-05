import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import Dockbar from "./Dockbar";
import "./SettingsPage.scss";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENSOR_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

// const messaging = getMessaging();
let messaging;
if (document.location.protocol === "https:") {
  messaging = getMessaging();
}
const db = firebase.firestore();

export default function SettingsPage() {
  const [user, setUser] = useState(null); // 인증된 사용자 정보 저장
  const [pushPermitted, setPushPermitted] = useState(null);
  const deviceToken = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 여부 확인
    const authService = getAuth();
    setUser(authService.currentUser);

    deviceToken ? setPushPermitted(true) : setPushPermitted(false);

    // 사용자 상태 변경 이벤트 리스너 추가
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [deviceToken]);

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

  const requestPermission = async () => {
    const snapshot = await db
      .collection("user")
      .where("email", "==", user.email)
      .get();
    const doc = snapshot.docs[0];

    // 브라우저가 Notification API를 지원하는지 확인
    if (!("Notification" in window)) {
      console.log("Notification API를 지원하지 않는 브라우저입니다.");
      return;
    }

    // 이미 권한이 부여되어 있는지 확인
    if (Notification.permission === "granted") {
      alert("이미 알림 권한이 부여되었습니다.");
      return;
    }

    // 권한 요청
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BK7Jyd1qE2DWQAygv_E6oHlyvFVJ1be_gtzZ2vRaCTb0oO_o6E5TgSBQSNQJC37AcHFygzDEEXrvuBIm-BiUnNA",
        }).then((currentToken) => {
          try {
            const docRef = db.collection("user").doc(doc.id);
            docRef.update({
              token: currentToken,
            });
            docRef
              .collection("subscriptions")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  // 각 문서의 'token' 필드값 갱신
                  docRef
                    .collection("subscriptions")
                    .doc(doc.id)
                    .update({
                      token: currentToken,
                    })
                    .then(() => {
                      // console.log("Document successfully updated!");
                    })
                    .catch((error) => {
                      console.error("Error updating document: ", error);
                    });
                });
              });
          } catch (error) {
            console.error("Error updating document field: ", error);
          }
        });
        console.log("알림 권한이 부여되었습니다.");
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    });
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
          <div className="sub-title">알림 설정</div>
          <dl className="contents-dl">
            <dd>
              {pushPermitted
                ? "알림 활성화 상태입니다."
                : "알림 비활성화 상태입니다."}
            </dd>
            {!pushPermitted && (
              <dt>
                <button className="text-btn" onClick={requestPermission}>
                  알림 허용하기
                </button>
              </dt>
            )}
          </dl>
        </div>
        <Dockbar active="settings" />
      </section>
    </div>
  );
}
