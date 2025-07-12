//video.tsx
import React, {useState, useRef, useEffect} from "react";
import { Play } from 'lucide-react';
import { motion } from "framer-motion";


import { useGetVideo } from "../../api/queries/action/useGetVideo";
import type { VideoType } from "../../types/video";

const SAMPLE_DATA: VideoType[] = [
  {
    id: "_8i8j_r8QFU",
    title: "첫 번째 비디오 제목",
    description:
      "이것은 첫 번째 비디오에 대한 상세한 설명입니다. 여기에는 비디오의 내용, 제작자 정보, 그리고 기타 관련 정보들이 포함될 수 있습니다.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "두 번째 비디오 제목",
    description:
      "두 번째 비디오에 대한 설명입니다. 이 비디오는 다른 주제를 다루고 있으며, 사용자에게 유용한 정보를 제공합니다.",
  },
  {
    id: "jNQXAC9IVRw",
    title: "세 번째 비디오 제목",
    description: "마지막 비디오에 대한 설명입니다. 이 시리즈의 마무리를 담고 있습니다.",
  },
];


interface YouTubeFlipboardProps {
  videos?: VideoType[];  // Make videos optional to handle undefined cases
  autoPlay?: boolean;
  showControls?: boolean;
}

const YouTubeFlipboard: React.FC<YouTubeFlipboardProps> = ({
  videos = SAMPLE_DATA,  // Default to empty array if undefined
  autoPlay = false,
  showControls = true,
}) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 드래그 스크롤 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const lastMoveTime = useRef<number>(0);
  const lastX = useRef<number>(0);

  // YouTube 썸네일 URL 생성
  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // YouTube 임베드 URL 생성
  const generateYouTubeUrl = (videoId: string) => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      controls: showControls ? '1' : '0',
      showinfo: '0',
      fs: '1',
      iv_load_policy: '3',
    });

    if (autoPlay) {
      params.append('autoplay', '1');
      params.append('mute', '1');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  // 비디오 재생 핸들러
  const handlePlayClick = (videoId: string) => {
    setPlayingVideoId(videoId);
  };

  // Fallback if no videos
  if (videos.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-600">
        No videos available
      </div>
    );
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const now = Date.now();
      const timeDelta = now - lastMoveTime.current;
      const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 1.2; // 배율 조정
      
      // 속도 계산 (모멘텀 스크롤용)
      if (timeDelta > 0) {
        setDragVelocity((x - lastX.current) / timeDelta);
      }
      
      lastX.current = x;
      lastMoveTime.current = now;
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      // 모멘텀 스크롤 적용
      applyMomentumScroll();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, startX, scrollLeft]);

  // 모멘텀 스크롤 적용
  const applyMomentumScroll = () => {
    if (Math.abs(dragVelocity) > 0.1 && scrollContainerRef.current) {
      let velocity = dragVelocity * 100;
      const decay = 0.95;
      
      const momentum = () => {
        velocity *= decay;
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft -= velocity;
        }
        
        if (Math.abs(velocity) > 0.5) {
          requestAnimationFrame(momentum);
        }
      };
      
      requestAnimationFrame(momentum);
    }
    setDragVelocity(0);
  };

  // 마우스 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    lastMoveTime.current = Date.now();
    lastX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    setDragVelocity(0);
  };

  // 터치 이벤트는 기본 동작 유지 (더 자연스러운 스크롤)
  const handleTouchStart = (e: React.TouchEvent) => {
    // 터치 디바이스에서는 기본 스크롤 동작 사용
    e.stopPropagation();
  };

  
  if (videos.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-600">
        No videos available
      </div>
    );
  }


  return (
    <div className="w-full">
       <motion.div 
        ref={scrollContainerRef}
        className="w-full max-w-[90vw] overflow-x-auto hide-scrollbar mx-auto"
        style={{
          scrollbarWidth:'none', 
          msOverflowStyle:'none',
          scrollBehavior: isDragging ? 'auto' : 'smooth'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        >      
        <div className="flex space-x-4 p-4 shadow-xl">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex-shrink-0 min-w-[300px] bg-black rounded-3xl shadow-md overflow-hidden snap-center"
          >
            {/* 썸네일 */}
            <div className="relative">
              <img
                src={getThumbnailUrl(video.id)}
                alt={video.title}
                className="w-full h-[169px] object-cover rounded-3xl p-2"
              />
              {/* 재생 버튼 오버레이 */}
              <button
                onClick={() => handlePlayClick(video.id)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Play className="w-12 h-12 text-white" />
              </button>
            </div>

            {/* 비디오 정보 */}
            <div className="p-4">
              <h3 className="text-lg text-white font-semibold line-clamp-2 mb-2">{video.title}</h3>
            </div>

            {/* 임베드 플레이어 (재생 시 모달 또는 인라인 표시) */}
            {playingVideoId === video.id && (
              <div className="absolute inset-0 bg-black z-50">
                <iframe
                  className="w-full h-full"
                  src={generateYouTubeUrl(video.id)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  </div>
  );
};

export default YouTubeFlipboard;
