import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image as LucideImage, Mic, MicOff } from "lucide-react";
import { usePostDiary } from "@/api/queries/diary/usePostDiary.ts";
import Loading6 from "../components/Loading/Loading6";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import LocationPicker from "@/components/LocationPicker"; // 분리된 지도 모달 컴포넌트
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import DiaryTitle from "@/components/diary/DiaryTitle";
import BottomNavi from "@/components/diary/BottomNavi";

const Diary = () => {
  const { date } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const isValidDate = date && dayjs(date, "YYYY-MM-DD", true).isValid();
  if (!isValidDate) {
    return <div className="p-4 text-red-500">❌ 유효하지 않은 날짜입니다: {date}</div>;
  }

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false); // 위치 모달 상태
  const [inputFocused, setInputFocused] = React.useState(false); // 키패드 올라옴?
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const prevTranscriptRef = useRef("");
  const animationQueue = useRef<string[]>([]);
  const [animatedText, setAnimatedText] = useState("");

  const { mutate } = usePostDiary({
    onSuccess: () => {
      reset();
      setPreview(null);
      setIsSubmitting(false);
      setAnimatedText("");
    },
  });

  useEffect(() => {
    if (!listening) return;
    const prev = prevTranscriptRef.current;
    const current = transcript;
    const newPart = current.substring(prev.length);
    if (newPart) {
      animationQueue.current.push(...newPart.split(""));
      prevTranscriptRef.current = current;
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (!listening || animationQueue.current.length === 0) return;
    const interval = setInterval(() => {
      const nextChar = animationQueue.current.shift();
      if (nextChar) {
        setAnimatedText(prev => {
          const updated = prev + nextChar;
          setValue("content", updated);
          return updated;
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [animationQueue.current.length, listening]);

  // BottomNavi에서 사용할 핸들러 함수들
  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      prevTranscriptRef.current = "";
      SpeechRecognition.startListening({ language: "ko-KR", continuous: true });
    }
  };

  const handleLocationClick = () => {
    setShowLocationPicker(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };
  const onSubmit = (data: any) => {
    const file = fileInputRef.current?.files?.[0];
    const formData = new FormData();

    formData.append("content", data.content);
    formData.append("writtenDate", date!); // ✅ URL에서 받은 날짜로 작성
    formData.append("weather", "SUNNY");

    if (location) {
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
    }

    if (file) {
      formData.append("photo", file);
    }

    // 디버깅 로그
    console.log("📤 전송할 FormData 내용:");
    formData.forEach((value, key) => {
      if (key === "photo" && value instanceof File) {
        console.log(`📎 ${key}:`, value.name, `(size: ${value.size} bytes)`);
      } else {
        console.log(`📝 ${key}:`, value);
      }
    });

    setIsSubmitting(true);
    mutate(formData);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>⚠️ 브라우저가 음성 인식을 지원하지 않습니다.</p>;
  }

  if (isSubmitting) return <Loading6 key={Date.now()} />;

  return (
    <>
      <div className="relative flex flex-col h-screen border">
        <DiaryTitle />
        {/* 일기 작성 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 h-screen">
          <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <Textarea
                {...register("content", { required: "내용을 작성해주세요" })}
                value={animatedText}
                onChange={e => {
                  setAnimatedText(e.target.value);
                  setValue("content", e.target.value);
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="오늘은 무슨 일이 있으셨나요?"
                className="resize-none flex-1 min-h-0"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
              )}
            </div>

            {preview && (
              <Card className="w-full h-48 mt-[1vh] border-2 border-gray-400 flex items-center justify-center overflow-hidden bg-transparent">
                <img src={preview} alt="미리보기" className="object-cover w-full h-full" />
              </Card>
            )}

            <input
              type="file"
              accept="image/*"
              id="image-upload"
              {...register("image")}
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </form>

        {/* BottomNavi 컴포넌트 */}
        <BottomNavi
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          isListening={listening}
          inputFocused={inputFocused}
        />
      </div>
      {/* 위치 선택 모달 */}
      {showLocationPicker && (
        <LocationPicker
          open={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onLocationSelect={loc => {
            console.log("📥 부모에서 받은 위치:", loc);
            setLocation(loc);
            // 주소 변환 (선택사항)
          }}
        />
      )}
    </>
  );
};

export default Diary;
