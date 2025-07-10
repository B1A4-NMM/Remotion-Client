//YoutubeFlipboard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Info, X } from 'lucide-react';
import type { VideoType} from '../../types/video'


interface YouTubeFlipboardProps {
  videos: VideoType[] ;
  autoPlay?: boolean;
  showControls?: boolean;
}

const YouTubeFlipboard: React.FC<YouTubeFlipboardProps> = ({
  videos,
  autoPlay = false,
  showControls = true
}) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  // 안전한 접근을 위한 방어 코드
  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-xl mb-2">📹</div>
          <div>추천 영상이 없습니다</div>
        </div>
      </div>
    );
  }

  // 현재 인덱스가 유효한지 확인
  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, videos.length - 1));
  const currentVideo = videos[safeCurrentIndex];

  // currentVideo가 유효한지 확인
  if (!currentVideo || !currentVideo.id) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-xl mb-2">⚠️</div>
          <div>영상 정보를 불러올 수 없습니다</div>
        </div>
      </div>
    );
  }

  const [scale, setScale] = useState(1);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [VideoError, setVideoError] = useState(false);

  useEffect(()=>{
    const updateScale=()=>{
      const screenRatio = window.innerHeight/window.innerWidth;
      const videoRatio = 9/16; //16:9 세로 비율

      if(screenRatio>videoRatio){
        setScale(window.innerWidth/1920); //세로가 더 길면 영상 확대 
        }
      };

      updateScale();
      window.addEventListener('resize', updateScale);
      return ()=>window.removeEventListener('resize',updateScale);
  }, []);

  // 위아래 네비게이션
  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // 터치/마우스 이벤트 처리 (세로 드래그)
  const handleStart = (clientY: number) => {
    if (isTransitioning) return;
    isDragging.current = true;
    startY.current = clientY;
  };

  const handleEnd = (clientY: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diffY = startY.current - clientY;
    const threshold = 100;

    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        // 위로 스와이프 = 다음 영상
        goToNext();
      } else {
        // 아래로 스와이프 = 이전 영상
        goToPrevious();
      }
    }
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  
  // YouTube URL 생성 함수
  const generateYouTubeUrl = (videoId: string) => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      controls: '0',
      showinfo: '0',
      fs: '1', // 전체화면 허용
      iv_load_policy: '3', // 어노테이션 비활성화
    });

    // autoPlay가 true일 때만 관련 파라미터 추가
    if (autoPlay) {
      params.append('autoplay', '1');
      params.append('mute', '1');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 메인 비디오 컨테이너 - 전체 화면 */}
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black"
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseUp={(e) => handleEnd(e.clientY)}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientY)}
      >
        {/* 수정된 YouTube iframe */}
        <div className="relative w-full h-full">
          <iframe
            key={currentVideo.id} // 영상 변경 시 iframe 재생성
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}
            src={generateYouTubeUrl(currentVideo.id)}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onLoad={()=>setIsVideoLoading(false)}
            onError={()=>setVideoError(true)}
            allowFullScreen
            style={{
              border: 'none',
              // 세로 화면에서 영상 중앙 정렬
              transform: 'scale(${scale})', // 필요에 따라 조정
              transformOrigin: 'center center'
            }}
          />
        </div>

        {/*로딩 오버레이 */}
        {isVideoLoading &&(
          <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white">영상 로딩 중...</div>
        </div>
        )}

        {/*에러 오버레이 */}
        {VideoError &&(
          <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-xl mb-2">⚠️</div>
            <div>영상을 불러올 수 없습니다</div>
          </div>
        </div>
        )}

        {/* 세로 네비게이션 버튼 */}
        {showControls && videos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:opacity-50 z-10"
            >
              <ChevronUp size={24} />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute top-16 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:opacity-50 z-10"
            >
              <ChevronDown size={24} />
            </button>
          </>
        )}

        {/* 비디오 인덱스 인디케이터 */}
        {videos.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
            {currentIndex + 1} / {videos.length}
          </div>
        )}

        {/*세로 액션 버튼 */}
        <div className="absolute right-4 bottom-32 z-20">
          <div className="flex flex-col space-y-4">
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all w-14 h-14 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all w-14 h-14 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all w-14 h-14 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 하단 정보 영역 - 오버레이 스타일 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-60">
          {/* 그라데이션 배경 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="relative p-6 pb-8">
            <div className="flex items-start">
              <div className="flex-1 min-w-0 pr-20"> {/* pr-20으로 오른쪽 여백 추가 */}
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {currentVideo.title}
                </h3>
                
                {/* 설명 미리보기 */}
                <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                  {currentVideo.description}
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* 스와이프 힌트 */}
        {/* <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/60 text-sm z-10 animate-bounce">
          ↕ 스와이프하여 영상 전환
        </div> */}
      </div>
    </div>
  );
};

export default YouTubeFlipboard;
