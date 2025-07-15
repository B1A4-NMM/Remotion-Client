import React, {useState, useRef, useEffect} from "react";
import { Play } from 'lucide-react';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useGetVideo } from "../../api/queries/action/useGetVideo";
import type { VideoType } from "../../types/video";

const SAMPLE_DATA: VideoType[] = [
  {
    videoId: "_8i8j_r8QFU",
    emotion: "이것은 첫 번째 비디오에 대한 상세한 설명입니다. 여기에는 비디오의 내용, 제작자 정보, 그리고 기타 관련 정보들이 포함될 수 있습니다.",
    message: "비디오 예제"
  },
  {
    videoId: "dQw4w9WgXcQ",
    emotion: "두 번째 비디오에 대한 설명입니다. 이 비디오는 다른 주제를 다루고 있으며, 사용자에게 유용한 정보를 제공합니다.",
    message: "비디오 예제"
  },
  {
    videoId: "jNQXAC9IVRw",
    emotion: "마지막 비디오에 대한 설명입니다. 이 시리즈의 마무리를 담고 있습니다.",
    message: "비디오 예제"
  },
];

interface YouTubeBoardProps {
  videos?: VideoType[];
  autoPlay?: boolean;
  showControls?: boolean;
}

const YouTubeBoard: React.FC<YouTubeBoardProps> = ({}) => {
  // ✅ 모든 Hook을 컴포넌트 최상단에 배치
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const lastMoveTime = useRef<number>(0);
  const lastX = useRef<number>(0);
  
  const token = localStorage.getItem("accessToken") ?? "";
  const { data, isLoading, isError } = useGetVideo(token);

  const navigate=useNavigate();

  // ✅ useEffect를 항상 같은 순서로 호출
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const now = Date.now();
      const timeDelta = now - lastMoveTime.current;
      const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 1.2;
      
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

  // ✅ 비디오 데이터 결정 로직
  const getVideos = (): VideoType[] => {
    if (isLoading) return [];
    if (isError) return SAMPLE_DATA;
    if (data && Array.isArray(data?.videoId) && data?.videoId.length > 0) {
      return data.videoId;
    }
    return SAMPLE_DATA;
  };

  const videos = getVideos();

  // YouTube 썸네일 URL 생성
  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

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
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    lastMoveTime.current = Date.now();
    lastX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    setDragVelocity(0);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleVideoClick = (videoId: string) => {
    sessionStorage.setItem('selectedVideo', JSON.stringify(videoId));
    navigate('/video');  
  };

  // ✅ 조건부 렌더링 (early return 대신)
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">비디오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">알림</p>
          <p>비디오 데이터를 불러오는데 실패했습니다. 샘플 데이터를 표시합니다.</p>
        </div>
        {renderVideoBoard(videos)}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-600">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">비디오가 없습니다</p>
          <p className="text-sm">추천할 비디오가 준비되면 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  return renderVideoBoard(videos);

  // 비디오 보드 렌더링 함수
  function renderVideoBoard(videoList: VideoType[]) {
    return (
      <div className="w-full">
        <motion.div 
          ref={scrollContainerRef}
          className="w-full max-w-[90vw] overflow-x-auto hide-scrollbar mx-auto"
          style={{
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: isDragging ? 'auto' : 'smooth'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >      
          <div className="flex space-x-4 p-4 shadow-xl">
            {videoList.map((videoId) => (
              <div
                key={videoId}
                className="flex-shrink-0 min-w-[300px] bg-black rounded-3xl shadow-md overflow-hidden snap-center"
              >
                <div className="relative">
                  <img
                    src={getThumbnailUrl(videoId)}
                    className="w-full h-[169px] object-cover rounded-3xl p-2"
                    alt={"Video thumbnail"}
                  />
                  <div 
                    onClick={() => handleVideoClick(videoId)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="p-2 flex justify-between pl-3 pr-3">
                  <div className="flex justify-start gap-3">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="13" cy="13" r="13" fill="#FAF6F4"/>
                    </svg>
                  </div>
                  <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00024 3.5C1.17162 3.5 0.5 2.82876 0.5 2C0.5 1.17173 1.17162 0.5 2.00024 0.5C2.82838 0.5 3.5 1.17173 3.5 2C3.5 2.82876 2.82838 3.5 2.00024 3.5" fill="white"/>
                    <path d="M1.99976 8.5C1.17162 8.5 0.5 7.82876 0.5 7C0.5 6.17173 1.17162 5.5 1.99976 5.5C2.82838 5.5 3.5 6.17173 3.5 7C3.5 7.82876 2.82838 8.5 1.99976 8.5" fill="white"/>
                    <path d="M1.99976 13.5C1.17162 13.5 0.5 12.8288 0.5 12C0.5 11.1717 1.17162 10.5 1.99976 10.5C2.82838 10.5 3.5 11.1717 3.5 12C3.5 12.8288 2.82838 13.5 1.99976 13.5" fill="white"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }
};

export default YouTubeBoard;
