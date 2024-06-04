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
const dns = require("node:dns");

// node server.js
console.log("server is running...");

dns.setDefaultResultOrder("ipv4first");

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gudok-87985.firebaseio.com",
});

// Firestore DB 불러오기
const db = getFirestore();

app.set("port", 3000);
app.listen(3000, function () {
  console.log("listening on 3000");
});

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

// 현재 날짜 구하는 함수
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 초기 날짜 설정
let currentDate = getCurrentDate();
let currentMonth = currentDate.slice(5, 7);

// 자정을 계산하는 함수
function getNextMidnight() {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // 다음 날
    0,
    0,
    0,
    0 // 00:00:00.000
  );
  return nextMidnight;
}

// 자정에 날짜를 갱신하는 함수
function scheduleMidnightUpdate() {
  const now = new Date();
  const nextMidnight = getNextMidnight();
  const timeUntilMidnight = nextMidnight - now;

  setTimeout(() => {
    currentDate = getCurrentDate();
    currentMonth = currentDate.slice(5, 7);

    // 자정 갱신 후 매일 24시간마다 갱신
    setInterval(() => {
      currentDate = getCurrentDate();
      currentMonth = currentDate.slice(5, 7);
      console.log(`Updated current date: ${currentDate}`);
    }, 24 * 60 * 60 * 1000); // 24시간 후
  }, timeUntilMidnight);
}
scheduleMidnightUpdate();

let addedHour, addedMin;

// FCM 보내기 함수
async function sendFCM() {
  // user 컬렉션의 전체 데이터 읽기
  const collectionRef = db.collection("user");

  // 파이어스토어 데이터 업데이트 실시간 체크
  collectionRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const newDocRef = change.doc.ref;
        const subCollectionRef = newDocRef.collection("subscriptions");

        subCollectionRef.onSnapshot((subSnapshot) => {
          subSnapshot.docChanges().forEach((subChange) => {
            const message = {
              notification: {
                title: `${subChange.doc.data().title}`,
                body: `${subChange.doc.data().payDate}일에 ${subChange.doc
                  .data()
                  .price.toLocaleString("ko-KR")}원이 자동 결제됩니다.`,
              },
              // 푸시 알림 수신 대상 등 설정
              token: subChange.doc.data().token,
            };

            // 저장된 구독 정보의 payDate 기반 사전알림 날짜 변수 설정
            const payMonthStr = subChange.doc.data().payDate.slice(5, 7);
            const payDateNum =
              subChange.doc.data().payDate.slice(8) * 1 - 3 <= 0
                ? subChange.doc.data().payDate.slice(8) * 1 - 3 + 30
                : subChange.doc.data().payDate.slice(8) * 1 - 3; // 3일 전에 전송

            if (!subChange.doc.data().addDate) return;
            addedHour = subChange.doc.data().addDate.slice(-8, -6) * 1;
            addedMin = subChange.doc.data().addDate.slice(-5, -3) * 1;

            // 이번 달에 해당될 경우에만 알림 전송
            if (currentMonth === payMonthStr) {
              schedule.scheduleJob(
                `${addedMin + 1} ${addedHour} ${payDateNum} * *`,
                function () {
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
              );
            }
          });
        });
      }
    });
  });
}

sendFCM();

// 다음달 날짜를 구하는 함수
function getNextMonthDate(dateStr) {
  let parts = dateStr.split("-");
  let year = parts[0];
  let month = parseInt(parts[1], 10);
  let day = parts[2];

  month += 1;

  // 월이 13이 되면 연도에 1을 더하고 월을 1로 설정
  if (month > 12) {
    month = 1;
    year = parseInt(year, 10) + 1;
  }

  // 월이 한 자리 숫자인 경우 두 자리로 변환
  let newMonth = month < 10 ? "0" + month : month.toString();

  return `${year}-${newMonth}-${day}`;
}

// payDate 갱신 함수
async function updatePayDate() {
  const collectionRef = db.collection("user");

  collectionRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const newDocRef = change.doc.ref;
        const subCollectionRef = newDocRef.collection("subscriptions");

        subCollectionRef.onSnapshot((subSnapshot) => {
          subSnapshot.docChanges().forEach((subChange) => {
            // payDate가 currentDate보다 작을 경우 payDate 갱신
            if (currentDate > subChange.doc.data().payDate) {
              let updatedMonthPayDate = getNextMonthDate(
                subChange.doc.data().payDate
              );

              subChange.doc.ref
                .update({ payDate: updatedMonthPayDate })
                .then(() => {
                  // console.log(`updated to completed: ${updatedMonthPayDate}`);
                })
                .catch((error) => {
                  console.error(`Error updating document: `, error);
                });
            }
          });
        });
      }
    });
  });
}

updatePayDate();

app.use(express.static(path.join(__dirname, "build")));

// 메인페이지 접속 시 build 폴더의 index.html 전송
app.get("/", (res, req) => {
  req.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("*", (res, req) => {
  req.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
