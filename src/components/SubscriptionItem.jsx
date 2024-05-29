import React from "react";

export default function SubscriptionItem(props) {
  const itemModifyHandler = () => {
    const targetData = {
      id: props.id,
      title: props.title,
      price: props.price * 1,
      payDate: props.payDate,
      free: props.free,
      sharing: props.sharing,
      imgUrl: props.platformImgUrl,
    };
    props.showModifyModal(targetData);
  };

  const itemDeleteHandler = () => {
    props.deleteItem();
  };

  return (
    <>
      <li className="subscr-list-item">
        <figure className="icon">
          <img src={props.imgUrl} alt="" />
        </figure>
        <div className="desc">
          <span className="name">{props.title}</span>
          <div className="price-wrap">
            <span className="price">{props.price.toLocaleString("ko-KR")}</span>
            <span className="won">원</span>
          </div>
        </div>
        <div className="payment-wrap">
          {props.sharing ? (
            <div className="sharing">
              <img src="/images/link.png" alt="" />
              계정 공유중
            </div>
          ) : undefined}
          <div className="payment-due">
            <span className="date">{props.payDate}</span>
            <span className="txt">결제 예정</span>
          </div>
        </div>
        <div className="actions">
          <button onClick={itemModifyHandler}>수정</button>
          <button onClick={itemDeleteHandler}>삭제</button>
        </div>
      </li>
    </>
  );
}
