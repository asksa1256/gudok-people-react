import React from "react";
import { Link } from "react-router-dom";
import "./LoginPage.scss";

export default function LoginPage() {
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
              <button className="login-btn" id="loginBtn" type="button">
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
