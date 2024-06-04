import React from "react";
import { Link } from "react-router-dom";
import "./Dockbar.scss";

export default function Dockbar(props) {
  return (
    <nav className="dock-bar">
      <div className="dock-item">
        <Link to="/main" className="dock-link">
          <figure className="icon">
            <img
              src={`/images/home-${
                props.active === "main" ? "fill" : "line"
              }.svg`}
              alt=""
            />
          </figure>
          <span className="text">홈</span>
        </Link>
      </div>
      <div className="dock-item">
        <Link to="/ranking" className="dock-link">
          <figure className="icon">
            <img
              src={`/images/list-ordered-${
                props.active === "ranking" ? "fill" : "line"
              }.svg`}
              alt=""
            />
          </figure>
          <span className="text">플랫폼 순위</span>
        </Link>
      </div>
      <div className="dock-item">
        <Link to="/community" className="dock-link">
          <figure className="icon">
            <img
              src={`/images/group-${
                props.active === "community" ? "fill" : "line"
              }.svg`}
              alt=""
            />
          </figure>
          <span className="text">커뮤니티</span>
        </Link>
      </div>
      <div className="dock-item">
        <Link to="/settings" className="dock-link">
          <figure className="icon">
            <img
              src={`/images/settings-${
                props.active === "settings" ? "fill" : "line"
              }.svg`}
              alt=""
            />
          </figure>
          <span className="text">설정</span>
        </Link>
      </div>
    </nav>
  );
}
