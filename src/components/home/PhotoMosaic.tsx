// src/components/photos/PhotoMosaic.tsx
import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface PhotoMosaicProps {
  photos: string[];
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// 3열 고정 레이아웃에서 각 사진의 위치를 결정하는 함수
const getLayoutPosition = (index: number, totalPhotos: number) => {
    // 9개 단위로 패턴 반복
    const cyclePosition = index % 9;
    const cycleStart = Math.floor(index / 9) * 9;
    const cycleTotal = Math.min(totalPhotos - cycleStart, 9);
    
    // 각 사이클의 기본 행 시작점 (5행씩 사용)
    const baseRow = Math.floor(index / 9) * 5 + 1;
    
    if (cycleTotal <= 2) {
      // 1~2개: 모두 1x1, 순차 배치
      const col = (cyclePosition % 3) + 1;
      const row = Math.floor(cyclePosition / 3) + baseRow;
      return {
        gridColumn: `${col}`,
        gridRow: `${row}`,
        aspectRatio: "1/1"
      };
    } else if (cycleTotal === 3) {
      // 3개: 첫 번째만 2x2 (왼쪽 상단)
      if (cyclePosition === 0) {
        return {
          gridColumn: "1 / 3", // 1~2열 차지
          gridRow: `${baseRow} / ${baseRow + 2}`, // 2행 차지
          aspectRatio: "1/1"
        };
      } else {
        // 나머지는 1x1
        const positions = [
          { col: 3, row: baseRow },     // 1번째: (3,1)
          { col: 3, row: baseRow + 1 }  // 2번째: (3,2)
        ];
        const pos = positions[cyclePosition - 1];
        return {
          gridColumn: `${pos.col}`,
          gridRow: `${pos.row}`,
          aspectRatio: "1/1"
        };
      }
    } else if (cycleTotal >= 4 && cycleTotal <= 8) {
      // 4~8개: 첫 번째만 2x2, 나머지는 1x1
      if (cyclePosition === 0) {
        return {
          gridColumn: "1 / 3",
          gridRow: `${baseRow} / ${baseRow + 2}`,
          aspectRatio: "1/1"
        };
      } else {
        // 1x1 위치들 (2x2를 피해서 배치)
        const positions = [
          { col: 3, row: baseRow },     // 1번: (3,1)
          { col: 3, row: baseRow + 1 }, // 2번: (3,2)  
          { col: 3, row: baseRow + 2 }, // 3번: (3,3)
          { col: 2, row: baseRow + 2 }, // 4번: (2,3)
          { col: 1, row: baseRow + 2 }, // 5번: (1,3)
          { col: 1, row: baseRow + 3 }, // 6번: (1,4)
          { col: 2, row: baseRow + 3 }  // 7번: (2,4)
        ];
        const pos = positions[Math.min(cyclePosition - 1, positions.length - 1)];
        return {
          gridColumn: `${pos.col}`,
          gridRow: `${pos.row}`,
          aspectRatio: "1/1"
        };
      }
    } else {
      // 9개: 2개의 2x2와 7개의 1x1
      if (cyclePosition === 0) {
        // 첫 번째 2x2: 왼쪽 상단
        return {
          gridColumn: "1 / 3",
          gridRow: `${baseRow} / ${baseRow + 2}`,
          aspectRatio: "1/1"
        };
      } else if (cyclePosition === 7) {
        // 두 번째 2x2: 우측 하단
        return {
          gridColumn: "2 / 4",
          gridRow: `${baseRow + 3} / ${baseRow + 5}`,
          aspectRatio: "1/1"
        };
      } else {
        // 나머지 1x1 사진들 (2x2 사이에 3개 이상의 1x1로 분리)
        const positions = [
          { col: 3, row: baseRow },       // 1번: (3,1) 
          { col: 3, row: baseRow + 1 },   // 2번: (3,2)
          { col: 3, row: baseRow + 2 },   // 3번: (3,3) 
          { col: 2, row: baseRow + 2 },   // 4번: (2,3)
          { col: 1, row: baseRow + 2 },   // 5번: (1,3)
          { col: 1, row: baseRow + 3 },   // 6번: (1,4)
          { col: 1, row: baseRow + 4 }    // 8번: (1,5) ← 9번째 사진 위치 수정
        ];
        
        // cyclePosition 1,2,3,4,5,6,8을 positions 인덱스로 매핑
        const posMap = [1,2,3,4,5,6,8];
        const posIndex = posMap.indexOf(cyclePosition);
        const pos = positions[posIndex] || positions[0];
        
        return {
          gridColumn: `${pos.col}`,
          gridRow: `${pos.row}`,
          aspectRatio: "1/1"
        };
      }
    }
  };
  

const PhotoMosaic: React.FC<PhotoMosaicProps> = ({
  photos,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}) => {

    const navigator = useNavigate();
    const handleOnClick=(diaryId:number)=>{
        navigator(`/result/${diaryId}?view=record`);
    }


  const observer = useRef<IntersectionObserver | null>(null);
  const lastPhotoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, onLoadMore]
  );

  // 전체 사진 개수에 따른 그리드 행 수 계산
  const totalRows = Math.ceil(photos.length / 9) * 5;

  return (
    <div className="p-4">
      {/* 모자이크 그리드 - 3열 고정 */}
      <div 
        className="grid gap-2"
        style={{ 
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: `repeat(${totalRows}, minmax(120px, 1fr))`
        }}
      >
        {photos.map((photo, index) => {
          const position = getLayoutPosition(index, photos.length);
          const isLast = index === photos.length - 1;
          
          return (
            <div
              key={`${photo}-${index}`}
              ref={isLast ? lastPhotoRef : null}
              className="relative w-full h-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
              style={{
                gridColumn: position.gridColumn,
                gridRow: position.gridRow,
                aspectRatio: position.aspectRatio,
              }}
              onClick={() => {
                handleOnClick(photo.diaryId);
              }}
            >
              <img
                src={photo.photoUrl}
                alt={`사진 ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.png";
                }}
              />
              
              {/* 호버 시 오버레이 효과 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 로딩 스켈레톤 */}
      {isFetchingNextPage && (
        <div className="grid gap-2 mt-4" 
             style={{
               gridTemplateColumns: "repeat(3, 1fr)",
               gridTemplateRows: "repeat(5, minmax(150px, 1fr))"
             }}>
          {Array.from({ length: 6 }).map((_, index) => {
            const position = getLayoutPosition(index, 6);
            return (
              <div
                key={`skeleton-${index}`}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                style={{
                  gridColumn: position.gridColumn,
                  gridRow: position.gridRow,
                  aspectRatio: position.aspectRatio,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 사진이 없을 때 */}
      {photos.length === 0 && !isFetchingNextPage && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            아직 사진이 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            일기를 작성하면서 사진을 추가해보세요!
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoMosaic;
