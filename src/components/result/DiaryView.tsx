// src/components/result/DiaryView.tsx

import React from "react";
import DiaryPhotos from "./DiaryPhotos";
import DiaryAudio from "./DiaryAudio";
import DiaryContent from "./DiaryContent";
import DiaryLocation from "./DiaryLocation";

interface DiaryViewProps {
  diaryContent: any;
}

const DiaryView: React.FC<DiaryViewProps> = ({ diaryContent }) => {
  return (
    <div className="space-y-6">
      <DiaryPhotos photos={diaryContent?.photos} />
      <DiaryAudio audio={diaryContent?.audio} />
      <DiaryContent content={diaryContent?.content} />
      <DiaryLocation location={diaryContent?.location} />
    </div>
  );
};

export default DiaryView;
