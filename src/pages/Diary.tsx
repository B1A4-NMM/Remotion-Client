import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image as LucideImage, Mic, MicOff } from "lucide-react";
import { usePostDiary } from "@/api/queries/diary/usePostDiary.ts";
import Loading6 from "../components/Loading/Loading6";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import LocationPicker from "@/components/LocationPicker";
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
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // 글자 수 상태 추가
  const [contentLength, setContentLength] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const [isPhotoActive, setIsPhotoActive] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const prevTranscriptRef = useRef("");
  const animationQueue = useRef<string[]>([]);
  const [animatedText, setAnimatedText] = useState("");

  const { mutate } = usePostDiary({
    onSuccess: () => {
      reset();
      setPreview(null);
      setIsSubmitting(false);
      setAnimatedText("");
      setContentLength(0); // 글자 수 리셋
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
          setContentLength(updated.length); // 글자 수 업데이트
          return updated;
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [animationQueue.current.length, listening]);

  useEffect(() => {
    const handleResize = () => {
      if (inputFocused) {
        const viewport = window.visualViewport;
        if (viewport) {
          const height = window.innerHeight - viewport.height;
          setKeyboardHeight(height > 0 ? height : 0);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [inputFocused]);

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
    setIsLocationActive(!isLocationActive);
    setShowLocationPicker(true);
  };

  const handleImageClick = () => {
    setIsPhotoActive(true);

    const handleWindowFocus = () => {
      if (!fileInputRef.current?.files?.length) {
        setIsPhotoActive(false);
      }
      window.removeEventListener('focus', handleWindowFocus);
    };

    window.addEventListener('focus', handleWindowFocus, { once: true });
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      setPreview(null);
      setImageFile(null);
      setIsPhotoActive(false);
    }
  };

  // 저장 버튼 클릭 핸들러 추가
  const handleSaveClick = () => {
    handleSubmit(onSubmit)();
  };

  const onSubmit = (data: any) => {
    const file = fileInputRef.current?.files?.[0];
    const formData = new FormData();

    formData.append("content", data.content);
    formData.append("writtenDate", date!);
    formData.append("weather", "SUNNY");

    if (location) {
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
    }

    if (file) {
      formData.append("photo", file);
    }

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 flex-1">
          <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <Textarea
                {...register("content", { required: "내용을 작성해주세요" })}
                value={animatedText}
                onChange={e => {
                  setAnimatedText(e.target.value);
                  setValue("content", e.target.value);
                  setContentLength(e.target.value.length); // 글자 수 업데이트
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="오늘은 무슨 일이 있으셨나요?"
                className="resize-none flex-1 min-h-0"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
              )}
              {/* 글자 수 표시 */}
              <div className="text-right text-sm text-gray-500 mt-1">
                {contentLength}자
              </div>
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

        <BottomNavi
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          onImageClick={handleImageClick}
          onSaveClick={handleSaveClick} // 저장 버튼 핸들러 추가
          isListening={listening}
          isPhotoActive={isPhotoActive}
          isLocationActive={isLocationActive}
          isSaveEnabled={contentLength >= 100} // 저장 버튼 활성화 조건
          keyboardHeight={keyboardHeight}
        />
      </div>

      {showLocationPicker && (
        <LocationPicker
          open={showLocationPicker}
          onClose={() => {
            setShowLocationPicker(false);
            setIsLocationActive(!isLocationActive);
          }}
          onLocationSelect={loc => {
            console.log("📥 부모에서 받은 위치:", loc);
            setLocation(loc);
          }}
        />
      )}
    </>
  );
};

export default Diary;
