// src/components/result/DiaryAudio.tsx

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface DiaryAudioProps {
  audio: string; // 녹음 파일 URL
}

const DiaryAudio: React.FC<DiaryAudioProps> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [equalizerBars, setEqualizerBars] = useState<number[]>(
    Array(12).fill(0).map(() => Math.random() * 100)
  );

  if(!audio) audio="./assets/audio/Nebula.mp3";
  
  // 이퀄라이저 애니메이션
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setEqualizerBars(prev => 
          prev.map(() => Math.random() * 100)
        );
      }, 150);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // 오디오 이벤트 리스너
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsLoading(false);
      console.error("오디오 로드 실패");
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // 재생/정지 토글
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 시간 포맷팅
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 진행률 계산
  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!audio) return null;

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg border border-gray-200">
      {/* 숨겨진 오디오 요소 */}
      <audio ref={audioRef} src={audio} preload="metadata" />
      
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">음성 일기</h3>
        <div className="text-sm text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* 이퀄라이저 섹션 */}
      <div className="flex items-center justify-center space-x-1 mb-6 h-16 bg-white rounded-lg p-3">
        {equalizerBars.map((height, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-purple-400 to-blue-400 rounded-full transition-all duration-150 ease-out"
            style={{
              width: '4px',
              height: isPlaying ? `${Math.max(height * 0.6, 10)}%` : '20%',
              opacity: isPlaying ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* 컨트롤 섹션 */}
      <div className="flex items-center space-x-4">
        {/* 재생/정지 버튼 */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`
            flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
            ${isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white ml-0.5" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        {/* 진행률 바 */}
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 볼륨 인디케이터 */}
        <div className="flex items-center space-x-1">
          <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {isPlaying ? "재생 중..." : "일시 정지됨"}
        </p>
      </div>
    </div>
  );
};

export default DiaryAudio;
