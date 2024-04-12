import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignupPage.scss";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

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

  // 회원가입 정보 firebase DB로 전송
  async function submitSignupHandler(event) {
    event.preventDefault();
    const signUpEmail = document.getElementById("email").value.trim();
    const signUpPassword = document.getElementById("password").value.trim();

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
      alert("회원가입이 성공적으로 완료되었습니다!");
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
          setEmailUnique(false);
        // case "auth/weak-password":
        //   setPasswordValid(false);
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

  // const checkDuplicate = async () => {
  //   if (email.trim().length === 0) {
  //     alert("이메일을 입력해주세요.");
  //   } else {
  //     // getAuth()
  //     //   .getUserByEmail(email)
  //     //   .then((userRecord) => {
  //     //     // See the UserRecord reference doc for the contents of userRecord.
  //     //     console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.log("Error fetching user data:", error);
  //     //   });
  //     try {
  //       const userCredential = await fetchSignInMethodsForEmail(auth, email);
  //       console.log(userCredential);
  //       if (userCredential.length !== 0) {
  //         console.log("해당 이메일로 이미 가입된 사용자가 있습니다.");
  //       } else {
  //         console.log("해당 이메일로 가입된 사용자가 없습니다.");
  //       }
  //     } catch (error) {
  //       console.error("이메일 확인 오류:", error);
  //     }
  //   }
  // };

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
                onChange={(e) => setEmail(e.target.value)}
                className={!emailUnique || !emailValid ? "invalid" : ""}
              />
              {emailUnique ? undefined : (
                <span className="text-invalid">이미 등록된 이메일입니다.</span>
              )}
              {emailValid ? undefined : (
                <span className="text-invalid">잘못된 이메일 형식입니다.</span>
              )}

              {/* <button
                className="btn-sm btn-gray"
                onClick={checkDuplicate}
              >
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
                onChange={(e) => setPassword(e.target.value)}
                className={!passwordValid ? "invalid" : ""}
              />
              {passwordValid ? undefined : (
                <span className="text-invalid">
                  비밀번호는 최소 6자 이상 입력해주세요.
                </span>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="confirm-password">비밀번호 확인</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="비밀번호 확인"
                value={passChk}
                onChange={(e) => setPassChk(e.target.value)}
                className={!passChkValid ? "invalid" : ""}
              />
              {passChkValid ? undefined : (
                <span className="text-invalid">
                  입력한 비밀번호가 다릅니다.
                </span>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                placeholder="닉네임"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={!nicknameValid ? "invalid" : ""}
              />
              {nicknameValid ? undefined : (
                <span className="text-invalid">닉네임을 입력해주세요.</span>
              )}
              {/* <button
                className="btn-sm btn-gray"
                onClick={checkDuplicate("nickname")}
              >
                중복확인
              </button> */}
            </div>
            {/* <!-- 회원가입 버튼에 id 추가 --> */}
            <div className="actions">
              <button id="signUpButton" onClick={submitSignupHandler}>
                회원가입
              </button>
              {/* <!-- Added id "signUpButton" --> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
