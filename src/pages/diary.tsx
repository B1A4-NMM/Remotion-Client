import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image as LucideImage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostDiary } from "@/api/queries/diary/usePostDiary.ts";
import Loading from "../components/Loading";
import Loading2 from "../components/Loading2";
import Loading3 from "../components/Loading3";
import Loading4 from "../components/Loading4";
import Loading6 from "../components/Loading6";

const Diary = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = usePostDiary({
    onSuccess: () => {
      reset();
      setPreview(null);

      setIsSubmitting(false);
      navigate("/result");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ← 로딩 상태 직접 관리

  const onSubmit = (data: any) => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const token = localStorage.getItem("accessToken") ?? "";
    setIsSubmitting(true); // ← 먼저 로딩 true로 설정
    mutate({
      content: data.content,
      writtenDate: today,
      weather: "SUNNY",
      token,
    });

    console.log({
      content: data.content,
      writtenDate: today,
      weather: "SUNNY",
      token,
    });
  };
  if (isSubmitting) {
    return <Loading6 key={Date.now()} />; // ← 응답 올 때까지 로딩 표시
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-screen flex flex-col p-4 pb-20">
      <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <Textarea
            {...register("content", { required: "내용을 작성해주세요" })}
            placeholder="오늘은 무슨 일이 있으셨나요?"
            className="resize-none flex-1 min-h-0 "
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
          )}
        </div>

        {/* 이미지 업로드 */}
        <label htmlFor="image-upload">
          <Card className="w-full h-48 mt-[1vh] border-dashed border-2 border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden bg-transparent">
            {preview ? (
              <img src={preview} alt="미리보기" className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center text-white">
                <LucideImage className="w-8 h-8 mb-2 text-white" /> {/* 아이콘 색상 변경 */}
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
        />
      </div>

      {/* 저장하기 버튼! */}
      <div className="pt-4">
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
          저장하기
        </Button>
      </div>
    </form>
  );
};

export default Diary;
