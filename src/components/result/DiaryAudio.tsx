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
    const [equalizerBars, setEqualizerBars] = useState<number[]>(Array(40).fill(20));
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);
    
    if (!audio) return null;
    // Web Audio API 초기화
    const initializeAudioContext = async () => {
      try {
        if (!audioRef.current) return;
  
        // AudioContext 생성
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // AnalyserNode 생성
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64; // 32개의 주파수 밴드 (fftSize의 절반)
        analyserRef.current.smoothingTimeConstant = 0.8;
  
        // 오디오 소스 연결
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
  
      } catch (error) {
        console.error("Web Audio API 초기화 실패:", error);
      }
    };
  
    // 실시간 주파수 데이터 분석
    const analyzeAudio = () => {
      if (!analyserRef.current || !isPlaying) return;
  
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
  
      // 12개의 이퀄라이저 바를 위해 주파수 데이터를 그룹화
      const barCount = 12;
      const barsData: number[] = [];
      const groupSize = Math.floor(bufferLength / barCount);
  
      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        const start = i * groupSize;
        const end = start + groupSize;
  
        for (let j = start; j < end && j < bufferLength; j++) {
          sum += dataArray[j];
        }
  
        // 0-255 범위를 0-100 범위로 변환하고 최소값 설정
        const average = sum / groupSize;
        const normalizedValue = Math.max((average / 255) * 100, 10);
        barsData.push(normalizedValue);
      }
  
      setEqualizerBars(barsData);
      animationRef.current = requestAnimationFrame(analyzeAudio);
    };
  
    // 재생/정지 토글
    const togglePlayPause = async () => {
      if (!audioRef.current) return;
  
      if (isPlaying) {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        // 첫 재생 시 AudioContext 초기화
        if (!audioContextRef.current) {
          await initializeAudioContext();
        }
  
        // AudioContext가 suspended 상태라면 resume
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
  
        audioRef.current.play();
        analyzeAudio(); // 주파수 분석 시작
      }
      setIsPlaying(!isPlaying);
    };
  
    // 컴포넌트 정리
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      };
    }, []);
  
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
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setCurrentTime(0);
        // 정지 상태의 이퀄라이저로 복원
        setEqualizerBars(Array(40).fill(20));
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



  return (
    <div className="rounded-3xl bg-white shadow-lg border border-gray-200 flex justify-center">
      {/* 숨겨진 오디오 요소 */}
      <audio ref={audioRef} src={audio} preload="metadata" />
      
      {/* 이퀄라이저 섹션 */}
      <button onClick={togglePlayPause} disabled={isLoading}>
        {/* 실시간 이퀄라이저 섹션 */}
        <div className="flex items-center justify-center space-x-1 h-16 bg-white rounded-lg p-3">
        {equalizerBars.map((height, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-purple-400 to-blue-400 rounded-full transition-all duration-100 ease-out"
            style={{
              width: '4px',
              height: `${height}%`,
              opacity: isPlaying ? 1 : 0.3,
            }}
          />
        ))}
      </div>
      </button>
    </div>
  );
};

export default DiaryAudio;
