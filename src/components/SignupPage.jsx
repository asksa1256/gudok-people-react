import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.scss";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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
const auth = getAuth(firebaseApp);
const db = firebase.firestore();

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passChk, setPassChk] = useState("");
  const [emailUnique, setEmailUnique] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passChkValid, setPassChkValid] = useState(true);
  const deviceToken = useContext(AppContext);
  const navigate = useNavigate();

  // 회원가입 정보 firebase DB로 전송
  async function submitSignupHandler(event) {
    event.preventDefault();

    if (!passChkValid) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // email, device token값 포함해서 firestore에도 회원정보 저장하기
      db.collection("user")
        .add({ email: email, token: deviceToken })
        .then((docRef) => {
          // console.log("계정 생성 완료");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      // 로그인 처리
      signInWithEmailAndPassword(auth, email, password);

      // 메인으로 이동
      navigate("/main");
      alert("회원가입 되었습니다. 메인 페이지로 이동합니다.");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailUnique(false);
      } else {
        setEmailUnique(true);
      }

      if (error.code === "auth/weak-password") {
        setPasswordValid(false);
      } else {
        setPasswordValid(true);
      }

      switch (error.code) {
        case "auth/email-already-in-use":
        // setEmailUnique(false);
        case "auth/weak-password":
        // setPasswordValid(false);
        case "auth/network-request-failed":
          return "네트워크 연결에 실패 하였습니다.";
        case "auth/invalid-email":
          return "잘못된 이메일 형식입니다.";
        case "auth/internal-error":
          return "잘못된 요청입니다.";
        default:
          return "회원가입에 실패 하였습니다.";
      }
    }
  }

  useEffect(() => {
    password.length < 6 ? setPasswordValid(false) : setPasswordValid(true);
    passChk !== password ? setPassChkValid(false) : setPassChkValid(true);
  }, [passChk, passChkValid, password, setPassChkValid]);

  return (
    <div className="align-center">
      <section className="SignupPage">
        <div className="contents">
          <Link to="/" className="nav-link">
            <img src="/images/arrow-back.png" alt="" />
            로그인
          </Link>
          <div className="form-area">
            <figure className="logo">
              <img src="/images/logo.svg" alt="구독의 민족" />
            </figure>
            <h4 className="title-h4">회원가입</h4>
            <div className="form-control">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className={!emailUnique || !emailValid ? "invalid" : ""}
              />
              {!emailUnique && (
                <span className="text-invalid">이미 등록된 이메일입니다.</span>
              )}
              {!emailValid && (
                <span className="text-invalid">잘못된 이메일 형식입니다.</span>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                className={!passwordValid ? "invalid" : ""}
              />
              <span className={passwordValid ? "text-sub" : "text-invalid"}>
                최소 6자 이상 입력해주세요.
              </span>
            </div>
            <div className="form-control">
              <label htmlFor="confirm-password">비밀번호 확인</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="비밀번호 확인"
                value={passChk}
                onChange={(e) => setPassChk(e.target.value.trim())}
                className={!passChkValid ? "invalid" : ""}
              />
              {!passChkValid && (
                <span className="text-invalid">
                  입력한 비밀번호가 다릅니다.
                </span>
              )}
            </div>
            <div className="actions">
              <button id="signUpButton" onClick={submitSignupHandler}>
                회원가입
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
