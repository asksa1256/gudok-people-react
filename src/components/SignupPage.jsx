import React, { useContext, useState } from "react";
import { AppContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.scss";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJIKpp9yOyKk46wKRmFzVhXn3LD6TpipY",
  authDomain: "gudok-87985.firebaseapp.com",
  databaseURL:
    "https://gudok-87985-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gudok-87985",
  storageBucket: "gudok-87985.appspot.com",
  messagingSenderId: "359891219478",
  appId: "1:359891219478:web:25b97dd447f5379f9b3137",
  measurementId: "G-BE9K8XNCTR",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = firebase.firestore();

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passChk, setPassChk] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailUnique, setEmailUnique] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passChkValid, setPassChkValid] = useState(true);
  const [nicknameValid, setNicknameValid] = useState(true);
  const deviceToken = useContext(AppContext);
  const navigate = useNavigate();

  // 회원가입 정보 firebase DB로 전송
  async function submitSignupHandler(event) {
    event.preventDefault();
    // console.log(deviceToken);

    nickname.length === 0 ? setNicknameValid(false) : setNicknameValid(true);
    password.length < 6 ? setPasswordValid(false) : setPasswordValid(true);
    passChk !== password ? setPassChkValid(false) : setPassChkValid(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);

      // email, device token값 포함해서 firestore에도 회원정보 저장하기
      db.collection("user")
        .add({ email: email, token: deviceToken })
        .then((docRef) => {
          // console.log("계정 생성 완료");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      alert(
        "회원가입이 성공적으로 완료되었습니다! 3초 뒤 메인 화면으로 이동합니다."
      );

      // 3초 뒤 자동 로그인 + 메인 페이지로 이동
      signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        navigate("/main");
      }, 3000);
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

  // function checkDuplicate() {
  //   const user = auth.currentUser; // 로그인을 한번이라도 해야 currentUser에 등록이 됨. 가입만 하고 로그인을 안하면 가입했어도 null로 뜸. => 회원가입 후 자동으로 로그인 시키면 사용 가능 -> 중복확인 로직 구현 가능할수도

  //   console.log(user);
  //   if (user !== null) {
  //     user.providerData.forEach((profile) => {
  //       console.log("  Email: " + profile.email);
  //     });
  //   }
  // }

  return (
    <div className="align-center">
      <section className="SignupPage">
        <div className="contents">
          <nav className="nav-top">
            <Link to="/" className="nav-link">
              <img src="/images/arrow-back.png" alt="" />
              로그인
            </Link>
          </nav>
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
              {/* <button className="btn-sm btn-gray" onClick={checkDuplicate}>
                중복확인
              </button> */}
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
              {/* {!passwordValid && (
                <span className="text-invalid">
                  비밀번호는 최소 6자 이상 입력해주세요.
                </span>
              )} */}
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
            {/* <div className="form-control">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                placeholder="닉네임"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value.trim())}
                className={!nicknameValid ? "invalid" : ""}
              />
              {!nicknameValid && (
                <span className="text-invalid">닉네임을 입력해주세요.</span>
              )}
            </div> */}
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
