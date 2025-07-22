import React, { useEffect, useRef, useState, useCallback,forwardRef,
  useImperativeHandle,} from "react";
import { useSpring, animated } from "@react-spring/web";

type HeightOption = {
  heightPixel?: number;
  wrapChildren?: boolean;
};

type BottomPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  heightOption?: HeightOption;
};

//닫기버튼 눌렀을 때 애니매이션 적용 
export type BottomPopupHandle = {
  close: () => void;
};

const BottomPopup = forwardRef<BottomPopupHandle,BottomPopupProps>(
  ({ isOpen, onClose, children, heightOption }, ref) => {
  const [isInDOM, setIsInDOM] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [shouldClose, setShouldClose] = useState(false); // 닫힘 예약 

  const bodyOverflowRef = useRef<string>(document.body.style.overflow);
  const topRef = useRef<string>(document.body.style.top);
  const contentRef = useRef<HTMLDivElement>(null);

  const { heightPixel: _heightPixel, wrapChildren } = heightOption || {};
  const heightPixel = wrapChildren
    ? Math.max(contentRef.current?.offsetHeight || 0, 520) // 최소 400px 보장
    : _heightPixel || window.innerHeight * 0.8;

  const [springProps, api] = useSpring(() => ({
    height: "0px",
    config: { tension: 250, friction: 35 },
    onRest: {
      height: value => {
        // console.log("🎭 애니메이션 완료:", { value: value.value, isOpen });
        if (value.value === "0px") {
          setIsInDOM(false);
        }
      },
    },
  }));

  // const handleOverlayClick = useCallback(() => {
  //   setShowOverlay(false);
  //   onClose();
  // }, [onClose]);

  // ✅ 닫기용 함수 정의
  const closeWithAnimation = () => {
    setShowOverlay(false);
    setShouldClose(true);
    api.start({ height: "0px" });
  };

  // ✅ 이 부분 추가!
  useImperativeHandle(ref, () => ({
    close: closeWithAnimation,
  }));

  const handleContentClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  useEffect(() => {
    // console.log("🔄 isOpen 변화 감지:", { isOpen, currentIsInDOM: isInDOM });

    if (isOpen) {
      // console.log("✅ 모달 열기 ");
      setIsInDOM(true);
      setShowOverlay(true);
      const currY = window.scrollY || 0;
      bodyOverflowRef.current = document.body.style.overflow;
      topRef.current = document.body.style.top;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${currY}px`;
    } else {
      // console.log("❌ 모달 닫기 ");
      closeWithAnimation();
    }
  }, [isOpen]);

  useEffect(() => {
    // console.log("🎭 애니메이션 제어:" );
    if (isInDOM) {
      // console.log(`🎭 애니메이션 시작: ${heightPixel}px로 확장`);
      api.start({ height: `${heightPixel}px` });
    } else {
      // console.log("🎭 DOM에서 제거됨: body 스타일 복원");
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    }
  }, [isInDOM, api, heightPixel]); // heightPixel 의존성 제거

  useEffect(() => {
    return () => {
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    };
  }, []);

  return isInDOM ? (
    <>
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-[99]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeWithAnimation(); // ✅ 오버레이 클릭 시에도 부드럽게 닫힘
            }
          }}
        />
      )}

      <animated.div
        style={{
          ...springProps,
          display: "block",
        }}
        className="absolute bottom-0 left-0 w-full z-[100] bg-[#FAF6F4] dark:bg-[#29222B] rounded-t-2xl overflow-y-auto shadow-xl"
        onClick={handleContentClick}
      >

        {/* 상단 바 */}
        <div className="w-full flex justify-center py-2">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div ref={contentRef} className="p-6">
          {children}
        </div>
      </animated.div>
    </>
  ) : null;
}
);

export default BottomPopup;
