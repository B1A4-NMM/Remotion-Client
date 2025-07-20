// src/components/result/DiaryPhotos.tsx

import React from "react";

interface DiaryPhotosProps {
  photos: string[]; // s3 URL 배열이라고 가정
}

const DiaryPhotos: React.FC<DiaryPhotosProps> = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  const renderPhotos = () => {
    switch (photos.length) {
      case 1:
        return (
          <div className="w-full h-[332px]">
            <img
              src={photos[0]}
              alt="Diary Photo"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        );
      case 2:
        return (
          <div className="h-[332px] space-y-3">
            {photos.map((url, idx) => (
              <div key={idx} className="h-[160px]">
                <img
                  src={url}
                  alt={`Diary Photo ${idx}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="h-[332px] flex flex-col justify-between">
            {/* 상단 2개 - 고정 높이 */}
            <div className="grid grid-cols-2 gap-2 h-[160px]">
              {photos.slice(1).map((url, idx) => (
                <div key={idx + 1} className="h-[160px] w-full">
                  <img
                    src={url}
                    alt={`Diary Photo ${idx + 2}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* 하단 한개 - 고정 높이 */}
            <div className="h-[160px] w-full">
              <img
                src={photos[0]}
                alt="Diary Photo 1"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="h-[332px] grid grid-cols-2 gap-2">
            {photos.map((url, idx) => (
              <div key={idx} className="h-[160px]">
                <img
                  src={url}
                  alt={`Diary Photo ${idx + 1}`}
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-[#181718] rounded-2xl overflow-hidden shadow-lg p-[10px]">
        {renderPhotos()}
      </div>
    </div>
  );
};

export default DiaryPhotos;
