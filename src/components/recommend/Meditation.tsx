import React, { useEffect, useRef, useState} from "react";
import JustBlob from "../Blob/JustBlob";
import { Canvas } from "@react-three/fiber";
import { X } from "lucide-react";

interface MeditationProps {
    type?: number;
    onClose?: () => void; // 닫기 콜백 함수 추가
}

const Meditation = ({ type = 1, onClose }: MeditationProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isStart, setIsStart] = useState(false);
  const [sound, setSound] = useState("");

  console.log(sound);
  
  // 명상 단계 관리
  const [meditationPhase, setMeditationPhase] = useState('start');
  const [breathingTextIndex, setBreathingTextIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  
  // 타입별 문구 정의 함수
  useEffect(() => {
    switch (type) {
      case 1:
        setSound("/assets/audio/Nebula.mp3");
        break;
      case 2:
        setSound("/assets/audio/Tranquility.mp3");
        break;
      case 3:
        setSound("/assets/audio/Mindwave.mp3");
        break;
      default:
        setSound("");
    }
  }, [type]);

  const getMessages = () => {
    switch (type) {
      case 1: // 분노 진정하기
        return {
          start: [
            "",
            "분노를 진정하는 명상을 시작할게요.",
            "마음 속 분노를 차분히 가라앉혀 보세요.",
            "편안한 자세로 앉아 깊게 호흡해주세요."
          ],
          breathing: [
            "분노를 천천히 내려놓으세요.",
            "화가 나는 마음을 인정하고 받아들이세요.",
            "깊게 숨을 들이마시며 평온을 찾아보세요.",
            "화난 감정이 구름처럼 지나가도록 놓아주세요.",
            "자신을 용서하고 이해하는 마음을 가져보세요.",
            "분노 대신 평화로운 마음을 선택하세요.",
            "천천히 내쉬며 마음의 평정을 되찾으세요.",
            "모든 부정적 감정을 숨과 함께 내보내세요."
          ],
          end: [
            "분노가 많이 가라앉았나요?",
            "마음이 한결 편안해졌을 거예요.",
            "이제 천천히 눈을 떠보세요.",
            "평온한 마음으로 하루를 계속해보세요."
          ]
        };
      
      case 2: // 우울 다스리기
        return {
          start: [
            "",
            "우울한 마음을 다스리는 명상을 시작할게요.",
            "힘든 마음을 따뜻하게 보듬어 주세요.",
            "편안한 자세로 앉아 자신을 돌아봐 주세요."
          ],
          breathing: [
            "힘든 감정을 그대로 느껴보세요.",
            "지금 이 순간, 당신은 충분히 소중합니다.",
            "깊게 숨을 들이마시며 희망을 품어보세요.",
            "우울한 마음도 언젠가는 지나갈 거예요.",
            "자신에게 따뜻한 위로의 말을 건네보세요.",
            "작은 것에도 감사한 마음을 가져보세요.",
            "천천히 내쉬며 새로운 가능성을 상상해보세요.",
            "당신은 혼자가 아니라는 걸 기억하세요."
          ],
          end: [
            "마음이 조금 밝아졌나요?",
            "힘든 시간도 이겨낼 수 있어요.",
            "이제 천천히 눈을 떠보세요.",
            "따뜻한 마음으로 하루를 시작해보세요."
          ]
        };
      
      case 3: // 긴장 완화하기
        return {
          start: [
            "",
            "긴장을 완화하는 명상을 시작할게요.",
            "몸과 마음의 긴장을 천천히 풀어보세요.",
            "편안한 자세로 앉아 근육을 이완해주세요."
          ],
          breathing: [
            "어깨와 목의 긴장을 풀어주세요.",
            "깊게 숨을 들이마시며 몸을 이완하세요.",
            "긴장된 근육들이 하나씩 풀리는 걸 느껴보세요.",
            "마음의 걱정들도 함께 내려놓으세요.",
            "온몸이 따뜻하고 편안해지는 걸 상상하세요.",
            "천천히 내쉬며 모든 스트레스를 배출하세요.",
            "지금 이 순간만 집중하며 평온을 느끼세요.",
            "완전히 릴랙스된 상태를 즐겨보세요."
          ],
          end: [
            "긴장이 많이 풀렸나요?",
            "몸과 마음이 한결 가벼워졌을 거예요.",
            "이제 천천히 눈을 떠보세요.",
            "편안한 마음으로 활동을 재개해보세요."
          ]
        };
      
      default:
        return {
          start: [
            "",
            "지금부터 명상을 시작할게요.",
            "마음을 차분히 가라앉히고 따라 해 보세요.",
            "편안한 자세로 앉아주세요."
          ],
          breathing: [
            "천천히 숨을 들이마시세요.",
            "잠시 멈추세요.",
            "지금 천천히 내쉬세요.",
            "편안히 숨을 고르세요.",
            "깊게 들이마시고...",
            "천천히 내쉬며 긴장을 풀어보세요.",
            "자연스럽게 호흡하세요.",
            "마음을 비우고 호흡에 집중하세요."
          ],
          end: [
            "수고하셨습니다.",
            "마음이 차분해지셨나요?",
            "이제 천천히 눈을 떠보세요.",
            "평온한 하루 되세요."
          ]
        };
    }
  };

  // 타입에 따른 메시지 가져오기
  const messages = getMessages();
  const startMessages = messages.start;
  const breathingMessages = messages.breathing;
  const endMessages = messages.end;

  // X 버튼 클릭 핸들러
  const handleClose = () => {
    // 음악 정지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // 부모 컴포넌트의 닫기 함수 호출
    if (onClose) {
      onClose();
    }
  };

  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsStart(true);
      }).catch((error) => {
        console.error('음악 재생 실패:', error);
        setIsStart(true);
      });
    }
  };

  useEffect(() => {
    if(audioRef.current){
        audioRef.current.volume = 0.15; // 볼륨 조정
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 3단계 명상 텍스트 애니메이션 효과
  useEffect(() => {
    if (isStart) {
      let intervalId;
      let phaseTimeoutId;
      
      const showNextMessage = () => {
        setIsTextVisible(false);
        
        setTimeout(() => {
          if (meditationPhase === 'start') {
            setBreathingTextIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= startMessages.length) {
                return 0;
              }
              return nextIndex;
            });
          } else if (meditationPhase === 'breathing') {
            setBreathingTextIndex((prevIndex) => 
              (prevIndex + 1) % breathingMessages.length
            );
          } else if (meditationPhase === 'end') {
            setBreathingTextIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= endMessages.length) {
                return 0;
              }
              return nextIndex;
            });
          }
          
          setIsTextVisible(true);
        }, 500);
      };
      
      const getInterval = () => {
        switch (meditationPhase) {
          case 'start': return 4000;
          case 'breathing': return 8000;
          case 'end': return 4000;
          default: return 4000;
        }
      };
      
      intervalId = setInterval(showNextMessage, getInterval());
      
      if (meditationPhase === 'start') {
        phaseTimeoutId = setTimeout(() => {
          setMeditationPhase('breathing');
          setBreathingTextIndex(0);
          setIsTextVisible(false);
          setTimeout(() => setIsTextVisible(true), 500);
        }, 12000);
      } else if (meditationPhase === 'breathing') {
        phaseTimeoutId = setTimeout(() => {
          setMeditationPhase('end');
          setBreathingTextIndex(0);
          setIsTextVisible(false);
          setTimeout(() => setIsTextVisible(true), 500);
        }, 180000);
      } else if (meditationPhase === 'end') {
        phaseTimeoutId = setTimeout(() => {
          clearInterval(intervalId);
          setIsTextVisible(false);
        }, 12000);
      }
      
      return () => {
        clearInterval(intervalId);
        clearTimeout(phaseTimeoutId);
      };
    }
  }, [isStart, meditationPhase, startMessages.length, breathingMessages.length, endMessages.length]);

  const getCurrentMessage = () => {
    switch (meditationPhase) {
      case 'start':
        return startMessages[breathingTextIndex] || startMessages[0];
      case 'breathing':
        return breathingMessages[breathingTextIndex];
      case 'end':
        return endMessages[breathingTextIndex] || endMessages[endMessages.length - 1];
      default:
        return '';
    }
  };

  return (
    <div className="absolute inset-0 bg-black z-50 w-full h-full">
      {/* 우측 상단 X 버튼 - 닫기 기능 추가 */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <X size={24} />
      </button>

      {/* 배경 음악 */}
      <audio ref={audioRef} key={sound} loop className="hidden">
        <source src={sound} type="audio/mpeg" />
      </audio>

      <div className="w-full h-full">
        {isStart ? (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1">
              <Canvas
                camera={{ position: [0, 0, 15], fov: 90 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true }}
              >
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4A90E2" />
                
                <JustBlob type={type} />
              </Canvas>
            </div>
            
            {/* 단계별 안내 텍스트 */}
            <div className="absolute bottom-72 left-0 right-0 text-center">
              <div 
                className={`text-white text-2xl font-light transition-all duration-700 ease-in-out ${
                  isTextVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-6 scale-95'
                }`}
                style={{
                  textShadow: '0 0 20px rgba(255,255,255,0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                {getCurrentMessage()}
              </div>
              
              {/* 진행 상태 표시 */}
              <div className="mt-8 flex justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  meditationPhase === 'start' ? 'bg-white' : 'bg-white/30'
                }`} />
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  meditationPhase === 'breathing' ? 'bg-white' : 'bg-white/30'
                }`} />
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  meditationPhase === 'end' ? 'bg-white' : 'bg-white/30'
                }`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-full">
            <button 
              onClick={handlePlayMusic}
              className="bg-white/10 hover:bg-white/20 text-white text-2xl p-4 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              명상을 시작할까요?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meditation;
