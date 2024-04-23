import React, { useState } from "react";
import "./MainPage.scss";
import MySubscrList from "./MySubscrList";
import AddSubscrModal from "./AddSubscrModal";
import Dockbar from "./Dockbar";

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

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);

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
          title={"새 구독 추가"}
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
        <Dockbar active="main" />
      </section>
    </div>
  );
}
