import { useRef, useState, useEffect } from "react";

const useCardSlider = (numSlides: number) => {
  const [curSlide, setCurSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const diff = useRef(0);

  const distOfLetGo = 80;

  const goToSlide = (index: number) => {
    if (animating || index < 0 || index >= numSlides) return;
    setAnimating(true);
    setCurSlide(index);
    setTimeout(() => setAnimating(false), 600);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX.current = e.touches[0].clientX;
      diff.current = startX.current - currentX.current;
    };

    const handleTouchEnd = () => {
      if (diff.current > distOfLetGo) goToSlide(curSlide + 1);
      else if (diff.current < -distOfLetGo) goToSlide(curSlide - 1);
      diff.current = 0;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [curSlide]);

  return { curSlide, containerRef, goToSlide, animating };
};

export default useCardSlider;
