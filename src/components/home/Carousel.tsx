import React, { useState, useRef } from "react";

interface CarouselProps {
  items: React.ReactNode[];
}

const CARD_WIDTH_PERCENT = 85;

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

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

  return (
    <div className="w-full max-w-[280px]  overflow-visible">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex transition-transform duration-300 gap-3"
          style={{
            transform: `translateX(-${current * CARD_WIDTH_PERCENT}%)`,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                width: `${CARD_WIDTH_PERCENT}%`,
                minWidth: `${CARD_WIDTH_PERCENT}%`,
                maxWidth: `${CARD_WIDTH_PERCENT}%`,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-3 gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${current === idx ? "bg-gray-800" : "bg-gray-300"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
