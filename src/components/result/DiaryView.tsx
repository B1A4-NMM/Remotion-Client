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
    <div className="space-y-6 mb-20">
      <DiaryPhotos photos={diaryContent?.photoPath} />
      <DiaryAudio audio={diaryContent?.audioPath} />
      <DiaryContent content={diaryContent?.content} />
      <DiaryLocation location={{latitude:diaryContent?.latitude, longitude:diaryContent?.longitude}} />
    </div>
  );
};

export default DiaryView;
