import React, { useState, useRef } from "react";

interface CarouselProps {
  items: React.ReactNode[];
}

const CARD_WIDTH_PERCENT = 75; // 메인 카드가 더 돋보이도록 조정
const CARD_WIDTH_PERCENT_SINGLE = 100; // 카드가 1개일 때는 100% 너비
const GAP_SIZE = 16; // 카드 간 간격 (px)

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  // 마우스 드래그 지원을 위한 ref 추가
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // 터치 이벤트 (모바일)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy) {
      isSwiping.current = true;
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50 && current > 0) setCurrent(current - 1);
    if (diff < -50 && current < items.length - 1) setCurrent(current + 1);
    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  };

  // 마우스 이벤트 (웹/데스크탑)
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    const diff = e.clientX - mouseStartX.current;
    if (diff > 50 && current > 0) setCurrent(current - 1);
    if (diff < -50 && current < items.length - 1) setCurrent(current + 1);
    mouseStartX.current = null;
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    mouseStartX.current = null;
    isDragging.current = false;
  };

  // 카드 개수에 따른 너비 결정
  const cardWidthPercent = items.length === 1 ? CARD_WIDTH_PERCENT_SINGLE : CARD_WIDTH_PERCENT;

  // 현재 카드를 중앙에 배치하는 transform 계산
  const getTransform = () => {
    // 카드가 1개일 때는 transform 적용하지 않음
    if (items.length === 1) {
      return `translateX(0%)`;
    }

    // 첫 번째 카드일 때는 transform 적용하지 않음
    if (current === 0) {
      return `translateX(0%)`;
    }

    // 컨테이너 중앙에서 카드의 중앙을 맞추기 위한 계산
    const containerCenter = 50; // 컨테이너의 50% 지점
    const cardCenter = cardWidthPercent / 2; // 카드의 중앙점

    // 각 카드가 컨테이너 중앙에 오도록 계산
    const baseOffset = containerCenter - cardCenter;
    const cardSpacing = cardWidthPercent + (GAP_SIZE / 280) * 100;

    return `translateX(${baseOffset - current * cardSpacing}%)`;
  };

  return (
    <div className="w-full overflow-visible relative">
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: "pan-y", cursor: isDragging.current ? "grabbing" : "grab" }}
      >
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: getTransform(),
            gap: `${GAP_SIZE}px`,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 transition-all duration-300 ${
                idx === current ? "opacity-100 scale-100" : "opacity-60 scale-95"
              }`}
              style={{
                width: `${cardWidthPercent}%`,
                minWidth: `${cardWidthPercent}%`,
                maxWidth: `${cardWidthPercent}%`,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 - 전체 컨테이너 기준으로 가운데 정렬 */}
      {items.length > 1 && (
        <div className="absolute bottom-[-32px] left-1/2 transform -translate-x-1/2 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full ${current === idx ? "bg-gray-800" : "bg-gray-300"}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
