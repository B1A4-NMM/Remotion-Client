import React from "react";
import CardSlider from "../components/CardSlider";

const AboutMe = () => {
  return (
    <div className="relative   text-foreground min-h-screen">
      {/* 카드 슬라이드 전체임 (굳이 안나눠도 됐을 듯?)*/}
      <CardSlider />
    </div>
  );
};

export default AboutMe;
