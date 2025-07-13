// src/components/result/DiaryAudio.tsx

import React from "react";

interface DiaryAudioProps {
  audio: string; // 녹음 파일 URL
}

const DiaryAudio: React.FC<DiaryAudioProps> = ({ audio }) => {
  if (!audio) return null;

  return (
    <div className="p-4 rounded-xl bg-white shadow border border-gray-200">
      <audio controls className="w-full">
        <source src={audio} type="audio/mpeg" />
        브라우저가 audio 태그를 지원하지 않습니다.
      </audio>
    </div>
  );
};

export default DiaryAudio;
