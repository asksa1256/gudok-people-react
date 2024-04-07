importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js"
);

const firebase_config = {
  apiKey: "AIzaSyBWp9u4dLqN9Oio8YfeC-B_zHtETHAeZa0",
  projectId: "web-push-test-c56fc",
  messagingSenderId: "653933743334",
  appId: "1:653933743334:web:7b4a107f0a1ea9ffe5bf27",
};
firebase.initializeApp(firebase_config);
const messaging = firebase.messaging();

self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  console.log("push: ", e.data.json());
  if (!e.data.json()) return;

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
    icon: resultData.image,
    tag: resultData.tag,
    ...resultData,
  };
  console.log("push: ", { resultData, notificationTitle, notificationOptions });

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  const url = "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url)); // 알림 클릭 시 웹으로 이동 (localhost 또는 HTTPS 환경에서만 작동. HTTP는 안됨)
});

messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    // icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
