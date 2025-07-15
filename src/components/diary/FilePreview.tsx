import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LocationPreview } from "@/components/LocationPicker";

// Attachment types for props
interface ImageAttachment {
  type: 'image';
  file: File;
  preview: string;
}

interface LocationAttachment {
  type: 'location';
  location: { latitude: number; longitude: number };
}

export type Attachment = ImageAttachment | LocationAttachment;

interface FilePreviewProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
  onEditLocation: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ attachments, onRemove, onEditLocation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // 터치 디바이스 감지
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
  }, []);

  // dragConstraints 동적 계산
  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const maxDrag = Math.max(0, contentWidth - containerWidth);
        
        setDragConstraints({
          left: -maxDrag,
          right: 0
        });
      }
    };

    updateConstraints();
    
    // 윈도우 리사이즈 이벤트 리스너
    const handleResize = () => {
      setTimeout(updateConstraints, 100); // 리사이즈 완료 후 계산
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      }
    };
  }, [attachments.length]);

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`
        overflow-x-auto whitespace-nowrap py-2 
        ${isTouchDevice ? 'cursor-default' : 'cursor-grab'} 
        scrollbar-hide
      `}
      style={{
        // 터치 디바이스에서 부드러운 스크롤 활성화
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <motion.div
        ref={contentRef}
        className="flex space-x-4 p-4 min-w-max"
        drag={isTouchDevice ? false : "x"} // 터치 디바이스에서는 드래그 비활성화
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragMomentum={true}
        whileDrag={{ cursor: "grabbing" }}
        dragTransition={{ 
          bounceStiffness: 600, 
          bounceDamping: 20 
        }}
      >
        {attachments.map((attachment, index) => (
          <motion.div key={index} className="relative w-[100px] h-[100px] flex-shrink-0">
            <Card className="w-full h-full border-2 border-gray-400 flex items-center justify-center overflow-hidden bg-transparent">
              {attachment.type === 'image' ? (
                <img 
                  src={attachment.preview} 
                  alt={`미리보기 ${index + 1}`} 
                  className="object-cover w-full h-full" 
                />
              ) : (
                <LocationPreview 
                  location={attachment.location} 
                  onEdit={onEditLocation} 
                />
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 z-10 hover:bg-opacity-70 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FilePreview;
