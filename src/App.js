import React from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWp9u4dLqN9Oio8YfeC-B_zHtETHAeZa0",
  authDomain: "web-push-test-c56fc.firebaseapp.com",
  projectId: "web-push-test-c56fc",
  storageBucket: "web-push-test-c56fc.appspot.com",
  messagingSenderId: "653933743334",
  appId: "1:653933743334:web:7b4a107f0a1ea9ffe5bf27",
};

const app = initializeApp(firebaseConfig);
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();

if (isSupported()) {
  // FCM(파이어베이스 클라우드 메시징)이 지원되지 않는 브라우저에서는 화면이 하얗게 뜨는 현상 방지
  getToken(messaging, {
    vapidKey:
      "BBaLpyvKI38l9yuKgDVHrcvpLn6KOcAIgfY2lhSumDZ7CrWBODy7eeU2obSk49IB5K0i26dVhqbLvM1Mp9FpAC8",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
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
      <div className="content">
        <LoginPage />
      </div>
    </div>
  );
}

export default App;
