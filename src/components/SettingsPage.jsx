import React from "react";
import Dockbar from "./Dockbar";

export default function SettingsPage() {
  return (
    <div className="align-center">
      <section className="SettingsPage">
        <div className="contents">
          <div className="nav-top"></div>
          <h2>앱 설정</h2>
        </div>
        <Dockbar active="settings" />
      </section>
    </div>
  );
}
