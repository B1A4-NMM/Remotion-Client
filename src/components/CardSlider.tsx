import React, { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import StrengthCard from "./aboutMe/StrengthCard";
import EmotionCard from "./aboutMe/EmotionCard";
import AchievementCard from "./aboutMe/AchievementCard";
import MentalHealthCard from "./aboutMe/MentalHealthCard";
type CardComponentProps = {
  isActive: boolean;
};
const components: {
  Component: React.ComponentType<CardComponentProps>;
  bgColor: string;
}[] = [
  { Component: MentalHealthCard, bgColor: "bg-gray-700" },
  { Component: StrengthCard, bgColor: "bg-gray-600" },
  { Component: EmotionCard, bgColor: "bg-gray-500" },
  // { Component: AchievementCard, bgColor: "bg-blue-100" },
];

const CardSlider = () => {
  const [curSlide, setCurSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const distOfLetGo = 80;

  const isInsideDropZone = (target: EventTarget | null): boolean => {
    return (target as HTMLElement)?.closest?.("[data-drop-zone]") !== null;
  };

  const handleStart = (x: number, target: EventTarget | null) => {
    if ((target as HTMLElement)?.closest?.("[data-drop-zone]")) {
      isDragging.current = false;
      return;
    }
    if (isTransitioning) return;
    isDragging.current = true;
    startX.current = x;
    setDragOffset(0);
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= components.length || isTransitioning) return;
    setIsTransitioning(true);
    setCurSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const nextSlide = () => goToSlide((curSlide + 1) % components.length);
  const prevSlide = () => goToSlide(curSlide === 0 ? components.length - 1 : curSlide - 1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (x: number) => {
      if (!isDragging.current || isTransitioning) return;
      const diff = x - startX.current;
      setDragOffset(diff);
    };

    const handleEnd = () => {
      if (!isDragging.current || isTransitioning) return;
      isDragging.current = false;

      if (dragOffset > distOfLetGo) {
        prevSlide();
      } else if (dragOffset < -distOfLetGo) {
        nextSlide();
      }

      setDragOffset(0);
    };

    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest?.("[data-drop-zone]")) return;
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.target);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.("[data-drop-zone]")) return;
      e.preventDefault();
      handleStart(e.clientX, e.target);
    };
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [curSlide, dragOffset, isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing select-none "
    >
      <div className="absolute inset-0 flex pt-8 justify-center px-4 md:px-8">
        {components.map(({ Component, bgColor }, index) => {
          const offset = index - curSlide;
          const isActive = offset === 0;
          const isNext = offset === 1;
          const isPrev = offset === -1;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          const dragInfluence = isDragging.current ? dragOffset * 0.1 : 0;
          const dragRotation = isDragging.current ? dragOffset * 0.03 : 0;

          let scale = 1;
          let translateY = 0;
          let translateX = 0;
          let rotateY = 0;
          let zIndex = 10;

          if (isActive) {
            scale = 1;
            translateY = dragInfluence;
            translateX = dragOffset * 0.4;
            rotateY = dragRotation;
            zIndex = 20;
          } else if (isNext) {
            scale = 0.9;
            translateY = 30;
            translateX = 60 + dragInfluence;
            rotateY = 10 + dragRotation;
            zIndex = 15;
          } else if (isPrev) {
            scale = 0.9;
            translateY = 30;
            translateX = -60 + dragInfluence;
            rotateY = -10 + dragRotation;
            zIndex = 15;
          } else {
            scale = 0.8 - Math.abs(offset) * 0.1;
            translateY = 40 + Math.abs(offset) * 15;
            translateX = offset * 100;
            rotateY = offset * 20;
            zIndex = 10 - Math.abs(offset);
          }

          return (
            <div
              key={index}
              className={clsx(
                "absolute transition-all duration-500 ease-out rounded-3xl shadow-xl",
                bgColor
              )}
              style={{
                width: "95%",
                maxWidth: "26rem",
                height: "86vh",
                zIndex,
                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${isActive ? 0 : 3}deg)`,
              }}
            >
              <div className="w-full h-full overflow-y-auto">
                <Component isActive={index === curSlide} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30">
        {components.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="relative group transition-transform duration-200 hover:scale-110"
          >
            <div
              className={clsx(
                "w-3 h-3 rounded-full border-2 border-black/50 transition-all duration-300",
                curSlide === i ? "bg-black shadow-lg" : "bg-transparent hover:bg-black/30"
              )}
            />
          </button>
        ))}
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-black/50 text-sm z-30 md:hidden animate-pulse">
        ← Swipe to navigate →
      </div>
    </div>
  );
};

export default CardSlider;
