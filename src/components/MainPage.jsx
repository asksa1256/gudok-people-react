import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import "firebase/compat/messaging";
import "./MainPage.scss";
import SubscriptionItem from "./SubscriptionItem";
import AddSubscrModal from "./AddSubscrModal";
import UpdateSubscrModal from "./UpdateSubscrModal";
import Dockbar from "./Dockbar";
import { update } from "firebase/database";

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
const messaging = getMessaging();
const firestore = firebase.firestore();

export default function MainPage(props) {
  const [showModal, setShowModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [docId, setDocId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [targetData, setTargetData] = useState({});

  // 구독 정보 불러오기
  const fetchData = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      try {
        const snapshot = await db
          .collection("user")
          .where("email", "==", user.email)
          .get();
        const doc = snapshot.docs[0]; // 해당 계정의 docId값
        setDocId(doc.id);

        // 로그인 할 때마다 토큰 갱신 처리
        getToken(messaging, {
          vapidKey:
            "BK7Jyd1qE2DWQAygv_E6oHlyvFVJ1be_gtzZ2vRaCTb0oO_o6E5TgSBQSNQJC37AcHFygzDEEXrvuBIm-BiUnNA",
        })
          .then((refreshedToken) => {
            // 서버에 있던 기존 토큰 갱신
            try {
              // console.log("refreshedToken: " + refreshedToken);
              const docRef = firestore.collection("user").doc(doc.id);
              docRef.update({
                token: refreshedToken,
              });

              // 'users' 하위 컬렉션 'subscriptions'의 모든 데이터 조회
              docRef
                .collection("subscriptions")
                .get()
                .then((querySnapshot) => {
                  let totalPrice = 0;
                  querySnapshot.forEach((doc) => {
                    // 각 문서의 'token' 필드값 갱신
                    docRef
                      .collection("subscriptions")
                      .doc(doc.id)
                      .update({
                        token: refreshedToken,
                      })
                      .then(() => {
                        // console.log("Document successfully updated!");
                      })
                      .catch((error) => {
                        console.error("Error updating document: ", error);
                      });

                    // 총 구독료 계산
                    totalPrice += doc.data().price;
                    setTotalPrice(totalPrice);
                  });
                });
            } catch (error) {
              console.error("Error updating document field: ", error);
            }
          })
          .catch((error) => {
            console.error("FCM 토큰 갱신 중 오류 발생:", error);
          });

        // 구독 정보 조회
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
  };

  useEffect(() => {
    const user = getAuth().currentUser;
    setCurrentUser(user);
    fetchData();
  }, []);

  // db에 새 구독 정보 추가
  const onAddData = async (newData) => {
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

  // db에 구독 정보 업데이트
  const onUpdateData = async (updateData) => {
    try {
      const targetId = updateData.id;
      const docRef = firestore.collection("user").doc(docId);

      docRef
        .collection("subscriptions")
        .get()
        .then((querySnapshot) => {
          let totalPrice = 0;
          docRef
            .collection("subscriptions")
            .doc(targetId)
            .update(updateData)
            .then(() => {
              // console.log("Document successfully updated!");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });

          // 총 구독료 갱신
          querySnapshot.forEach((doc) => {
            totalPrice += doc.data().price;
            setTotalPrice(totalPrice);
          });
        });

      alert("수정되었습니다.");

      // 수정 후 리스트 새로고침
      fetchData();
    } catch (error) {
      console.error("컬렉션 추가 중 오류 발생:", error);
    }
  };

  const showAddSubscrModal = () => {
    setShowModal("Add");
  };

  const showModifyModal = (targetData) => {
    setShowModal("Modify");
    setTargetData(targetData);
  };

  const deleteItemHandler = () => {
    alert("삭제하시겠습니까?");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="align-center">
      <section className="MainPage">
        <AddSubscrModal
          open={showModal === "Add"}
          close={closeModal}
          modalTitle={"새 구독 추가"}
          updateData={onAddData}
        />
        <UpdateSubscrModal
          open={showModal === "Modify"}
          close={closeModal}
          modalTitle={"구독 정보 수정"}
          updateData={onUpdateData}
          id={targetData.id}
          title={targetData.title}
          price={targetData.price}
          payDate={targetData.payDate}
          free={targetData.free}
          sharing={targetData.sharing}
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
              <span className="price">
                {totalPrice.toLocaleString("ko-KR")}
              </span>
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
              {subscriptionData.map((data) => (
                <SubscriptionItem
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  price={data.price}
                  payDate={data.payDate}
                  sharing={data.sharing}
                  free={data.free}
                  imgUrl={data.imgUrl}
                  showModifyModal={showModifyModal}
                  deleteItem={deleteItemHandler}
                />
              ))}
            </ul>
          </div>
        </div>
        <Dockbar active="main" />
      </section>
    </div>
  );
}
