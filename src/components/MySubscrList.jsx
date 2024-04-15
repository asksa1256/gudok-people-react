import React from "react";

export default function MySubscrList({ items }) {
  return (
    <ul className="subscr-list">
      {items.map((item, index) => (
        <li className="subscr-list-item" key={index}>
          <figure className="icon">
            <img src={item.imgSrc} alt={item.imgAlt} />
          </figure>
          <div className="desc">
            <span className="name">{item.title}</span>
            <div className="price-wrap">
              <span className="price">
                {item.price.toLocaleString("ko-KR")}
              </span>
              <span className="won">원</span>
            </div>
          </div>
          <div className="payment-wrap">
            {item.sharing && (
              <div className="sharing">
                <img src="/images/link.png" alt="" />
                계정 공유중
              </div>
            )}
            <div className="payment-due">
              <span className="date">{item.paymentDate}</span>
              <span className="txt">결제 예정</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
