import FolderCard from "@/components/routine/FolderCard";
import React,{ useRef, useState, useEffect } from "react";
import gloomyFolder from "@/assets/img/gloomy.svg";
import angryFolder from "@/assets/img/angry.svg";
import tenseFolder from "@/assets/img/tense.svg";


const FolderCardList = () => {
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
        title: "우울 루틴",
        subtitle: "우울할 땐\n이렇게 해보는게 어때요?",
        imageSrc: gloomyFolder,
      },
      {
        title: "분노 루틴",
        subtitle: "화가 날 땐\n이렇게 해보는게 어때요?",
        imageSrc: angryFolder,
      },
      {
        title: "긴장 루틴",
        subtitle: "긴장될 땐\n이렇게 해보는게 어때요?",
        imageSrc: tenseFolder,
      },
    ];
  
    return (
      <div className="overflow-x-auto pb-[30px] relative">
        {/* 카드 리스트
            srcollbar-hide가 아니라
            hide-scrollbar => 우리가 app.css에 추가한
            클래스 기준으로 
        */}
        <div
          ref={scrollRef}
          className="flex space-x-4 px-[18px] overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
        >
          {folderData.map((folder, idx) => (
            <FolderCard key={idx} {...folder} />
          ))}
        </div>

        {/* 하단 동그란 인디케이터 */}
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