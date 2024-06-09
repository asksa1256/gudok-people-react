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
      link: "https://www.netflix.com/kr/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 2,
      title: "TVING",
      imgSrc: "/images/tving-logo.png",
      desc: "즐거움을 스트리밍하세요",
      link: "https://www.tving.com/onboarding",
    },
    {
      id: Math.random().toFixed(5),
      rank: 3,
      title: "쿠팡플레이",
      imgSrc: "/images/couplay-logo.png",
      desc: "와우회원을 위한 스트리밍 서비스",
      link: "https://www.coupangplay.com/catalog",
    },
    {
      id: Math.random().toFixed(5),
      rank: 4,
      title: "Disney+",
      imgSrc: "/images/disney-logo.png",
      desc: "다양하고 풍성한 엔터테인먼트의 세계",
      link: "https://www.disneyplus.com/home",
    },
    {
      id: Math.random().toFixed(5),
      rank: 5,
      title: "Wavve(웨이브)",
      imgSrc: "/images/wavve-logo.png",
      desc: "JUST DIVE! Wavve",
      link: "https://www.wavve.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 6,
      title: "왓챠 - WATCHA",
      imgSrc: "/images/watcha-logo.png",
      desc: "영화, 드라마 정주행, 매주 5백 편...",
      link: "https://watcha.com/",
    },
  ],
  Music: [
    {
      id: Math.random().toFixed(5),
      rank: 1,
      title: "Youtube Music",
      imgSrc: "/images/youtube-logo.png",
      desc: "동영상과 음악을 즐기고 공유하세요",
      link: "https://www.youtube.com/premium",
    },
    {
      id: Math.random().toFixed(5),
      rank: 2,
      title: "멜론",
      imgSrc: "/images/melon-logo.png",
      desc: "음악이 필요한 순간, 멜론",
      link: "https://www.melon.com/index.htm",
    },
    {
      id: Math.random().toFixed(5),
      rank: 3,
      title: "지니 뮤직",
      imgSrc: "/images/genie-logo.png",
      desc: "내 취향 가득 머금은 즐거운 음악 앱",
      link: "https://www.genie.co.kr/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 4,
      title: "FLO - 플로",
      imgSrc: "/images/flo-logo.png",
      desc: "가볍게, 나답게 FLO",
      link: "https://www.music-flo.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 5,
      title: "NAVER VIBE (바이브)",
      imgSrc: "/images/vibe-logo.png",
      desc: "음악은 같이 들어야죠",
      link: "https://www.music-flo.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 6,
      title: "Spotify (스포티파이)",
      imgSrc: "/images/spotify-logo.png",
      desc: "내 취향에 꼭 맞는 뮤직, 스트리밍부터 다운로드까지",
      link: "https://open.spotify.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 7,
      title: "카카오뮤직 KakaoMusic",
      imgSrc: "/images/kakaomusic-logo.png",
      desc: "",
      link: "https://music.kakao.com/share",
    },
    {
      id: Math.random().toFixed(5),
      rank: 8,
      title: "벅스 - Bugs",
      imgSrc: "/images/bugs-logo.png",
      desc: "나를 위한 플리, 벅스",
      link: "https://music.bugs.co.kr/",
    },
  ],
  Books: [
    {
      id: Math.random().toFixed(5),
      rank: 1,
      title: "밀리의 서재",
      imgSrc: "/images/millie-logo.png",
      desc: "국내 최대 독서 플랫폼",
      link: "https://www.millie.co.kr/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 2,
      title: "SERIES - 네이버 시리즈",
      imgSrc: "/images/series-logo.png",
      desc: "네이버 시리즈에서 인생작을 만나다",
      link: "https://series.naver.com/novel/home.series?isWebtoonAgreePopUp=true",
    },
    {
      id: Math.random().toFixed(5),
      rank: 3,
      title: "리디 - 웹툰, 웹소설, 전자책 모두 여기에!",
      imgSrc: "/images/ridi-logo.png",
      desc: "",
      link: "https://ridibooks.com/webtoon/recommendation",
    },
    {
      id: Math.random().toFixed(5),
      rank: 4,
      title: "교보eBook - e세상의 모든 전자책",
      imgSrc: "/images/kyobo-logo.png",
      desc: "",
      link: "https://ebook.kyobobook.co.kr/dig/pnd/showcase?pageNo=10",
    },
    {
      id: Math.random().toFixed(5),
      rank: 5,
      title: "윌라",
      imgSrc: "/images/vibe-logo.png",
      desc: "독서의 모든 것, 윌라",
      link: "https://www.welaaa.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 6,
      title: "레진코믹스 - 솔직한 재미 대폭발",
      imgSrc: "/images/lezhin-logo.png",
      desc: "당신이 찾던 진짜 웹툰",
      link: "https://www.lezhin.com/ko",
    },
    {
      id: Math.random().toFixed(5),
      rank: 7,
      title: "미스터블루 – 웹툰 소설 필수앱",
      imgSrc: "/images/mrblue-logo.png",
      desc: "출구 없는 찐 재미",
      link: "https://m.mrblue.com/",
    },
  ],
  Education: [
    {
      id: Math.random().toFixed(5),
      rank: 1,
      title: "열품타",
      imgSrc: "/images/ypt-logo.png",
      desc: "공부는 마라톤! 열품타에서 함께 공부해요!",
      link: "https://www.yeolpumta.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 2,
      title: "듀오링고(Duolingo): 언어 학습",
      imgSrc: "/images/duolingo-logo.png",
      desc: "영어, 스페인어, 프랑스어를 배워보세요.",
      link: "https://ko.duolingo.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 3,
      title: "말해보카: 영단어, 문법, 리스닝, 스피킹, 영어 공부",
      imgSrc: "/images/boca-logo.png",
      desc: "자연스럽게 스며드는 영어",
      link: "https://epop.ai/ko",
    },
    {
      id: Math.random().toFixed(5),
      rank: 4,
      title: "콴다 - 수학 문제 풀이 공부 앱",
      imgSrc: "/images/qanda-logo.png",
      desc: "스터디 Study & 시험 공부앱",
      link: "https://qanda.ai/ko",
    },
    {
      id: Math.random().toFixed(5),
      rank: 5,
      title: "스픽 (Speak) - 영어회화, 스피킹, 발음",
      imgSrc: "/images/speak-logo.png",
      desc: "영어학원이 싫어하는 영어어플",
      link: "https://www.usespeak.com/ko",
    },
    {
      id: Math.random().toFixed(5),
      rank: 6,
      title: "HelloTalk 헬로톡 - 영어 일본어 중국어회화",
      imgSrc: "/images/hellotok-logo.png",
      desc: "언어교환, 외국인 채팅,공부 독일어 스페인어 불어",
      link: "https://www.hellotalk.com/?lang=ko",
    },
    {
      id: Math.random().toFixed(5),
      rank: 7,
      title: "똑똑보카 - 돈버는 영어 단어장, 영어 공부습관 앱테크",
      imgSrc: "/images/ddvoca-logo.png",
      desc: "영단어 공부하며 돈 버는, 영어 공부 습관 앱테크",
      link: "https://www.knockknockvoca.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 8,
      title: "산타 - AI 토익&지텔프",
      imgSrc: "/images/santa-logo.png",
      desc: "토익부터 G-TELP까지, 단기 점수 상승은 역시 산타",
      link: "https://kr.aitutorsanta.com/",
    },
    {
      id: Math.random().toFixed(5),
      rank: 9,
      title: "CLASS101 - 클래스101",
      imgSrc: "/images/class101-logo.png",
      desc: "모두가 사랑할 배움, 온라인 클래스는 CLASS101",
      link: "https://class101.net/ko",
    },
  ],
};

export default function RankingPage() {
  const [data, setData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Streaming");

  useEffect(() => {
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
            <li className={selectedCategory === "Books" ? "active" : undefined}>
              <button onClick={() => setSelectedCategory("Books")}>도서</button>
            </li>
            <li
              className={
                selectedCategory === "Education" ? "active" : undefined
              }
            >
              <button onClick={() => setSelectedCategory("Education")}>
                교육
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
