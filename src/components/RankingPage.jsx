import React, { useState, useEffect } from "react";
import RankingList from "./RankingList";
import Dockbar from "./Dockbar";
import "./RankingPage.scss";

const mockData = {
  Streaming: [
    {
      id: Math.random().toFixed(5),
      rank: 1,
      title: "Netflix",
      imgSrc: "/images/netflix-logo.png",
      desc: "지금 바로 시청하세요",
      link: "https://apps.apple.com/kr/app/netflix/id363590051",
    },
    {
      id: Math.random().toFixed(5),
      rank: 2,
      title: "TVING",
      imgSrc: "/images/tving-logo.png",
      desc: "즐거움을 스트리밍하세요",
      link: "https://apps.apple.com/kr/app/tving/id400101401",
    },
    {
      id: Math.random().toFixed(5),
      rank: 3,
      title: "쿠팡플레이",
      imgSrc: "/images/couplay-logo.png",
      desc: "와우회원을 위한 스트리밍 서비스",
      link: "https://apps.apple.com/kr/app/%EC%BF%A0%ED%8C%A1%ED%94%8C%EB%A0%88%EC%9D%B4/id1536885649",
    },
    {
      id: Math.random().toFixed(5),
      rank: 4,
      title: "Disney+",
      imgSrc: "/images/disney-logo.png",
      desc: "다양하고 풍성한 엔터테인먼트의 세계",
      link: "https://apps.apple.com/kr/app/disney/id1446075923",
    },
    {
      id: Math.random().toFixed(5),
      rank: 5,
      title: "Wavve(웨이브)",
      imgSrc: "/images/wavve-logo.png",
      desc: "JUST DIVE! Wavve",
      link: "https://apps.apple.com/kr/app/wavve-%EC%9B%A8%EC%9D%B4%EB%B8%8C/id987782077",
    },
    {
      id: Math.random().toFixed(5),
      rank: 6,
      title: "왓챠 - WATCHA",
      imgSrc: "/images/watcha-logo.png",
      desc: "영화, 드라마 정주행, 매주 5백 편...",
      link: "https://apps.apple.com/kr/app/%EC%99%93%EC%B1%A0-watcha/id1096493180",
    },
  ],
  Music: [
    {
      id: Math.random().toFixed(5),
      name: "Spotify",
      rank: 1,
      title: "Spotify",
      imgSrc: "/images/spotify-logo.png",
      desc: "내 취향에 꼭 맞는 뮤직, 스트리밍부터 다운로드까지",
      link: "https://apps.apple.com/kr/app/spotify-%EC%8A%A4%ED%8F%AC%ED%8B%B0%ED%8C%8C%EC%9D%B4-%EB%AE%A4%EC%A7%81-%ED%8C%9F%EC%BA%90%EC%8A%A4%ED%8A%B8-%EC%95%B1/id324684580",
    },
    { id: Math.random().toFixed(5), title: "Apple Music", rank: 2 },
    { id: Math.random().toFixed(5), title: "Amazon Music", rank: 3 },
  ],
  News: [
    { id: Math.random().toFixed(5), title: "New York Times", rank: 1 },
    { id: Math.random().toFixed(5), title: "Washington Post", rank: 2 },
    { id: Math.random().toFixed(5), title: "The Guardian", rank: 3 },
  ],
};

export default function RankingPage() {
  const [data, setData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Streaming");

  useEffect(() => {
    // Here you would typically fetch data from an API
    // For this example, we use mockData directly
    setData(mockData);
  }, []);

  return (
    <div className="align-center">
      <section className="RankingPage">
        <div className="contents">
          <div className="nav-top"></div>
          <h2>구독 플랫폼 랭킹</h2>
          <ul className="platform-category">
            <li
              className={
                selectedCategory === "Streaming" ? "active" : undefined
              }
            >
              <button onClick={() => setSelectedCategory("Streaming")}>
                동영상 스트리밍
              </button>
            </li>
            <li className={selectedCategory === "Music" ? "active" : undefined}>
              <button onClick={() => setSelectedCategory("Music")}>음악</button>
            </li>
            <li className={selectedCategory === "Book" ? "active" : undefined}>
              <button onClick={() => setSelectedCategory("Book")}>도서</button>
            </li>
            <li className={selectedCategory === "News" ? "active" : undefined}>
              <button onClick={() => setSelectedCategory("News")}>뉴스</button>
            </li>
            <li
              className={selectedCategory === "Delivery" ? "active" : undefined}
            >
              <button onClick={() => setSelectedCategory("Delivery")}>
                배달
              </button>
            </li>
          </ul>
          <ul className="platform-chart-list">
            {Object.keys(data).map((category) => (
              <RankingList
                key={category}
                category={category}
                services={data[category]}
                selectedCategory={selectedCategory}
              />
            ))}
          </ul>
        </div>
        <Dockbar active="ranking" />
      </section>
    </div>
  );
}
