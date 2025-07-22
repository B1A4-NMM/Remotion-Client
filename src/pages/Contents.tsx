import React from "react";
import Title from "@/components/recommend/Title";
import Video from "@/components/recommend/VideoBox";
import MeditationCard from "@/components/recommend/MeditationCard";

const Contents = () => {
  return (
    <div className="text-foreground bg-[#fdfaf8] dark:bg-transparent px-4 ">
      <div>
        <Title />

        <div className="flex justify-between px-7 mt-10">
          <h1 className="text-xl font-bold ">당신을 위해 준비된 영상</h1>
        </div>

        <Video />

        <div className="flex justify-between px-7 mt-10">
          <h1 className="text-xl font-bold ">마음 비워내기</h1>
        </div>

        <MeditationCard />
      </div>
    </div>
  );
};

export default Contents;
