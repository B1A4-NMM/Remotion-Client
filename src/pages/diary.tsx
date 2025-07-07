import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image as LucideImage, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostDiary } from "@/api/queries/diary/usePostDiary.ts";
import Loading6 from "../components/loading/Loading6";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Diary = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // transcript가 바뀔 때마다 새로 인식된 부분만 큐에 추가
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

  //  큐에 있는 문자들을 타이핑 애니메이션처럼 하나씩 추가
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

  const handleStartListening = () => {
    resetTranscript();
    prevTranscriptRef.current = "";
    SpeechRecognition.startListening({ language: "ko-KR", continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const onSubmit = (data: any) => {
    const today = new Date().toISOString().split("T")[0];
    const file = fileInputRef.current?.files?.[0];

    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("writtenDate", today);
    formData.append("weather", "SUNNY");

    if (file) {
      formData.append("photo", file);
    }

    setIsSubmitting(true);
    mutate(formData);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>⚠️ 브라우저가 음성 인식을 지원하지 않습니다.</p>;
  }

  if (isSubmitting) return <Loading6 key={Date.now()} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-screen flex flex-col p-4 pb-20">
      <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <Textarea
            {...register("content", { required: "내용을 작성해주세요" })}
            value={animatedText}
            onChange={e => {
              setAnimatedText(e.target.value);
              setValue("content", e.target.value);
            }}
            placeholder="오늘은 무슨 일이 있으셨나요?"
            className="resize-none flex-1 min-h-0"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
          )}

          {/* 음성 입력  */}
          <div className="flex justify-end mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={listening ? handleStopListening : handleStartListening}
              className={`flex items-center gap-2 text-sm px-4 py-2
    ${listening ? "!bg-red-800 !text-white" : "!bg-blue-800 !text-white"}
    !hover:bg-red-600 !hover:text-white
    !shadow-none !border-none !ring-0 focus:!ring-0
  `}
            >
              {listening ? (
                <>
                  <MicOff size={16} />
                  일기 듣는 중
                </>
              ) : (
                <>
                  <Mic size={16} />
                  일기 말하기
                </>
              )}
            </Button>
          </div>
        </div>

        {/*  이미지 업로드 */}
        <label htmlFor="image-upload">
          <Card className="w-full h-48 mt-[1vh] border-dashed border-2 border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden bg-transparent">
            {preview ? (
              <img src={preview} alt="미리보기" className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center text-white">
                <LucideImage className="w-8 h-8 mb-2 text-white" />
              </div>
            )}
          </Card>
        </label>
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

      <div className="pt-4">
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
          저장하기
        </Button>
      </div>
    </form>
  );
};

export default Diary;
