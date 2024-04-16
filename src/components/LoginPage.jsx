import React from "react";
import { Link } from "react-router-dom";
import "./LoginPage.scss";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // 수정

export default function LoginPage() {
  const navigate = useNavigate(); // 수정

  // 로그인 버튼 클릭 시 실행되는 함수
  const handleLogin = async () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // Firebase Authentication 서비스를 이용하여 이메일과 비밀번호로 로그인
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      // 로그인 성공 시 리다이렉트 또는 다른 작업 수행
      navigate("/main"); // 수정: useNavigate를 사용하여 리다이렉트
    } catch (error) {
      // 로그인 실패 시 에러 처리
      console.error("Error signing in:", error.message);
      // 에러 메시지를 사용자에게 알림
      alert("로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="align-center">
      <section className="LoginPage">
        <div className="contents">
          <div className="form-area">
            <figure className="logo">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.svg`}
                alt="구독의 민족"
              />
            </figure>
            <h4 className="title-h4">로그인</h4>
            <div className="form-control">
              <input id="username" type="text" placeholder="아이디" />
            </div>
            <div className="form-control">
              <input id="password" type="password" placeholder="비밀번호" />
            </div>
            <div className="actions">
              {/* 로그인 버튼 클릭 시 handleLogin 함수 호출 */}
              <button className="login-btn" onClick={handleLogin}>
                로그인
              </button>
            </div>
            <div className="text-center">
              <Link to="/signup" className="text-link">
                계정이 없으신가요? 회원가입하기
              </Link>
            </div>
            <div className="text-center">
              <Link to="/main" className="text-link">
                비회원으로 이용하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
