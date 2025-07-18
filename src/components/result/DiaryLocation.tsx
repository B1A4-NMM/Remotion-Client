// src/components/result/DiaryLocation.tsx

import React from "react";
import { MapPin } from "lucide-react";

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
        <MapPin className="w-8 h-8 text-[#2a1c31] stroke-[#2a1c31] stroke-2 fill-transparent drop-shadow-lg" />
      </div>
    </div>
  );
};

export default DiaryLocation;
