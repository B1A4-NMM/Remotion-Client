// src/components/result/DiaryLocation.tsx

import React from "react";

interface DiaryLocationProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

const DiaryLocation: React.FC<DiaryLocationProps> = ({ location }) => {
  if (!location || !location.latitude || !location.longitude) return null;

  // Google Maps Static API를 사용하여 동적으로 이미지 URL 생성
  const generateMapImageUrl = (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x300&key=${apiKey}`;
  };

  const imageUrl = generateMapImageUrl(location.latitude, location.longitude);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
      <img
        src={imageUrl}
        alt="Diary Location Map"
        className="w-full h-48 object-cover"
        onError={e => {
          console.error("지도 이미지 로딩 실패");
          (e.target as HTMLImageElement).src = "/placeholder-map.png";
        }}
      />
      {/* 커스텀 툴팁 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* 막대기 (아래 부분) - 회색 */}
          <rect x="14" y="16" width="4" height="12" fill="#666666" rx="2" />

          {/* 동그란 부분 (위쪽) - 빨간색 */}
          <circle cx="16" cy="12" r="8" fill="#FF4444" stroke="#CC0000" strokeWidth="1" />

          {/* 중앙 점 */}
          <circle cx="16" cy="12" r="2.5" fill="white" />
        </svg>
      </div>
    </div>
  );
};

export default DiaryLocation;
