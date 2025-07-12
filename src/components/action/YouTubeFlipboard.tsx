//YoutubeFlipboard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, X, Maximize, Play, Pause } from 'lucide-react';
import type { VideoType } from '../../types/video';
import { Link } from "react-router-dom";

interface YouTubeFlipboardProps {
  videos: VideoType[];
  autoPlay?: boolean;
  showControls?: boolean;
}

const YouTubeFlipboard: React.FC<YouTubeFlipboardProps> = ({
  videos,
  autoPlay = false,
  showControls = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const [player, setPlayer] = useState<any>(null); // YT.Player
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, videos.length - 1));
  const currentVideo = videos[safeCurrentIndex];

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

  // Load YouTube Iframe API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      setIsPlayerReady(true);
    };

    return () => {
      (window as any).onYouTubeIframeAPIReady = null;
    }
  }, []);

  // Initialize player
  useEffect(() => {
    if (isPlayerReady && playerRef.current && videos.length > 0 && !player) {
      const newPlayer = new (window as any).YT.Player(playerRef.current.id, {
        videoId: videos[safeCurrentIndex].id,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          fs: 1,
          iv_load_policy: 3,
          mute: autoPlay ? 1 : 0,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
      });
      setPlayer(newPlayer);
    }
  }, [isPlayerReady, videos, player]);

  // Update video when currentIndex changes
  useEffect(() => {
    if (player && videos.length > 0) {
      player.loadVideoById(videos[safeCurrentIndex].id);
    }
  }, [safeCurrentIndex]);


  const onPlayerReady = (event: any) => {
    if (autoPlay) {
      event.target.playVideo();
    }
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === (window as any).YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      const intervalId = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          setProgress(duration > 0 ? currentTime / duration : 0);
        }
      }, 250);
      
      // player가 null이 아닐 때만 속성 설정
      if (player) {
        (player as any).progressInterval = intervalId;
      }
    } else {
      setIsPlaying(false);
      
      // player가 null이 아닐 때만 interval 정리
      if (player && (player as any).progressInterval) {
        clearInterval((player as any).progressInterval);
        (player as any).progressInterval = null; // 정리 후 null로 설정
      }
    }
  };
  

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (player && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const seekPosition = (e.clientX - rect.left) / rect.width;
      const seekTime = player.getDuration() * seekPosition;
      player.seekTo(seekTime, true);
      setProgress(seekPosition);
    }
  };

  const toggleFullScreen = () => {
    const iframe = player.getIframe();
    if (iframe) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframe.requestFullscreen();
      }
    }
  };

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
      if (diffY > 0) goToNext();
      else goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') goToPrevious();
      else if (e.key === 'ArrowDown') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black"
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseUp={(e) => handleEnd(e.clientY)}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientY)}
      >
        <div
          id="youtube-player"
          ref={playerRef}
          className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
        />

        {showControls && videos.length > 1 && (
          <>
            <Link to="/contents" className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10">
              <X size={24} />
            </Link>
            <button onClick={goToPrevious} disabled={isTransitioning} className="absolute top-20 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:opacity-50 z-10">
              <ChevronUp size={24} />
            </button>
            <button onClick={goToNext} disabled={isTransitioning} className="absolute top-32 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm disabled:opacity-50 z-10">
              <ChevronDown size={24} />
            </button>
          </>
        )}

        {videos.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
            {currentIndex + 1} / {videos.length}
          </div>
        )}

        <div className="absolute right-4 bottom-40 z-20">
          <div className="flex flex-col space-y-4">
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all w-14 h-14 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all w-14 h-14 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pointer-events-none" />
          <div className="relative p-4 pb-6 text-white">
            <h3 className="text-xl font-bold mb-2 leading-tight line-clamp-2">{currentVideo.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">{currentVideo.description}</p>
            
            <div className="mt-2">
              <div
                ref={progressBarRef}
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group"
                onClick={handleSeek}
              >
                <div className="h-full bg-red-600 rounded-full relative" style={{ width: `${progress * 100}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
                <button onClick={toggleFullScreen} className="p-2">
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
