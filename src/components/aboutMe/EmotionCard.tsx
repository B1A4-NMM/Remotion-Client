import React from "react";
import AnimalCard from "./Emotion/AnimalCard";
import EmotionChart from "./Emotion/EmotionChart";

const emotionData = {
  relationData: {
    connected: [
      { name: '감사', count: 15 },
      { name: '애정', count: 12 },
      { name: '신뢰', count: 8 }
    ],
    distanced: [
      { name: '분노', count: 6 },
      { name: '질투', count: 4 },
      { name: '실망', count: 3 }
    ]
  },
  stateData: {
    elevated: [{ name: '기쁨', count: 20 }],
    tense: [{ name: '불안', count: 8 }],
    calm: [{ name: '평온', count: 15 }],
    lethargic: [{ name: '우울', count: 5 }]
  },
  selfData: {
    positive: [{ name: '자신감', count: 18 }],
    negative: [{ name: '후회', count: 7 }]
  }
};

const EmotionCard = () => {

  {/* 임시 */}

  const animalType = "sloth";
  return (
    <div style={{backgroundColor:"#374151"}}>
      
      <div>
        <AnimalCard animalType={animalType}/>
      </div>

      {/* 감정 차트 추가 */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-100">
          감정 분석 차트
        </h3>
        <EmotionChart {...emotionData}/>
      </div>
    </div>
  );
};

export default EmotionCard;
