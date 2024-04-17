// 라이브러리 불러오기
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const admin = require("firebase-admin");
const schedule = require("node-schedule");
const serviceAccount = require("./firebase-admin.json");

// node server.js
console.log("server is running...");

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// FCM 보내기 함수
function sendFCM() {
  const message = {
    notification: {
      title: "넷플릭스",
      body: "04-26에 5,500원이 자동 결제됩니다.",
    },
    // 푸시 알림 수신 대상 등 설정
    // token, topic 등
    // 예: token: '사용자 토큰'
    token:
      "fmWMB7RqVFprQYK62OniLD:APA91bED4_pZkHkBchfV1D3vFfR1oPlroz43fmD_GOjU8-bwIQsMwemXw1r-jbipycLe96nwbmwm5T2ivIiY4n-ymRP1XVjQdPayCR-soLYSwHv2FBDMV7y0ENhrHcehZ5eN2YFmq7B8",
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
}

// 서버에서 설정한 시간에 FCM 푸시 => 터미널에서 node server.js 로 서버 실행시키면 작동.
schedule.scheduleJob("19 18 * * *", function () {
  sendFCM();
});

// CORS 이슈 방지
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use(express.static(path.join(__dirname, "/build")));

// 메인페이지 접속 시 build 폴더의 index.html 전송
app.get("/", (res, req) => {
  req.sendFile(path.join(__dirname, "/build/index.html"));
});

app.get("*", (res, req) => {
  req.sendFile(path.join(__dirname, "/build/index.html"));
});
