import React from "react";
import "./RankingPage.scss";

export default function RankingList({ category, services, selectedCategory }) {
  return (
    <>
      {category === selectedCategory &&
        services.map((service) => (
          <li key={service.id}>
            <figure className="ico">
              <img src={service.imgSrc} alt="" />
            </figure>
            <div className="platform-info">
              <div className="info">
                <span className="rank">{service.rank}</span>
                <span className="title">{service.title}</span>
                <p className="desc">{service.desc}</p>
              </div>
              <a
                href={service.link}
                target="_blank"
                rel="noreferrer"
                className="link-btn"
              >
                바로가기
              </a>
            </div>
          </li>
        ))}
      {/* {services.map((service) => (
        <li key={service.id}>
          <figure className="ico">
            <img src={service.imgSrc} alt="" />
          </figure>
          <div className="platform-info">
            <div className="info">
              <span className="rank">{service.rank}</span>
              <span className="title">{service.title}</span>
              <p className="desc">{service.desc}</p>
            </div>
            <a
              href={service.link}
              target="_blank"
              rel="noreferrer"
              className="link-btn"
            >
              바로가기
            </a>
          </div>
        </li>
      ))} */}
    </>
  );
}
