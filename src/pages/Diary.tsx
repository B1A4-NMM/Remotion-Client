import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { usePostDiary } from "@/api/queries/diary/usePostDiary.ts";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { LocationPicker } from "@/components/LocationPicker";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import FilePreview, { Attachment } from "@/components/diary/FilePreview";

import DiaryTitle from "@/components/diary/DiaryTitle";
import BottomNavi from "@/components/diary/BottomNavi";
import MonthlyCalendar from "@/components/diary/MonthlyCalendar";
import { toast } from "sonner";
import MainLoading from "@/components/Loading/MainLoading";

const Diary = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date || dayjs().format("YYYY-MM-DD"));

  // URL 파라미터와 selectedDate 동기화
  useEffect(() => {
    if (date && date !== selectedDate) {
      setSelectedDate(date);
    }
  }, [date]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // 글자 수 상태 추가
  const [contentLength, setContentLength] = useState(0);

  // 제출된 일기 내용 상태 추가
  const [submittedDiary, setSubmittedDiary] = useState<any>(null);

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
      setAttachments([]);
      setIsSubmitting(false);
      setAnimatedText("");
      setContentLength(0); // 글자 수 리셋
      setSubmittedDiary(prev => (prev ? { ...prev, isAnalysisDone: true } : null)); // 분석 완료 신호
    },
  });

  // 날짜 선택 핸들러
  const handleDateSelect = (newDate: string) => {
    const selectedDay = dayjs(newDate);
    const today = dayjs();

    if (selectedDay.isSame(today, "day") || selectedDay.isBefore(today, "day")) {
      setSelectedDate(newDate);
      navigate(`/diary/${newDate}`);
    } else {
      toast.error("미래 날짜로는 이동할 수 없습니다!");
    }
  };

  // 달력 버튼 클릭 핸들러
  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  // 달력 닫기 핸들러
  const handleCalendarClose = () => {
    setShowCalendar(false);
  };

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
      if (attachments.length < 5) {
        setIsPhotoActive(false);
      }
      window.removeEventListener("focus", handleWindowFocus);
    };

    window.addEventListener("focus", handleWindowFocus, { once: true });
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const imageCount = attachments.filter(att => att.type === "image").length;

      if (imageCount + newFiles.length > 4) {
        alert("최대 4개의 이미지만 첨부할 수 있습니다.");
        return;
      }

      const newImageAttachments: Attachment[] = newFiles.map(file => ({
        type: "image",
        file,
        preview: URL.createObjectURL(file),
      }));

      setAttachments(prev => [...newImageAttachments, ...prev]);
    }
  };

  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    const newLocationAttachment: Attachment = {
      type: "location",
      location,
    };

    setAttachments(prev => {
      const withoutLocation = prev.filter(att => att.type !== "location");
      return [newLocationAttachment, ...withoutLocation];
    });

    setShowLocationPicker(false);
  };

  const handleRemoveAttachment = (index: number) => {
    const attachment = attachments[index];
    if (attachment.type === "image") {
      URL.revokeObjectURL(attachment.preview);
    }
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 저장 버튼 클릭 핸들러 추가
  const handleSaveClick = () => {
    handleSubmit(onSubmit)();
  };

  const onSubmit = (data: any) => {
    // 제출된 일기 내용 저장
    const diaryContent = {
      content: data.content || "",
      writtenDate: date || dayjs().format("YYYY-MM-DD"),
    };

    setSubmittedDiary(diaryContent);
    sessionStorage.setItem("shouldFadeFromLoading", "true");

    const formData = new FormData();

    formData.append("content", data.content);
    formData.append("writtenDate", date!);
    formData.append("weather", "SUNNY");

    const locationAttachment = attachments.find(att => att.type === "location") as
      | Attachment
      | undefined;
    if (locationAttachment && locationAttachment.type === "location") {
      formData.append("latitude", String(locationAttachment.location.latitude));
      formData.append("longitude", String(locationAttachment.location.longitude));
    }

    const imageAttachments = attachments.filter(att => att.type === "image") as Attachment[];
    imageAttachments.forEach(att => {
      if (att.type === "image") {
        formData.append("photo", att.file);
      }
    });

    formData.forEach((value, key) => {
      if (key === "photos" && value instanceof File) {
      } else {
      }
    });

    setIsSubmitting(true);
    mutate(formData);
  };

  useEffect(() => {
    if (isSubmitting && submittedDiary?.isAnalysisDone) {
      navigate(`/result/${date}`, { state: { diaryContent: submittedDiary } });
    }
  }, [isSubmitting, submittedDiary, navigate, date]);

  if (!browserSupportsSpeechRecognition) {
    return <p>⚠️ 브라우저가 음성 인식을 지원하지 않습니다.</p>;
  }

  // if (isSubmitting) return <Loading6 key={Date.now()} />;
  if (isSubmitting) return <MainLoading key={Date.now()} />;

  return (
    <>
      <div className="relative flex flex-col h-full border">
        <DiaryTitle
          selectedDate={selectedDate}
          onCalendarClick={handleCalendarClick}
          onBackClick={() => navigate("/")}
        />

        {/* 달력 컴포넌트 */}
        <MonthlyCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onClose={handleCalendarClose}
          isOpen={showCalendar}
        />
        <FilePreview
          attachments={attachments}
          onRemove={handleRemoveAttachment}
          onEditLocation={() => setShowLocationPicker(true)}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-4 flex-1 min-h-0 overflow-hidden"
        >
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
              placeholder="오늘은 무슨 일이 있으셨나요? 100자 이상으로 작성 해 주세요."
              className="resize-none flex-1 w-full min-h-[200px] max-h-none overflow-y-auto border-none outline-none focus:border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex-shrink-0 mt-2">
              {errors.content && (
                <p className="text-red-500 text-sm mb-1">{errors.content.message as string}</p>
              )}
              {/* 글자 수 표시 */}
              <div className="text-right text-sm text-gray-500">{contentLength}자</div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            id="image-upload"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
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
        />
      </div>

      {showLocationPicker && (
        <LocationPicker
          open={showLocationPicker}
          onClose={() => {
            setShowLocationPicker(false);
            setIsLocationActive(!isLocationActive);
          }}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </>
  );
};

export default Diary;
