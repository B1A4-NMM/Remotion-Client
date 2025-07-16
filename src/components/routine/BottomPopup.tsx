import { useEffect, useRef, useState, useCallback } from "react";
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

const BottomPopup = ({ isOpen, onClose, children, heightOption }: BottomPopupProps) => {
  const [isInDOM, setIsInDOM] = useState(false);

  useEffect(() => {
    console.log("🏠 isInDOM 상태 변화:", isInDOM);
  }, [isInDOM]);
  const bodyOverflowRef = useRef<string>(document.body.style.overflow);
  const topRef = useRef<string>(document.body.style.top);
  const contentRef = useRef<HTMLDivElement>(null);

  const { heightPixel: _heightPixel, wrapChildren } = heightOption || {};
  const heightPixel = wrapChildren
    ? Math.max(contentRef.current?.offsetHeight || 0, 400) // 최소 400px 보장
    : _heightPixel || window.innerHeight / 2;

  console.log("📏 모달 높이 계산:", {
    wrapChildren,
    offsetHeight: contentRef.current?.offsetHeight,
    finalHeight: heightPixel,
    isInDOM,
    isOpen,
  });

  const [springProps, api] = useSpring(() => ({
    height: "0px",
    config: { tension: 300, friction: 30 },
    onRest: {
      height: value => {
        console.log("🎭 애니메이션 완료:", { value: value.value, isOpen });
        if (value.value === "0px") {
          console.log("🏠 setIsInDOM(false) 호출됨");
          setIsInDOM(false);
        }
      },
    },
  }));

  const handleOverlayClick = useCallback(() => {
    console.log("🚫 오버레이 클릭됨 - onClose 호출 안함 (임시 비활성화)");
    // onClose(); // 임시로 비활성화
  }, [onClose]);
  const handleContentClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  useEffect(() => {
    console.log("🔄 isOpen 변화 감지:", { isOpen, currentIsInDOM: isInDOM });

    if (isOpen) {
      console.log("✅ 모달 열기: setIsInDOM(true) 호출");
      setIsInDOM(true);
      const currY = window.scrollY || 0;
      bodyOverflowRef.current = document.body.style.overflow;
      topRef.current = document.body.style.top;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${currY}px`;
    } else {
      console.log("❌ 모달 닫기: 애니메이션 시작");
      api.start({ height: "0px" });
    }
  }, [isOpen, api]);

  useEffect(() => {
    console.log("🎭 애니메이션 제어:", { isInDOM, heightPixel });
    if (isInDOM) {
      console.log(`🎭 애니메이션 시작: ${heightPixel}px로 확장`);
      api.start({ height: `${heightPixel}px` });
    } else {
      console.log("🎭 DOM에서 제거됨: body 스타일 복원");
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    }
  }, [isInDOM, api]); // heightPixel 의존성 제거

  useEffect(
    () => () => {
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    },
    []
  );

  console.log("🔍 BottomPopup 렌더링 체크:", {
    isOpen,
    isInDOM,
    wrapChildren,
    heightPixel,
    shouldRender: isOpen, // isInDOM 대신 isOpen 사용
  });

  if (!isOpen) {
    console.log("❌ BottomPopup 렌더링 중단: isOpen이 false");
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-40"
          onClick={handleOverlayClick}
        />
      )}
      <animated.div
        style={{
          ...springProps,
          display: "block", // 강제로 표시
        }}
        className="absolute bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl overflow-y-auto shadow-xl"
        onClick={handleContentClick}
      >
        <div ref={contentRef} className="p-6">
          {(() => {
            console.log("📝 모달 콘텐츠 렌더링:", {
              hasChildren: !!children,
              springProps,
              heightPixel,
            });
            return null;
          })()}
          {children}
        </div>
      </animated.div>
    </>
  );
};

export default BottomPopup;
