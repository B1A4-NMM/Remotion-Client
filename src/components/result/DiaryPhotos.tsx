// src/components/result/DiaryPhotos.tsx

import React from "react";

const sample=[
  "https://remotion-photo.s3.ap-northeast-2.amazonaws.com/bcdc2b34-a81e-4d51-be65-d14c4423e193.jpg",
  "https://remotion-photo.s3.ap-northeast-2.amazonaws.com/bcdc2b34-a81e-4d51-be65-d14c4423e193.jpg",
  "https://remotion-photo.s3.ap-northeast-2.amazonaws.com/bcdc2b34-a81e-4d51-be65-d14c4423e193.jpg",
]

interface DiaryPhotosProps {
  photos: string[]; // s3 URL 배열이라고 가정
}

const DiaryPhotos: React.FC<DiaryPhotosProps> = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  const renderPhotos=()=>{
    switch(photos.length){
      case 1:
        return(
          <div className="w-full h-[332px]">
            <img
              src={photos[0]}
              alt="Diary Photo"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        )
      case 2:
        return(
          <div className="h-[332px] grid grid-cols-1 gap-2">
            {photos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Diary Photo ${idx}`}
                className="object-cover w-full h-full rounded-lg"
              />
            ))}
          </div>
        )
      case 3:
        return (
          <div className="h-[332px] space-y-2">
            {/* 상단 2개 */}
            <div className="grid grid-cols-2 gap-2">
              {photos.slice(1).map((url, idx) => (
                <img
                  key={idx + 1}
                  src={url}
                  alt={`Diary Photo ${idx + 2}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              ))}
            </div>
            
            {/* 하단 한개 */}
            <img
              src={photos[0]}
              alt="Diary Photo 1"
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        );
      case 4:
        return(
          <div className="h-[332px] grid grid-cols-2 gap-2">
            {photos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Diary Photo ${idx + 1}`}
                className="object-cover w-full h-full rounded-xl"
              />
            ))}
          </div>
        )
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      {renderPhotos()}
    </div>
  );
};

export default DiaryPhotos;
