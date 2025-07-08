import React, { useState, useEffect, useRef} from 'react';
import { useGetDiaryContent } from '../api/queries/result/useGetDiaryContent';
import { useGetMemberSummary } from '../api/queries/result/useGetmemSummary';
import { ArrowLeft, Clock, CirclePlus, Plus, PlusCircle } from "lucide-react"
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

import Todos from '../components/result/Todo';
import  MoodCircle from '../components/result/MoodCircle';
import TestModal from '../components/TestModal';
import '../styles/resultCard.css';
import '../styles/App.css';
import ActivityCardSlider from '../components/result/ActivityCardSlider';
import StressTest from '../components/result/StressTest';
import { useParams } from 'react-router-dom';
 
interface DiaryCardsProps {
  diaryContent: any | null;
  memSummary: any |null;
}

/* ─ 1. 샘플 일기 (작성 유도) ─ */
const sampleDiary = {
    "activity_analysis": [
      {
        "activity": "발표 피드백 도와주기",
        "peoples": [],
        "self_emotions": {
          "self_emotion": [],
          "self_emotion_intensity": []
        },
        "state_emotions": {
          "state_emotion": [
            "무난"
          ],
          "s_emotion_intensity": [
            4
          ]
        },
        "problem": [
          {
            "situation": "None",
            "approach": "None",
            "outcome": "None",
            "decision_code": "None",
            "conflict_response_code": "None"
          }
        ],
        "strength": "학습애"
      },
      {
        "activity": "피드백 주고받기",
        "peoples": [
          {
            "name": "재웅",
            "interactions": {
              "relation_emotion": [
                "신뢰"
              ],
              "r_emotion_intensity": [
                4
              ]
            },
            "name_intimacy": "0.5"
          }
        ],
        "self_emotions": {
          "self_emotion": [],
          "self_emotion_intensity": []
        },
        "state_emotions": {
          "state_emotion": [],
          "s_emotion_intensity": []
        },
        "problem": [
          {
            "situation": "None",
            "approach": "None",
            "outcome": "None",
            "decision_code": "None",
            "conflict_response_code": "None"
          }
        ],
        "strength": "팀워크"
      },
      {
        "activity": "최종 기획 발표",
        "peoples": [
          {
            "name": "팀원들",
            "interactions": {
              "relation_emotion": [
                "실망"
              ],
              "r_emotion_intensity": [
                6
              ]
            },
            "name_intimacy": "0.5"
          }
        ],
        "self_emotions": {
          "self_emotion": [
            "죄책감",
            "후회"
          ],
          "self_emotion_intensity": [
            7,
            6
          ]
        },
        "state_emotions": {
          "state_emotion": [
            "불안"
          ],
          "s_emotion_intensity": [
            6
          ]
        },
        "problem": [
          {
            "situation": "기술 오류",
            "approach": "대책 회의",
            "outcome": "팀 혼란",
            "decision_code": "회피적",
            "conflict_response_code": "회피형"
          }
        ],
        "strength": "리더십"
      },
      {
        "activity": "대책 회의",
        "peoples": [
          {
            "name": "팀원들",
            "interactions": {
              "relation_emotion": [
                "실망"
              ],
              "r_emotion_intensity": [
                6
              ]
            },
            "name_intimacy": "0.5"
          }
        ],
        "self_emotions": {
          "self_emotion": [
            "책임감"
          ],
          "self_emotion_intensity": [
            8
          ]
        },
        "state_emotions": {
          "state_emotion": [
            "불안"
          ],
          "s_emotion_intensity": [
            6
          ]
        },
        "problem": [
          {
            "situation": "방향 차이",
            "approach": "교통 정리 실패",
            "outcome": "팀 혼란",
            "decision_code": "의존적",
            "conflict_response_code": "회피형"
          }
        ],
        "strength": "판단력"
      },
      {
        "activity": "자리 비우기",
        "peoples": [],
        "self_emotions": {
          "self_emotion": [
            "차분함"
          ],
          "self_emotion_intensity": [
            7
          ]
        },
        "state_emotions": {
          "state_emotion": [
            "무난"
          ],
          "s_emotion_intensity": [
            4
          ]
        },
        "problem": [
          {
            "situation": "None",
            "approach": "None",
            "outcome": "None",
            "decision_code": "None",
            "conflict_response_code": "None"
          }
        ],
        "strength": "자기조절"
      }
    ],
    "reflection": {
      "achievements": [
        "리더십 발휘",
        "자기조절 성공"
      ],
      "shortcomings": [
        "기술 미흡",
        "교통 정리 실패"
      ],
      "todo": [
        "컨디션 챙기기",
        "긍정적 태도"
      ]
    }
  }




{/* ==========결과 카드 리스트 ============== */}
const ResultCards = ({
  diaryContent,
  memSummary 
}: DiaryCardsProps)=>{

  const [scrollY, setScrollY] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: any, info: any) => {
    setScrollY(info.offset.y);
  };

  const calculateConstraints = () => {
    if (!contentRef.current) return { top: 0, bottom: 0 };

    const contentHeight = contentRef.current.scrollHeight;
    const viewHeight = window.innerHeight;
    const headerHeight = 400; // 헤더 + 무드 서클 영역

    return {
      top: -(contentHeight - viewHeight + headerHeight),
      bottom: 0,
    };
  };

  // 투두 데이터 추출 함수
  const getTodos = (): string[] => {
    if (diaryContent?.reflection?.todo) {
      return diaryContent.reflection.todo;
    }
    return [];
  };


  const todos = getTodos();


  return(
    <>
      {/* 드래그 가능한 카드 컨테이너 */}
      <motion.div
        ref={contentRef}
        drag="y"
        dragConstraints={calculateConstraints()}
        dragElastic={0.1}
        onDrag={handleDrag}
        className="cursor-grab z-10 active:cursor-grabbing"
        style={{
          y: scrollY,
          borderRadius: scrollY < -100 ? "0px" : "24px 24px 0 0",
          minHeight: "100vh",
          backgroundColor:"#1e1e1e"
        }}
      >

        <ActivityCardSlider
          data={diaryContent}
        />
        {/* 투두 리스트 카드들 */}
        <Todos 
          todos={todos}
        />

        <StressTest
          memSummary={memSummary}/>

        
      </motion.div>
    </>
  );
}



const Result: React.FC = () => {


  const [showTestModal, setShowTestModal] = useState(false);
  const { id } =useParams<{id:string}>();
  const token = localStorage.getItem('accessToken') || '';

  const { 
      data: diaryContent, 
      isLoading, 
      isError, 
    } = useGetDiaryContent(token, id||'sample');

    const { data: memsummary} = useGetMemberSummary(token);
    
    if (isLoading ) {
     return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white">일기 내용 로딩 중...</div>
      </div>
     );
   }

    // 에러 상태 처리
  if (isError) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <h2 className="text-xl mb-2">일기를 불러올 수 없습니다</h2>
          <p className="text-gray-300">
            {id ? `일기 ID ${id}를 찾을 수 없습니다.` : '일기 ID가 필요합니다.'}
          </p>
        </div>
      </div>
    );
  }

  const finalDiaryContent = diaryContent? diaryContent :sampleDiary ;

  return (
    <div className="base px-4 overflow-hidden">
      {/* 상단 뒤로가기 버튼 */}
      <div className="relative z-50 flex justify-start pt-6 pb-6">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => {
      window.location.href = '/';
    }}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* 무드 서클 */}
        <MoodCircle 
          diaryContent={finalDiaryContent}
        />

        <ResultCards
          diaryContent={finalDiaryContent}
          memSummary={memsummary}
        />

      {showTestModal && (
        <TestModal
          type="stress"
          onClose={() => setShowTestModal(false)}
          onFinish={score => {
            console.log("최종 점수:", score);
          }}
        />
      )}
    </div>
  );
};

export default Result;
