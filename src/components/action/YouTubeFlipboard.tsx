import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { VideoType } from '../../types/video';

interface YouTubeFlipboardProps {
  videos: VideoType[];
  autoPlay?: boolean;
  showControls?: boolean;
}

const YouTubeFlipboard: React.FC<YouTubeFlipboardProps> = ({
  videos,
  autoPlay = false,
  showControls = true,
}) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 안전한 접근을 위한 방어 코드
  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-xl mb-2">📹</div>
          <div>추천 영상이 없습니다</div>
        </div>
      </div>
    );
  }

  // YouTube 썸네일 URL 생성
  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // YouTube 임베드 URL 생성
  const generateYouTubeUrl = (videoId: string) => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      controls: showControls ? '1' : '0',
      showinfo: '0',
      fs: '1',
      iv_load_policy: '3',
    });

    if (autoPlay) {
      params.append('autoplay', '1');
      params.append('mute', '1');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  // 비디오 클릭 핸들러
  const handleVideoClick = (videoId: string) => {
    setPlayingVideoId(videoId);
  };

  // 전체 화면 토글
  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="w-full bg-black text-white p-4">
      {/* 썸네일 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg group"
            onClick={() => handleVideoClick(video.id)}
          >
            {/* 썸네일 이미지 */}
            <img
              src={getThumbnailUrl(video.id)}
              alt={video.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* 재생 중일 때 임베드 플레이어 오버레이 */}
            {playingVideoId === video.id && (
              <div className={`absolute inset-0 ${isFullScreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
                <iframe
                  className="w-full h-full"
                  src={generateYouTubeUrl(video.id)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                {/* 우측 하단 전체 화면 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 비디오 클릭 방지
                    handleFullScreen();
                  }}
                  className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
            )}

            {/* 비디오 정보 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
              <p className="text-sm text-gray-300 mt-1 line-clamp-1">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeFlipboard;
