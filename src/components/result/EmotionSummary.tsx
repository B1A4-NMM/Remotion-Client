import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import {
  getBlobEmotionsFromSimpleEmotions,
} from "../../utils/activityEmotionUtils";

interface EmotionSummaryProps {
  diaryContent: any; // 기존 타입은 그대로 유지
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent }) => {
  /* ---------- 1. Blob에 줄 emotions 계산 ---------- */
  const processedEmotions = useMemo(() => {
    // ① diaryContent.emotions 배열이 있으면 간단 계산
    if (Array.isArray(diaryContent?.emotions) && diaryContent.emotions.length) {
      return getBlobEmotionsFromSimpleEmotions(diaryContent);
    }
  }, [diaryContent]);

  /* ---------- 2. 표시용 텍스트 ---------- */
  const mainEmotions = useMemo(() => {
    if (Array.isArray(diaryContent?.emotions) && diaryContent.emotions.length) {
      return diaryContent.emotions
        .map((e: any) => e.emotion)
        .join(", ");
    }
    const raw = diaryContent?.analysis?.activity_analysis ?? [];
    if (!raw.length) return "";
    const flat: string[] = [];
    raw.forEach((a: any) => {
      flat.push(...(a.self_emotions?.emotion ?? []));
      flat.push(...(a.state_emotions?.emotion ?? []));
      if (Array.isArray(a.peoples)) {
        a.peoples.forEach((p: any) =>
          flat.push(...(p.interactions?.emotion ?? []))
        );
      }
    });
    return [...new Set(flat.filter((e) => e && e !== "string"))]
      .slice(0, 3)
      .join(", ");
  }, [diaryContent]);

  /* ---------- 3. 대상 인물 ---------- */
  const targetNames = useMemo(() => {
    const list: string[] = [];
    diaryContent?.analysis?.activity_analysis?.forEach((a: any) => {
      a.peoples?.forEach((p: any) => {
        if (p.name && p.name !== "string") list.push(p.name.trim());
      });
    });
    return [...new Set(list)].join(", ");
  }, [diaryContent]);

  /* ---------- 4. 렌더 ---------- */
  return (
    <div className="flex flex-col items-center text-center space-y-[16px] mb-4">
      <p className="text-sm text-gray-500">하루의 감정</p>

      <div className="w-[130px] h-[130px]">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 30 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
          style={{ background: "transparent" }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={0.4} />
          <Blob emotions={processedEmotions} />
        </Canvas>
      </div>

      {mainEmotions && (
        <p className="text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed m-8">
          {mainEmotions}
        </p>
      )}

      {targetNames && (
        <p className="text-lg text-gray-500 line-clamp-2 leading-relaxed m-7">
          {targetNames}
        </p>
      )}
    </div>
  );
};

export default EmotionSummary;
