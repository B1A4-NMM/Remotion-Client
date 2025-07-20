import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, X, Maximize, Play, Pause } from 'lucide-react';
import { Link } from "react-router-dom";

interface VideoNavigationData {
  videoIds: string[];
  selectedVideoId: string;
  emotion: string;
  message: string;
}

interface YouTubeFlipboardProps {
  videos?: string | string[];
  autoPlay?: boolean;
  showControls?: boolean;
}

interface VideoInfo {
  id: string;
  description?: string;
}

const isValidYouTubeId = (id: string): boolean => {
  const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return youtubeIdRegex.test(id);
};

const normalizeVideos = (videoData: string | string[], message?: string): VideoInfo[] => {
  if (!videoData) return [];
  
  const videoIds = Array.isArray(videoData) ? videoData : [videoData];
  
  return videoIds
    .filter(id => id && typeof id === 'string' && id.trim() !== '')
    .map(id => id.trim())
    .filter(id => isValidYouTubeId(id))
    .map(id => ({
      id: id,
      description: message || 'Recommended Video'
    }));
};

const formatTime = (timeInSeconds: number): string => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const YouTubeFlipboard: React.FC<YouTubeFlipboardProps> = ({
  videos,
  autoPlay = false,
  showControls = true
}) => {
  const [videoData, setVideoData] = useState<VideoNavigationData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);
  
  // ✅ 플레이어 초기화 방지 플래그
  const isInitializingRef = useRef(false);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("videoData");
    if (savedData) {
      try {
        const parsedData: VideoNavigationData = JSON.parse(savedData);
        setVideoData(parsedData);
        
        const selectedIndex = parsedData.videoIds.findIndex(
          id => id === parsedData.selectedVideoId
        );
        if (selectedIndex !== -1) {
          setCurrentIndex(selectedIndex);
        }
      } catch (error) {
        console.error("Failed to parse video data:", error);
      }
    }
  }, []);

  const finalVideos = videoData?.videoIds || videos;
  const finalMessage = videoData?.message;
  
  const normalizedVideos = normalizeVideos(finalVideos, finalMessage);
  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, normalizedVideos.length - 1));
  const currentVideo = normalizedVideos[safeCurrentIndex];

  // ✅ API 로드 (한 번만)
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      setApiLoaded(true);
      return;
    }

    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script');
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      setApiLoaded(true);
    };

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []); // ✅ 빈 의존성 배열

  // ✅ 플레이어 이벤트 핸들러들 (메모이제이션)
  const onPlayerReady = useCallback((event: any) => {
    setIsPlayerReady(true);
    playerInstanceRef.current = event.target;
    
    if (!player) {
      setPlayer(event.target);
    }
    
    setTimeout(() => {
      try {
        const videoDuration = event.target.getDuration();
        if (videoDuration > 0) {
          setDuration(videoDuration);
        }
      } catch (error) {
        console.error('Duration 가져오기 실패:', error);
      }
    }, 1000);
    
    if (autoPlay) {
      event.target.playVideo();
    }
  }, [player, autoPlay]);

  const onPlayerStateChange = useCallback((event: any) => {
    const YT = (window as any).YT;
    
    // ✅ 상태 변경 로그 최소화
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTracking();
    } else if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTracking();
    } else if (event.data === YT.PlayerState.ENDED) {
      setIsPlaying(false);
      stopProgressTracking();
      setProgress(1);
      if (normalizedVideos.length > 1) {
        setTimeout(() => goToNext(), 1000);
      }
    }
    // ✅ BUFFERING 상태에서는 아무것도 하지 않음 (무한 루프 방지)
  }, [normalizedVideos.length]);

  const onPlayerError = useCallback((event: any) => {
    console.error('YouTube Player Error:', event.data);
  }, []);

  // ✅ 플레이어 초기화 (한 번만 실행되도록 개선)
  useEffect(() => {
    if (!apiLoaded || !playerRef.current || normalizedVideos.length === 0 || 
        isInitializingRef.current || playerInstanceRef.current) {
      return;
    }

    isInitializingRef.current = true;
    
    try {
      const newPlayer = new (window as any).YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: normalizedVideos[safeCurrentIndex]?.id,
        playerVars: {
          autoplay: 0, // ✅ 자동재생 비활성화로 안정성 향상
          controls: 0,
          rel: 0,
          fs: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError,
        }
      });
      
      playerInstanceRef.current = newPlayer;
      
    } catch (error) {
      console.error('플레이어 초기화 실패:', error);
      isInitializingRef.current = false;
    }
  }, [apiLoaded, normalizedVideos.length]); // ✅ 의존성 최소화

  // ✅ 비디오 변경 (인덱스 변경시에만)
  useEffect(() => {
    if (!playerInstanceRef.current || !currentVideo) return;
    
    try {
      playerInstanceRef.current.loadVideoById(currentVideo.id);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    } catch (error) {
      console.error('비디오 로드 실패:', error);
    }
  }, [currentIndex]); // ✅ currentIndex에만 의존

  // ✅ 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') goToPrevious();
      else if (e.key === 'ArrowDown') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ✅ Progress tracking (안정화)
  const startProgressTracking = useCallback(() => {
    if (!playerInstanceRef.current || progressIntervalRef.current) return;
    
    progressIntervalRef.current = setInterval(() => {
      const player = playerInstanceRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;

      try {
        const current = player.getCurrentTime();
        const total = player.getDuration();
        
        if (total > 0) {
          setCurrentTime(current);
          setDuration(total);
          setProgress(current / total);
        }
      } catch (error) {
        // 에러 무시
      }
    }, 1000); // ✅ 1초 간격으로 안정성 향상
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const togglePlay = () => {
    const player = playerInstanceRef.current;
    if (!player || !isPlayerReady) return;
    
    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (error) {
      console.error('재생/정지 실패:', error);
    }
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const player = playerInstanceRef.current;
    if (!player || !isPlayerReady || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = duration * seekPosition;
    
    if (duration > 0) {
      try {
        player.seekTo(seekTime, true);
        setProgress(seekPosition);
        setCurrentTime(seekTime);
      } catch (error) {
        console.error('Seek 실패:', error);
      }
    }
  };

  const toggleFullScreen = () => {
    const player = playerInstanceRef.current;
    if (player && typeof player.getIframe === 'function') {
      const iframe = player.getIframe();
      if (iframe) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          iframe.requestFullscreen();
        }
      }
    }
  };

  const goToPrevious = () => {
    if (isTransitioning || normalizedVideos.length < 2) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? normalizedVideos.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning || normalizedVideos.length < 2) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === normalizedVideos.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleStart = (clientY: number) => {
    if (isTransitioning) return;
    isDragging.current = true;
    startY.current = clientY;
  };

  const handleEnd = (clientY: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diffY = startY.current - clientY;
    const threshold = 50;
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) goToNext();
      else goToPrevious();
    }
  };

  if (!apiLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div>Loading YouTube Player...</div>
      </div>
    );
  }

  if (!normalizedVideos || normalizedVideos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div>No videos available.</div>
      </div>
    );
  }

  if (!currentVideo || !currentVideo.id) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div>Could not load video information.</div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseUp={(e) => handleEnd(e.clientY)}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientY)}
    >
      <div ref={containerRef} className="relative w-full h-full bg-black">
        <div
          ref={playerRef}
          className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
        />

        {showControls && normalizedVideos.length > 1 && (
          <>
            <Link to="/contents" className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10">
              <X size={24} />
            </Link>
            <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} disabled={isTransitioning} className="absolute top-20 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:opacity-50 z-10">
              <ChevronUp size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToNext(); }} disabled={isTransitioning} className="absolute top-32 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:opacity-50 z-10">
              <ChevronDown size={24} />
            </button>
          </>
        )}

        {normalizedVideos.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
            {safeCurrentIndex + 1} / {normalizedVideos.length}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pointer-events-none" />
          <div className="relative p-4 pb-6 text-white">
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {currentVideo.description}
            </p>
            
            <div className="mt-2">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="text-xs text-gray-400">
                  {duration > 0 && `${Math.round(progress * 100)}%`}
                </div>
              </div>
              
              <div
                ref={progressBarRef}
                className="w-full h-2 bg-white/30 rounded-full cursor-pointer group"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-red-600 rounded-full relative transition-all duration-200" 
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <div className="text-xs text-gray-400">
                    {isPlaying ? '재생 중' : '일시정지'}
                  </div>
                </div>
                <button onClick={toggleFullScreen} className="p-2 hover:scale-110 transition-transform">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeFlipboard;
