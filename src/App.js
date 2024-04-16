import React from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import "./index.scss";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import MainPage from "./components/MainPage";
import CommunityPage from "./components/CommunityPage";
import RankingPage from "./components/RankingPage";
import SettingsPage from "./components/SettingsPage";
import MySubscriptionPage from "./components/MySubscriptionPage";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging();

if (isSupported()) {
  // FCM(파이어베이스 클라우드 메시징)이 지원되지 않는 브라우저에서는 화면이 하얗게 뜨는 현상 방지
  getToken(messaging, {
    // 파이어베이스 웹 푸시 인증서 공개키
    vapidKey:
      "BK7Jyd1qE2DWQAygv_E6oHlyvFVJ1be_gtzZ2vRaCTb0oO_o6E5TgSBQSNQJC37AcHFygzDEEXrvuBIm-BiUnNA",
  })
    .then((currentToken) => {
      if (currentToken) {
        // console.log(currentToken);
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mySubscription" element={<MySubscriptionPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
