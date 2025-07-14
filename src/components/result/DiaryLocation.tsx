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
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
  };

  const imageUrl = generateMapImageUrl(location.latitude, location.longitude);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <img
        src={imageUrl}
        alt="Diary Location Map"
        className="w-full h-48 object-cover"
        onError={(e) => {
          console.error("지도 이미지 로딩 실패");
          (e.target as HTMLImageElement).src = "/placeholder-map.png";
        }}
      />
            
    </div>
  );
};

export default DiaryLocation;