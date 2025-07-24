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
          <div className="w-full aspect-square">
            <img
              src={photos[0]}
              alt="Diary Photo 1"
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        );

      case 2:
        return (
          <div className="w-full aspect-square grid grid-rows-2 gap-2">
            {photos.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Diary Photo ${idx + 1}`}
                  className="object-cover w-full h-full rounded-xl"
                />
            ))}
          </div>
        );

      case 3:
        return (
          <div className="w-full grid grid-rows-[1fr_1fr] gap-1">
            {/* Row 1: Two square images side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square w-full">
                <img
                  src={photos[0]}
                  alt="Diary Photo 1"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
              <div className="aspect-square w-full">
                <img
                  src={photos[1]}
                  alt="Diary Photo 2"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>

            {/* Row 2: One image full width, matching height of above images */}
            <div className="w-full aspect-[2/1]">
              <img
                src={photos[2]}
                alt="Diary Photo 3"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-full aspect-square grid grid-cols-2 gap-2">
            {photos.map((url, idx) => (
              <div key={idx} className="w-full aspect-square">
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
