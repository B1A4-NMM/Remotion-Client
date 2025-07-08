import { useEffect, useState } from "react";
import axios from "axios";

import AnimalCard from "./Emotion/AnimalCard";
import EmotionChart from "./Emotion/EmotionChart";
import type { AnimalKey } from "../../types";
import { useGetEmotionAnalysis } from "../../api/queries/aboutme/useGetEmoanalysis";

const emotionData = {
  relationData: {
    connected: [
      { name: "감사", count: 15 },
      { name: "애정", count: 12 },
      { name: "신뢰", count: 8 },
    ],
    distanced: [
      { name: "분노", count: 6 },
      { name: "질투", count: 4 },
      { name: "실망", count: 3 },
    ],
  },
  stateData: {
    elevated: [{ name: "기쁨", count: 20 }],
    tense: [{ name: "불안", count: 8 }],
    calm: [{ name: "평온", count: 15 }],
    lethargic: [{ name: "우울", count: 5 }],
  },
  selfData: {
    positive: [{ name: "자신감", count: 18 }],
    negative: [{ name: "후회", count: 7 }],
  },
};

const EmotionCard = () => {
  const [animalType, setAnimalType] = useState<{ character: AnimalKey } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const token = localStorage.getItem("accessToken") || "";
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/member/character`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // 올바른 객체 형태로 저장
        setAnimalType({ character: response.data.character as AnimalKey });
      } catch (error) {
        console.error("Error fetching character:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [token, BASE_URL]);

  const { data: EmotionAnalysis } = useGetEmotionAnalysis(token);

  // console.log("EmotionAnalysis", EmotionAnalysis);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>캐릭터 정보를 불러오는 데 실패했습니다.</div>;

  return (
    <div style={{ backgroundColor: "#374151" }}>
      <div>
        <AnimalCard animalType={animalType} />
      </div>

      {/* 감정 차트 추가 */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-100">감정 분석 차트</h3>
        <EmotionChart emotionAnalysis={EmotionAnalysis} animate={true} />
      </div>
    </div>
  );
};

export default EmotionCard;
