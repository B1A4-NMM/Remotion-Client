import React, { useState, useRef, useEffect } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null); // ✅ 타입 수정
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

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

  useEffect(() => {
    const initializeAPI = () => {
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
        console.log('✅ YouTube API 로드됨'); // ✅ 디버깅 로그
        setApiLoaded(true);
      };
    };

    initializeAPI();

    return () => {
      (window as any).onYouTubeIframeAPIReady = null;
    };
  }, []);

  useEffect(() => {
    if (apiLoaded && playerRef.current && normalizedVideos.length > 0 && !player) {
      console.log('🎥 플레이어 초기화 시작'); // ✅ 디버깅 로그
      
      const newPlayer = new (window as any).YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: normalizedVideos[safeCurrentIndex]?.id,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
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
      setPlayer(newPlayer);
    }
  }, [apiLoaded, normalizedVideos.length, player, safeCurrentIndex, autoPlay]);

  useEffect(() => {
    if (player && typeof player.loadVideoById === 'function' && currentVideo) {
      console.log('🔄 비디오 변경:', currentVideo.id); // ✅ 디버깅 로그
      player.loadVideoById(currentVideo.id);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [safeCurrentIndex, player]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') goToPrevious();
      else if (e.key === 'ArrowDown') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ✅ 컴포넌트 unmount 시 interval 정리
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  const onPlayerReady = (event: any) => {
    console.log('✅ 플레이어 준비됨'); // ✅ 디버깅 로그
    setIsPlayerReady(true);
    
    // ✅ 즉시 duration 가져오기 시도
    setTimeout(() => {
      try {
        const videoDuration = event.target.getDuration();
        console.log('📏 비디오 길이:', videoDuration); // ✅ 디버깅 로그
        if (videoDuration > 0) {
          setDuration(videoDuration);
        }
      } catch (error) {
        console.error('길이 정보 가져오기 실패:', error);
      }
    }, 500);
    
    if (autoPlay) {
      event.target.playVideo();
    }
  };

  const onPlayerStateChange = (event: any) => {
    const YT = (window as any).YT;
    console.log('🎵 플레이어 상태 변경:', event.data); // ✅ 디버깅 로그
    
    if (event.data === YT.PlayerState.PLAYING) {
      console.log('▶️ 재생 시작'); // ✅ 디버깅 로그
      setIsPlaying(true);
      startProgressTracking();
    } else if (event.data === YT.PlayerState.PAUSED) {
      console.log('⏸️ 일시정지'); // ✅ 디버깅 로그
      setIsPlaying(false);
      stopProgressTracking();
    } else if (event.data === YT.PlayerState.ENDED) {
      console.log('🏁 재생 완료'); // ✅ 디버깅 로그
      setIsPlaying(false);
      stopProgressTracking();
      setProgress(1);
      setCurrentTime(duration);
      if (normalizedVideos.length > 1) {
        setTimeout(() => goToNext(), 1000);
      }
    } else if (event.data === YT.PlayerState.BUFFERING) {
      console.log('⏳ 버퍼링'); // ✅ 디버깅 로그
      // 버퍼링 중에도 duration 업데이트 시도
      updateVideoInfo();
    }
  };

  const onPlayerError = (event: any) => {
    console.error('❌ YouTube Player Error:', event.data);
    if (normalizedVideos.length > 1) {
      setTimeout(() => goToNext(), 2000);
    }
  };

  // ✅ 비디오 정보 업데이트 함수
  const updateVideoInfo = () => {
    if (!player) return;
    
    try {
      const videoDuration = player.getDuration();
      if (videoDuration > 0 && videoDuration !== duration) {
        console.log('📏 Duration 업데이트:', videoDuration);
        setDuration(videoDuration);
      }
    } catch (error) {
      // 에러 무시 (아직 로드되지 않았을 수 있음)
    }
  };

  // ✅ 개선된 progress tracking
  const startProgressTracking = () => {
    console.log('🎯 Progress tracking 시작'); // ✅ 디버깅 로그
    
    stopProgressTracking(); // 기존 interval 정리
    
    progressIntervalRef.current = setInterval(() => {
      if (!player) {
        console.log('❌ Player 없음');
        return;
      }

      try {
        // 메소드 존재 확인
        if (typeof player.getCurrentTime !== 'function' || typeof player.getDuration !== 'function') {
          console.log('❌ Player 메소드 없음');
          return;
        }

        const current = player.getCurrentTime();
        const total = player.getDuration();
        
        console.log('⏱️ 시간 업데이트:', { current: current.toFixed(1), total: total.toFixed(1) }); // ✅ 디버깅 로그
        
        if (total > 0) {
          const newProgress = current / total;
          setCurrentTime(current);
          setDuration(total);
          setProgress(newProgress);
        }
      } catch (error) {
        console.error('Progress 업데이트 실패:', error);
      }
    }, 500); // ✅ 간격을 500ms로 늘려서 안정성 향상
  };

  const stopProgressTracking = () => {
    console.log('⏹️ Progress tracking 중지'); // ✅ 디버깅 로그
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const togglePlay = () => {
    if (!player || !isPlayerReady) return;
    
    console.log('🎵 재생/정지 토글:', isPlaying ? '정지' : '재생'); // ✅ 디버깅 로그
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !isPlayerReady || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = duration * seekPosition;
    
    console.log('🎯 Seek:', { position: seekPosition, time: seekTime.toFixed(1) }); // ✅ 디버깅 로그
    
    if (duration > 0) {
      player.seekTo(seekTime, true);
      setProgress(seekPosition);
      setCurrentTime(seekTime);
    }
  };

  const toggleFullScreen = () => {
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

  // ✅ 디버깅 정보 표시 함수 (개발용)
  const showDebugInfo = () => {
    console.log('🐛 디버그 정보:', {
      apiLoaded,
      isPlayerReady,
      player: !!player,
      currentTime,
      duration,
      progress,
      isPlaying,
      currentVideoId: currentVideo?.id
    });
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

        {/* ✅ 디버그 버튼 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={showDebugInfo}
            className="absolute top-4 left-20 bg-red-500 text-white px-2 py-1 text-xs rounded z-50"
          >
            Debug
          </button>
        )}

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
              {/* ✅ 시간 정보 표시 */}
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
