import React, { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import "./App.scss";
import "./index.scss";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import MainPage from "./components/MainPage";
import CommunityPage from "./components/CommunityPage";
import RankingPage from "./components/RankingPage";
import SettingsPage from "./components/SettingsPage";
import AddPostPage from "./components/AddPostPage";
import EditPostPage from "./components/EditPostPage";
import PostDetailPage from "./components/PostDetailPage";
import isIphone from "./isIphone";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging();

export const AppContext = createContext();

function App() {
  const [deviceToken, setDeviceToken] = useState("");

  function requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BK7Jyd1qE2DWQAygv_E6oHlyvFVJ1be_gtzZ2vRaCTb0oO_o6E5TgSBQSNQJC37AcHFygzDEEXrvuBIm-BiUnNA",
        }).then((currentToken) => {
          setDeviceToken(currentToken);
        });
      } else {
        alert(
          "알림 거부 시 자동결제 사전 알림을 받을 수 없으므로 알림 허용을 권장합니다."
        );
      }
    });
  }

  useEffect(() => {
    if (isSupported()) {
      // FCM(파이어베이스 클라우드 메시징)이 지원되지 않는 브라우저에서는 화면이 하얗게 뜨는 현상 방지
      if (isIphone()) return;
      getToken(messaging, {
        vapidKey:
          "BK7Jyd1qE2DWQAygv_E6oHlyvFVJ1be_gtzZ2vRaCTb0oO_o6E5TgSBQSNQJC37AcHFygzDEEXrvuBIm-BiUnNA",
      })
        .then((currentToken) => {
          if (currentToken) {
            // console.log(currentToken);
            setDeviceToken(currentToken);
          } else {
            requestPermission();
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    }
  }, []);

  return (
    <AppContext.Provider value={deviceToken}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route
            path="/community/postDetail/:postId"
            element={<PostDetailPage />}
          />
          <Route path="/community/addPost" element={<AddPostPage />} />
          <Route
            path="/community/editPost/:postId"
            element={<EditPostPage />}
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
