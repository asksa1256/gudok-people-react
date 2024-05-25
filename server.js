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
async function sendFCM() {
  // user 컬렉션의 전체 데이터 읽기
  const collectionRef = db.collection("user");
  const snapshot = await collectionRef.get();

  const docs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  //하위 컬렉션의 전체 데이터 읽기
  if (docs.length > 0) {
    const subCollectionsDataPromises = docs.map(async (doc) => {
      const subCollectionRef = collectionRef
        .doc(doc.id)
        .collection("subscriptions");
      const subCollectionSnapshot = await subCollectionRef.get();

      const subDocs = subCollectionSnapshot.docs.map((subDoc) => ({
        id: subDoc.id,
        ...subDoc.data(),
      }));

      return { [doc.id]: subDocs };
    });

    const subCollectionsDataArray = await Promise.all(
      subCollectionsDataPromises
    );

    const subCollectionsDataObject = subCollectionsDataArray.reduce(
      (acc, subCollection) => {
        return { ...acc, ...subCollection };
      },
      {}
    );

    // 각 user의 subscriptions 컬렉션에 저장된 구독 정보 데이터 읽기
    for (const key in subCollectionsDataObject) {
      const dataArray = subCollectionsDataObject[key];
      dataArray.forEach((item) => {
        const message = {
          notification: {
            title: `${item.title}`,
            body: `${item.payDate}에 ${item.price}원이 자동 결제됩니다.`,
          },
          // 푸시 알림 수신 대상 등 설정
          token: item.token,
        };

        // 저장된 구독 정보의 payDate 기반 웹 푸시 알림 전송
        const payDateToNum =
          item.payDate.slice(8) * 1 - 3 <= 0
            ? item.payDate.slice(8) * 1 - 3 + 30
            : item.payDate.slice(8) * 1 - 3; // 3일 전에 전송

        schedule.scheduleJob(`45 23 ${payDateToNum} * *`, function () {
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
  }
}

sendFCM();
