import React from "react";
import "./LoginPage.scss";

function LoginPage() {
  return (
    <div className="LoginPage">
      <form>
        <figure className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.svg`}
            alt="구독의 민족"
          />
        </figure>
        <h4>로그인</h4>
        <input type="text" className="form-control" />
        <button id="loginBtn">로그인</button>
      </form>
    </div>
  );
}
export default LoginPage;
