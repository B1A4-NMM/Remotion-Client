// src/components/result/DiaryPhotos.tsx

import React from "react";

interface DiaryPhotosProps {
  photos: string[]; // s3 URL 배열이라고 가정
}

const DiaryPhotos: React.FC<DiaryPhotosProps> = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
      {photos.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Diary Photo ${idx}`}
          className="object-cover w-full h-40 rounded-lg"
        />
      ))}
    </div>
  );
};

export default DiaryPhotos;
