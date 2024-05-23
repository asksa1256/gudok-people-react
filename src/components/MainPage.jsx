import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import "./MainPage.scss";
import SubscriptionItem from "./SubscriptionItem";
import AddSubscrModal from "./AddSubscrModal";
import Dockbar from "./Dockbar";

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

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 현재 사용자 정보 확인
const currentUser = getAuth().currentUser;

export default function MainPage(props) {
  const [showModal, setShowModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [docId, setDocId] = useState(null);

  // 구독 정보 불러오기
  const fetchData = () => {
    // 로그인 했을 때만 조회 가능
    if (currentUser) {
      firebase.auth().onAuthStateChanged(async (user) => {
        try {
          const snapshot = await db
            .collection("user")
            .where("email", "==", user.email)
            .get();
          const doc = snapshot.docs[0]; // 해당 계정의 docId값
          setDocId(doc.id);

          const subCollectionSnapshot = await db
            .collection("user")
            .doc(doc.id)
            .collection("subscriptions")
            .get();

          const data = subCollectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSubscriptionData(data);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // db에 새 구독 정보 추가
  const onUpdateData = async (newData) => {
    try {
      await db
        .collection("user")
        .doc(docId)
        .collection("subscriptions")
        .add(newData); // 새로 추가할 데이터
      alert("추가되었습니다.");

      // 추가 후 리스트 새로고침
      fetchData();
    } catch (error) {
      console.error("컬렉션 추가 중 오류 발생:", error);
    }
  };

  const showAddSubscrModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="align-center">
      <section className="MainPage">
        <AddSubscrModal
          open={showModal}
          close={closeModal}
          modalTitle={"새 구독 추가"}
          updateData={onUpdateData}
        />
        <div className="contents">
          <div className="nav-top"></div>
          <figure className="logo">
            <img src="/images/logo.svg" alt="구독의 민족" />
          </figure>
          <div className="box">
            <div className="box-title-wrap">
              <h5 className="box-title">이번달 총 구독료</h5>
            </div>
            <div className="total-price-wrap">
              <span className="price">47,900</span>
              <span className="won">원</span>
            </div>
          </div>
          <div className="box">
            <div className="box-title-wrap">
              <h5 className="box-title">내 구독 리스트</h5>
              <button
                type="button"
                className="text-btn text-btn-primary"
                onClick={showAddSubscrModal}
              >
                + 추가하기
              </button>
            </div>
            <ul className="subscr-list">
              {currentUser ? (
                subscriptionData.map((data) => (
                  <SubscriptionItem
                    key={data.id}
                    title={data.title}
                    price={data.price}
                    payDate={data.payDate}
                    sharing={data.sharing}
                    free={data.free}
                  />
                ))
              ) : (
                <li className="warning">
                  로그인이 필요합니다.
                  <button className="text-btn">
                    <Link to="/">로그인</Link>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <Dockbar active="main" />
      </section>
    </div>
  );
}
