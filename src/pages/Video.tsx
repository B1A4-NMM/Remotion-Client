//video.tsx
import React, {useEffect, useState} from "react";
import YouTubeFlipboard from "../components/action/YouTubeFlipboard";

import { useGetVideo } from "../api/queries/action/useGetVideo";
import type { VideoType } from "../types/video";

const SAMPLE_DATA: VideoType[] = [
  {
    videoId: "_8i8j_r8QFU",
    emotion:
      "이것은 첫 번째 비디오에 대한 상세한 설명입니다. 여기에는 비디오의 내용, 제작자 정보, 그리고 기타 관련 정보들이 포함될 수 있습니다.",
    message:
      "비디오 예제"
  },
  {
    videoId: "dQw4w9WgXcQ",
    emotion:
      "두 번째 비디오에 대한 설명입니다. 이 비디오는 다른 주제를 다루고 있으며, 사용자에게 유용한 정보를 제공합니다.",
    message:
      "비디오 예제"
  },
  {
    videoId: "jNQXAC9IVRw",
    emotion: "마지막 비디오에 대한 설명입니다. 이 시리즈의 마무리를 담고 있습니다.",
    message:
      "비디오 예제"
  },
];

const Video: React.FC = () => {

  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  useEffect(() => {
    // 세션 스토리지에서 선택된 영상 정보 읽기
    const saved = sessionStorage.getItem('selectedVideo');
    if (saved) {
      setSelectedVideo(JSON.parse(saved));
    }
  }, []);

  const videoData = selectedVideo ? [selectedVideo] : SAMPLE_DATA;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <YouTubeFlipboard videos={videoData} autoPlay={true} showControls />
    </div>
  );
};

export default Video;