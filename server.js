/* node.js */
// 라이브러리 불러오기
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const schedule = require("node-schedule");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");
const { getFirestore } = require("firebase-admin/firestore");

// node server.js
console.log("server is running...");

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gudok-87985.firebaseio.com",
});

// Firestore DB 불러오기
const db = getFirestore();

// CORS 이슈 방지
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: ["https://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.static(path.join(__dirname, "/build")));

// 메인페이지 접속 시 build 폴더의 index.html 전송
app.get("/", (res, req) => {
  req.sendFile(path.join(__dirname, "/build/index.html"));
});

app.get("*", (res, req) => {
  req.sendFile(path.join(__dirname, "/build/index.html"));
});

// FCM 보내기 함수
function sendFCM() {
  // user 컬렉션의 전체 데이터 읽기
  db.collection("user")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        // user 컬렉션에서 토큰값 불러오기
        // console.log(doc.data().device_token);
        const message = {
          notification: {
            title: "넷플릭스", // doc.data().title
            body: "04-26에 5,500원이 자동 결제됩니다.", // doc.data().date, doc.data().price,
          },
          // 푸시 알림 수신 대상 등 설정
          // token, topic 등
          // 예: token: '사용자 토큰'
          token: doc.data().device_token,
        };

        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log("Successfully sent message:", response);
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
      });
    });
}

// 서버에서 설정한 시간에 FCM 푸시 => 터미널에서 node server.js 로 서버 실행시키면 작동.
schedule.scheduleJob("21 23 * * *", function () {
  sendFCM();
});
