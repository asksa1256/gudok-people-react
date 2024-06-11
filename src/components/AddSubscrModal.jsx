import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { getMessaging, getToken } from "firebase/messaging";
import "./AddSubscrModal.scss";
import "./Modal.scss";
import "../App.scss";
import "../dateFormat";
import dateFormat from "../dateFormat";

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const messaging = getMessaging();
const firestore = firebase.firestore();

export default function Modal(props) {
  const { open, close, modalTitle } = props; // 모달 동작 관련
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [payDate, setPayDate] = useState("");
  const [freePeriod, setFreePeriod] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [free, setFree] = useState(false);
  const [share, setShare] = useState(false);
  const deviceToken = useContext(AppContext);
  const [refreshedToken, setRefreshedToken] = useState("");
  const [platformImgUrl, setPlatformImgUrl] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [platformCancelLink, setPlatformCancelLink] = useState("");
  const [searchTitleForm, setSearchTitleForm] = useState(false);

  // 구독 플랫폼 정보 불러오기
  const fetchPlatformsData = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      try {
        const snapshot = await db.collection("platforms").get();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlatforms(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    });
  };

  // 현재 트랜지션 효과를 보여주고 있는 중이라는 상태 값
  const [animate, setAnimate] = useState(false);
  // 실제 컴포넌트가 사라지는 시점을 지연시키기 위한 값
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    // 토큰 작업
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) return;
      const snapshot = await db
        .collection("user")
        .where("email", "==", user.email)
        .get();
      const doc = snapshot.docs[0];
      const docRef = firestore.collection("user").doc(doc.id);

      if (!deviceToken) {
        getToken(messaging, {
          vapidKey:
            "BK7Jyd1qE2DWQAygv_E6oHlyvFVJ1be_gtzZ2vRaCTb0oO_o6E5TgSBQSNQJC37AcHFygzDEEXrvuBIm-BiUnNA",
        })
          .then((token) => {
            setRefreshedToken(token);
            try {
              docRef.update({
                token: token,
              });
            } catch (error) {
              console.error("Error updating document field: ", error);
            }
          })
          .catch((error) => {
            console.error("FCM 토큰 갱신 중 오류 발생:", error);
          });
      }
    });

    setVisible(open);

    // open 값이 true -> false 가 되는 것을 감지 (즉, 모달창을 닫을 때)
    if (visible && !open) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 200);
    }

    fetchPlatformsData();
    return () => {
      setVisible(false);
    };
  }, [visible, open, deviceToken]);

  if (!animate && !visible) return null;

  const filteredPlatforms = platforms.filter((platform) => {
    if (
      platform.name.includes(title) ||
      platform.engName.toLowerCase().includes(title.toLowerCase())
    ) {
      return true;
    }
  });

  const setPlatformInfo = (name, url, cancelLink) => {
    setTitle(name);
    setPlatformImgUrl(url);
    setPlatformCancelLink(cancelLink);
    setSearchTitleForm(false);
  };

  const clickRadioHandler = (e) => {
    const clickedRadio = e.target.id;
    const shareInput = document.querySelector("#shareInput");
    const radioShare = document.querySelector("#radioShare");
    const freeInput = document.querySelector("#freeInput");
    const radioFree = document.querySelector("#radioFree");

    // 무료체험
    if (clickedRadio === "radioFree") {
      setFree(true);
      freeInput.className = "active";
    }
    if (clickedRadio === "freeInput") {
      setFree(true);
      radioFree.checked = "true";
      freeInput.className = "active";
    }
    if (clickedRadio === "radioNotFree") {
      setFree(false);
      setFreePeriod(0);
      freeInput.className = "";
    }

    // 공유
    if (clickedRadio === "radioShare") {
      setShare(true);
      shareInput.className = "active";
    }
    if (clickedRadio === "shareInput") {
      setShare(true);
      radioShare.checked = "true";
      shareInput.className = "active";
    }
    if (clickedRadio === "radioNotShare") {
      setShare(false);
      setShareCount(0);
      shareInput.className = "";
    }
  };

  const submitFormHandler = () => {
    if (title.length === 0 || price <= 0 || payDate.length === 0) {
      alert("입력되지 않은 항목이 있습니다.");
      return;
    }

    let today = new Date();
    const addDate = dateFormat(today);

    const newData = {
      title: title.trim(),
      price: price * 1,
      payDate: payDate,
      free: !free ? 0 : freePeriod * 1,
      sharing: !share ? 0 : shareCount * 1,
      imgUrl: platformImgUrl,
      token: deviceToken.length > 0 ? deviceToken : refreshedToken,
      cancelLink: platformCancelLink,
      addDate: addDate,
    };

    // MainPage로 데이터 전달
    props.updateData(newData);

    // 폼 초기화
    setTitle("");
    setPrice(0);
    setPayDate("");
    setFree(false);
    setFreePeriod(0);
    setShare(false);
    setShareCount(0);
    const radioNotFree = document.querySelector("#radioNotFree");
    const radioNotShare = document.querySelector("#radioNotShare");
    radioNotFree.checked = "true";
    radioNotShare.checked = "true";
  };

  return (
    <>
      <div className={open ? "backdrop open" : "backdrop close"}></div>
      <div className={open ? "modal open" : "modal close"}>
        <div className="modal-header">
          <h3 className="modal-title">{modalTitle}</h3>
          <button className="modal-close" onClick={close}>
            <img src="/images/close.png" alt="모달창 닫기" />
          </button>
        </div>
        <div className="form-control">
          <label htmlFor="subscription-name">구독 서비스명</label>
          <input
            type="text"
            id="subscription-name"
            value={title}
            onFocus={() => setSearchTitleForm(true)}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="쿠팡와우, 넷플릭스, 멜론, ..."
            autoComplete="off"
          />
          {searchTitleForm && (
            <ul className="filtered-platforms">
              {filteredPlatforms.map((platform) => (
                <li
                  key={platform.engName}
                  onClick={() =>
                    setPlatformInfo(
                      platform.name,
                      platform.imgUrl,
                      platform.cancleLink
                    )
                  }
                >
                  <img src={platform.imgUrl} alt="" />
                  {platform.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="subscription-price">가격</label>
          <input
            type="number"
            id="subscription-price"
            placeholder="5500"
            style={{ textAlign: "left" }}
            value={price}
            onChange={(e) => setPrice(e.target.value.trim())}
            onFocus={() => setSearchTitleForm(false)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="subscription-date">결제일</label>
          <input
            type="date"
            id="subscription-date"
            // placeholder="2024-01-01"
            style={{ textAlign: "left" }}
            value={payDate}
            onChange={(e) => setPayDate(e.target.value.trim())}
            onFocus={() => setSearchTitleForm(false)}
          />
        </div>
        <div className="form-control">
          <label>무료 체험 (일)</label>
          <div className="options">
            <div className="radio-wrap">
              <input
                type="radio"
                name="free"
                id="radioNotFree"
                defaultChecked="true"
                onClick={clickRadioHandler}
                onFocus={() => setSearchTitleForm(false)}
              />
              <label htmlFor="radioNotFree">해당 없음</label>
            </div>
            <div className="radio-wrap">
              <input
                type="radio"
                name="free"
                id="radioFree"
                onClick={clickRadioHandler}
                onFocus={() => setSearchTitleForm(false)}
              />
              <label htmlFor="radioFree">
                <input
                  type="number"
                  id="freeInput"
                  placeholder="1"
                  min="1"
                  value={freePeriod}
                  onChange={(e) => setFreePeriod(e.target.value.trim())}
                  className={freePeriod ? "active" : undefined}
                  onClick={clickRadioHandler}
                  onFocus={() => setSearchTitleForm(false)}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="form-control">
          <label>계정 공유 (명)</label>
          <div className="options">
            <div className="radio-wrap">
              <input
                type="radio"
                name="sharing"
                id="radioNotShare"
                defaultChecked="true"
                onClick={clickRadioHandler}
                onFocus={() => setSearchTitleForm(false)}
              />
              <label htmlFor="radioNotShare">해당 없음</label>
            </div>
            <div className="radio-wrap">
              <input
                type="radio"
                name="sharing"
                id="radioShare"
                onClick={clickRadioHandler}
                onFocus={() => setSearchTitleForm(false)}
              />
              <label htmlFor="radioShare">
                <input
                  type="number"
                  id="shareInput"
                  placeholder="2"
                  min="2"
                  value={shareCount}
                  onChange={(e) => setShareCount(e.target.value.trim())}
                  className={shareCount ? "active" : undefined}
                  onClick={clickRadioHandler}
                  onFocus={() => setSearchTitleForm(false)}
                />
              </label>
            </div>
          </div>
        </div>
        <button className="btn-w100 btn-submit" onClick={submitFormHandler}>
          추가하기
        </button>
      </div>
    </>
  );
}
