//video.tsx
import React from "react";
import YouTubeFlipboard from "../components/action/YouTubeFlipboard";

import { useGetVideo } from "../api/queries/action/useGetVideo";
import type { VideoType } from "../types/video";

const SAMPLE_DATA: VideoType[] = [
  {
    id: "_8i8j_r8QFU",
    title: "첫 번째 비디오 제목",
    description:
      "이것은 첫 번째 비디오에 대한 상세한 설명입니다. 여기에는 비디오의 내용, 제작자 정보, 그리고 기타 관련 정보들이 포함될 수 있습니다.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "두 번째 비디오 제목",
    description:
      "두 번째 비디오에 대한 설명입니다. 이 비디오는 다른 주제를 다루고 있으며, 사용자에게 유용한 정보를 제공합니다.",
  },
  {
    id: "jNQXAC9IVRw",
    title: "세 번째 비디오 제목",
    description: "마지막 비디오에 대한 설명입니다. 이 시리즈의 마무리를 담고 있습니다.",
  },
];
const Video: React.FC = () => {
  const token = localStorage.getItem("accessToken") ?? "";

  const { data, isLoading, isError } = useGetVideo(token);

  /** API 응답 → 화면용 배열 변환 */
  const apiVideo: VideoType[] =
    data?.videoId && typeof data.videoId === "string"
      ? [
          {
            id: data.videoId,
            title: "추천 영상",
            description: data.message ?? "",
          },
        ]
      : [];

  const videoData = apiVideo.length ? apiVideo : SAMPLE_DATA;

  if (isLoading) return <div>로딩 중…</div>;
  if (isError) return <div>영상을 가져오지 못했습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <YouTubeFlipboard videos={videoData} autoPlay={false} showControls />
    </div>
  );
};

export default Video;
