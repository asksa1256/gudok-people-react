import React from "react";

export default function SubscriptionItem({
  title,
  price,
  payDate,
  sharing,
  free,
}) {
  return (
    <>
      <li className="subscr-list-item">
        <figure className="icon">
          {/* <img src={item.imgSrc} alt={item.imgAlt} /> */}
        </figure>
        <div className="desc">
          <span className="name">{title}</span>
          <div className="price-wrap">
            <span className="price">{price.toLocaleString("ko-KR")}</span>
            <span className="won">원</span>
          </div>
        </div>
        <div className="payment-wrap">
          {sharing ? (
            <div className="sharing">
              <img src="/images/link.png" alt="" />
              계정 공유중
            </div>
          ) : undefined}
          <div className="payment-due">
            <span className="date">{payDate}</span>
            <span className="txt">결제 예정</span>
          </div>
        </div>
      </li>
    </>
  );
}
