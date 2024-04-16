import React from "react";
import "./MainPage.scss";
import MySubscrList from "./MySubscrList";
import { Link } from "react-router-dom";

export default function MainPage() {
  const items = [
    {
      id: Math.random(),
      title: "넷플릭스",
      price: 5500,
      paymentDate: "04.26",
      imgSrc: "/images/netflix-logo.png",
      imgAlt: "넷플릭스 아이콘",
      sharing: false,
    },
  ];

  return (
    <div className="align-center">
      <section className="MainPage">
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
                id="showAddListModalBtn"
              >
                + 추가하기
              </button>
            </div>
            <MySubscrList items={items} />
            {/* <ul className="subscr-list">
              <li className="subscr-list-item">
                <figure className="icon">
                  <img src="/images/netflix-logo.png" alt="넷플릭스 아이콘" />
                </figure>
                <div className="desc">
                  <span className="name">넷플릭스</span>
                  <div className="price-wrap">
                    <span className="price">5,500</span>
                    <span className="won">원</span>
                  </div>
                </div>
                <div className="payment-wrap">
                  <div className="payment-due">
                    <span className="date">04.26</span>
                    <span className="txt">결제 예정</span>
                  </div>
                </div>
              </li>
              <li className="subscr-list-item">
                <figure className="icon">
                  <img src="/images/couplay-logo.png" alt="쿠팡플레이 아이콘" />
                </figure>
                <div className="desc">
                  <span className="name">쿠팡플레이</span>
                  <div className="price-wrap">
                    <span className="price">5,000</span>
                    <span className="won">원</span>
                  </div>
                </div>
                <div className="payment-wrap">
                  <div className="payment-due">
                    <span className="date">04.23</span>
                    <span className="txt">결제 예정</span>
                  </div>
                </div>
              </li>
              <li className="subscr-list-item">
                <figure className="icon">
                  <img src="/images/tving-logo.png" alt="티빙 아이콘" />
                </figure>
                <div className="desc">
                  <span className="name">티빙</span>
                  <div className="price-wrap">
                    <span className="price">11,900</span>
                    <span className="won">원</span>
                  </div>
                </div>
                <div className="payment-wrap">
                  <div className="payment-due">
                    <span className="date">05.05</span>
                    <span className="txt">결제 예정</span>
                  </div>
                </div>
              </li>
              <li className="subscr-list-item">
                <figure className="icon">
                  <img src="/images/spotify-logo.png" alt="스포티파이 아이콘" />
                </figure>
                <div className="desc">
                  <span className="name">스포티파이</span>
                  <div className="price-wrap">
                    <span className="price">12,000</span>
                    <span className="won">원</span>
                  </div>
                </div>
                <div className="payment-wrap">
                  <div className="sharing">
                    <img src="/images/link.png" alt="" />
                    계정 공유중
                  </div>
                  <div className="payment-due">
                    <span className="date">04.12</span>
                    <span className="txt">결제 예정</span>
                  </div>
                </div>
              </li>
              <li className="subscr-list-item">
                <figure className="icon">
                  <img src="/images/youtube-logo.png" alt="유튜브 아이콘" />
                </figure>
                <div className="desc">
                  <span className="name">유튜브 프리미엄</span>
                  <div className="price-wrap">
                    <span className="price">13,500</span>
                    <span className="won">원</span>
                  </div>
                </div>
                <div className="payment-wrap">
                  <div className="sharing">
                    <img src="/images/link.png" alt="" />
                    계정 공유중
                  </div>
                  <div className="payment-due">
                    <span className="date">04.15</span>
                    <span className="txt">결제 예정</span>
                  </div>
                </div>
              </li>
            </ul> */}
          </div>
        </div>
        <nav className="dock-bar">
          <div className="dock-item active">
            <Link to="/main" className="dock-link">
              <figure className="icon">
                <img src="/images/home-fill.svg" alt="" />
              </figure>
              <span className="text">홈</span>
            </Link>
          </div>
          <div className="dock-item">
            <Link to="/mySubscription" className="dock-link">
              <figure className="icon">
                <img src="/images/stack-line.svg" alt="" />
              </figure>
              <span className="text">내 구독</span>
            </Link>
          </div>
          <div className="dock-item">
            <Link to="/ranking" className="dock-link">
              <figure className="icon">
                <img src="/images/list-ordered.svg" alt="" />
              </figure>
              <span className="text">플랫폼 순위</span>
            </Link>
          </div>
          <div className="dock-item">
            <Link to="/community" className="dock-link">
              <figure className="icon">
                <img src="/images/group-line.svg" alt="" />
              </figure>
              <span className="text">커뮤니티</span>
            </Link>
          </div>
          <div className="dock-item">
            <Link to="/settings" className="dock-link">
              <figure className="icon">
                <img src="/images/settings-line.svg" alt="" />
              </figure>
              <span className="text">설정</span>
            </Link>
          </div>
        </nav>
      </section>
    </div>
  );
}
