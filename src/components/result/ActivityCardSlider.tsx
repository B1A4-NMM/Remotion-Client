// components/ActivityCardSlider.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import ActivityCard from './ActivityCard'; // 컴포넌트는 일반 import
import { processActivityData } from '../../utils/activityCardUtils';

interface ActivityCardSliderProps {
  data: any;
}

const ActivityCardSlider: React.FC<ActivityCardSliderProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState('auto');
  const constraintsRef = useRef(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cards = processActivityData(data);
  const totalCards = cards.length;

  const backgroundColor = [
    'linear-gradient(to bottom ,rgb(74, 99, 124),rgb(105, 105, 105))', // 파란색
  ];

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (info.offset.x < -threshold && currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // 현재 카드 높이 측정
    useEffect(() => {
    const currentCard = cardRefs.current[currentIndex];
    if (currentCard) {
      const height = currentCard.offsetHeight;
      setContainerHeight(`${height + 100}px`); // 여백 포함
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full rounded-3xl">
      {/* 배경 - 동적 높이 적용 */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{ 
            background: backgroundColor,
            height: containerHeight }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* 카드 제목 */}
      <motion.div
        className="relative pt-8 pb-4 flex flex-col items-center justify-center z-10"
        key={currentIndex}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white/70 text-sm">
          {currentIndex + 1} / {totalCards}
        </p>
        <h1 className="text-white text-xl font-bold">
          {cards[currentIndex]?.activity || '활동'}
        </h1>
      </motion.div>

      {/* 카드 컨테이너 */}
      <div ref={constraintsRef} className="relative z-10">
        <motion.div
          className="flex items-start"
          style={{ width: `${totalCards * 100}%`, height:containerHeight  }}
          animate={{ x: `-${currentIndex * (100 / totalCards)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={constraintsRef}
          onDragEnd={handleDrag}
          dragElastic={0.3}
        >
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="w-full p-4 flex justify-center"
              ref={(el) => cardRefs.current[index] = el}
            >
              <div className="w-full max-w-md">
                <ActivityCard card={card} index={index} />
              </div>
            </div>
          ))}
        </motion.div>
        {/* 인디케이터 */}
        <div className="relative mb-8 flex justify-center gap-2">
            {cards.map((_, index) => (
            <motion.button
                key={index}
                className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            />
            ))}
        </div>
    
        {/* 좌우 네비게이션 힌트 - 카드 컨테이너 기준으로 위치 조정 */}
        <motion.div
            className="absolute left-4 text-white/50 z-20"
            style={{ top: 'calc(40% )'}} // 제목 높이 고려
            animate={{ opacity: currentIndex > 0 ? 1 : 0.3 }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        </motion.div>
    
        <motion.div
            className="absolute right-4 text-white/50 z-20"
            style={{ top: 'calc(40% )'}} // 제목 높이 고려
            animate={{ opacity: currentIndex < totalCards - 1 ? 1 : 0.3 }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
        </motion.div>
      </div>
  
    </div>
  );
};

export default ActivityCardSlider;
