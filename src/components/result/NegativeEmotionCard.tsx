import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

interface NegativeEmotionCardProps {
  emotionType:
    | "stress"
    | "anxiety"
    | "depression"
    | "sadness"
    | "anger"
    | "스트레스"
    | "불안"
    | "우울"
    | "슬픔"
    | "화"
    | "분노";
}

const emotionMessages = {
  stress: {
    title: "스트레스가 감지되었어요",
    message: "마음이 복잡하고 힘드시겠어요. 잠시 쉬어가며 마음을 정리해보는 건 어떨까요?",
    videoTitle: "스트레스 해소 영상",
    videoDescription: "긴장을 풀고 마음을 편안하게 만들어주는 영상들을 추천해드려요.",
  },
  anxiety: {
    title: "불안감이 느껴져요",
    message: "걱정이 많으시겠어요. 차분히 호흡하며 마음을 진정시켜보세요.",
    videoTitle: "불안 완화 영상",
    videoDescription: "마음의 긴장을 풀어주고 안정감을 찾을 수 있는 영상들이에요.",
  },
  depression: {
    title: "우울한 기분이에요",
    message: "힘든 시간을 보내고 계시는군요. 천천히, 하나씩 나아가보아요.",
    videoTitle: "기분 전환 영상",
    videoDescription: "마음을 밝게 해주고 에너지를 북돋아주는 영상들을 모아봤어요.",
  },
  sadness: {
    title: "슬픈 감정이에요",
    message: "마음이 아프시겠어요. 슬픔도 자연스러운 감정이에요. 함께 이겨내봐요.",
    videoTitle: "위로 영상",
    videoDescription: "마음을 따뜻하게 감싸주는 위로의 영상들을 준비했어요.",
  },
  anger: {
    title: "화가 나는 상황이에요",
    message: "분노가 느껴지시는군요. 깊은 호흡으로 마음을 진정시켜보세요.",
    videoTitle: "분노 조절 영상",
    videoDescription: "화를 가라앉히고 마음을 차분하게 만들어주는 영상들이에요.",
  },
  // 한글 타입들도 동일한 메시지 사용
  스트레스: {
    title: "스트레스가 감지되었어요",
    message: "마음이 복잡하고 힘드시겠어요. 잠시 쉬어가며 마음을 정리해보는 건 어떨까요?",
    videoTitle: "스트레스 해소 영상",
    videoDescription: "긴장을 풀고 마음을 편안하게 만들어주는 영상들을 추천해드려요.",
  },
  불안: {
    title: "불안감이 느껴져요",
    message: "걱정이 많으시겠어요. 차분히 호흡하며 마음을 진정시켜보세요.",
    videoTitle: "불안 완화 영상",
    videoDescription: "마음의 긴장을 풀어주고 안정감을 찾을 수 있는 영상들이에요.",
  },
  우울: {
    title: "우울한 기분이에요",
    message: "힘든 시간을 보내고 계시는군요. 천천히, 하나씩 나아가보아요.",
    videoTitle: "기분 전환 영상",
    videoDescription: "마음을 밝게 해주고 에너지를 북돋아주는 영상들을 모아봤어요.",
  },
  슬픔: {
    title: "슬픈 감정이에요",
    message: "마음이 아프시겠어요. 슬픔도 자연스러운 감정이에요. 함께 이겨내봐요.",
    videoTitle: "위로 영상",
    videoDescription: "마음을 따뜻하게 감싸주는 위로의 영상들을 준비했어요.",
  },
  화: {
    title: "화가 나는 상황이에요",
    message: "분노가 느껴지시는군요. 깊은 호흡으로 마음을 진정시켜보세요.",
    videoTitle: "분노 조절 영상",
    videoDescription: "화를 가라앉히고 마음을 차분하게 만들어주는 영상들이에요.",
  },
  분노: {
    title: "화가 나는 상황이에요",
    message: "분노가 느껴지시는군요. 깊은 호흡으로 마음을 진정시켜보세요.",
    videoTitle: "분노 조절 영상",
    videoDescription: "화를 가라앉히고 마음을 차분하게 만들어주는 영상들이에요.",
  },
};

const NegativeEmotionCard: React.FC<NegativeEmotionCardProps> = ({ emotionType }) => {
  const emotion = emotionMessages[emotionType];

  return (
    <div className="bg-[#ffffff] dark:bg-white p-1 rounded-2xl text-black dark:text-white shadow-md dark:border-gray-600">
      <div className="p-4 rounded-2xl">
        <div className="flex items-center mb-2">
          <Play className="w-5 h-5 text-[#ef7c80] dark:text-purple-400 mr-2" />
          <h4 className="font-medium text-base">{emotion.videoTitle}</h4>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-200 mb-3">
          {emotion.videoDescription}
        </p>
        <Link to="/contents">
          <Button className="w-full bg-[#ef7c80] dark:bg-purple-600 text-white hover:bg-[#e06b6f] dark:hover:bg-purple-700">
            영상 보러가기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NegativeEmotionCard;
