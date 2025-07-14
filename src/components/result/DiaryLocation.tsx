// src/components/result/DiaryLocation.tsx

import React from "react";

interface DiaryLocationProps {
  location: {
    latitude: number;
    longitude: number;
    imageUrl: string; // 지도 썸네일 이미지 URL 등
  };
}

const DiaryLocation: React.FC<DiaryLocationProps> = ({ location }) => {
  if (!location) return null;

  return (
    <div className="rounded-xl overflow-hidden shadow border border-gray-200">
      <img
        src={location.imageUrl}
        alt="Diary Location Map"
        className="w-full h-48 object-cover"
      />
    </div>
  );
};

export default DiaryLocation;
