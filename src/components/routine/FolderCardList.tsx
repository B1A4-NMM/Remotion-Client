import FolderCard from "@/components/routine/FolderCard";
import React, { useRef, useState, useEffect } from "react";
import gloomyFolder from "@/assets/img/gloomy.svg";
import angryFolder from "@/assets/img/angry.svg";
import tenseFolder from "@/assets/img/tense.svg";

interface FolderCardListProps {

    onFolderClick: (emotionTitle: string) => void;
}


const FolderCardList = ( { onFolderClick } : FolderCardListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentIndex,setCurrentIndex]= useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
  
    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
      setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };
  
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      const x = e.pageX - (scrollRef.current.offsetLeft || 0);
      const walk = (x - startX) * 1.5;
      scrollRef.current.scrollLeft = scrollLeft - walk;

      //currentIndex 계산 추가
      const itemWidth = 240 +16;
      const index = Math.round(scrollRef.current.scrollLeft / itemWidth );
      setCurrentIndex(index);
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    const handleTouchStart = (e: React.TouchEvent) => {
      // 모바일 터치 기본 동작 허용 + 중단 방지 X
      e.stopPropagation();
    };

    


    useEffect(() => {
        const container = scrollRef.current; 
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const itemWidth =240 +16; 
            const index =Math.round(scrollLeft/itemWidth);
            setCurrentIndex(index);
        };

        container.addEventListener("scroll",handleScroll);
        return () => container.removeEventListener("scroll",handleScroll);

    }, []);
  
    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
  
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);
  
    const folderData = [
      {
        emotionKey : "depression",
        title: "우울 루틴",
        subtitle: "우울할 땐\n이렇게 해보는게 어때요?",
        imageSrc: gloomyFolder,
      },
      {
        emotionKey: "anxiety",
        title: "불안 루틴",
        subtitle: "불안 할 땐\n이렇게 해보는게 어때요?",
        imageSrc: angryFolder,
      },
      {
        emotionKey: "stress",
        title: "스트레스 루틴",
        subtitle: "스트레스 받을 땐\n이렇게 해보는게 어때요?",
        imageSrc: tenseFolder,
      },
    ];

    return (
        <div className="overflow-x-auto pb-[30px] relative">
          <div
            ref={scrollRef}
            className="flex gap-4 px-4 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
            {folderData.map((folder, idx) => (
            <div
            key={idx}
            className={`${
            idx === 0 ? "ml-4" : idx === folderData.length - 1 ? "mr-4" : ""
            }`}
          >
    <FolderCard
      {...folder}
      onClick={() => onFolderClick(folder.emotionKey)}
    />
  </div>
))}
          </div>

    
          {/* 하단 인디케이터 */}
          <div className="absolute left-1/2 bottom-[12px] transform -translate-x-1/2 flex gap-2">
            {folderData.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex === i ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      ); 
   
  };
  
  export default FolderCardList;