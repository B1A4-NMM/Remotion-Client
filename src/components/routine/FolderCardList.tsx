import FolderCard from "@/components/routine/FolderCard";
import React,{ useRef, useState, useEffect } from "react";

import gloomyFolder from "@/assets/img/gloomy.svg";
import angryFolder from "@/assets/img/angry.svg";
import tenseFolder from "@/assets/img/tense.svg";


const FolderCardList = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
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
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    const handleTouchStart = (e: React.TouchEvent) => {
      // 모바일 터치 기본 동작 허용 + 중단 방지 X
      e.stopPropagation();
    };
  
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
      <div className="overflow-x-auto px-[18px] pb-[30px] ">
        <div
          ref={scrollRef}
          className="flex space-x-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
        >
          {folderData.map((folder, idx) => (
            <FolderCard key={idx} {...folder} />
          ))}
        </div>
      </div>
    );
  };
  
  export default FolderCardList;