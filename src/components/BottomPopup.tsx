import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

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

const BottomPopup = forwardRef<BottomPopupHandle, BottomPopupProps>(
  ({ isOpen, onClose, children, heightOption }, ref) => {
    console.log("🔍 BottomPopup 렌더링:", { isOpen, children });

    const [isInDOM, setIsInDOM] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [shouldClose, setShouldClose] = useState(false); // 닫힘 예약
    const [currentHeight, setCurrentHeight] = useState("0px"); // 현재 높이

    const contentRef = useRef<HTMLDivElement>(null);

    const { heightPixel: _heightPixel, wrapChildren } = heightOption || {};

    // 내용 기반 높이 계산
    const getDynamicHeight = () => {
      if (contentRef.current && wrapChildren) {
        const contentHeight = contentRef.current.scrollHeight;
        const maxHeight = window.innerHeight * 0.8; // 화면 높이의 80% 제한
        return Math.min(contentHeight + 48, maxHeight); // 48px는 패딩 고려
      }
      return _heightPixel || 700;
    };

    // heightPixel 변수는 제거하고 getDynamicHeight()를 직접 사용

    // useSpring 제거 - useState로 대체

    // const handleOverlayClick = useCallback(() => {
    //   setShowOverlay(false);
    //   onClose();
    // }, [onClose]);

    // ✅ 닫기용 함수 정의
    const closeWithAnimation = useCallback(() => {
      setShowOverlay(false); // 오버레이 즉시 제거
      setShouldClose(true);
      setCurrentHeight("0px");

      // body 스타일 즉시 복원 (오버레이 클릭 시 다른 요소들과 상호작용 가능하도록)
      document.body.style.overflow = "auto";

      // onClose는 애니메이션 완료 후에 호출
    }, []);

    // ✅ 이 부분 추가!
    useImperativeHandle(ref, () => ({
      close: closeWithAnimation,
    }));

    const handleContentClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    useEffect(() => {
      // console.log("🔄 isOpen 변화 감지:", { isOpen, currentIsInDOM: isInDOM });

      if (isOpen) {
        // console.log("✅ 모달 열기 ");
        setIsInDOM(true);
        setShowOverlay(true);
        setShouldClose(false); // 닫힘 상태 초기화
        document.body.style.overflow = "hidden";
      } else if (isInDOM && !shouldClose) {
        // console.log("❌ 모달 닫기 ");
        closeWithAnimation();
      }
    }, [isOpen, closeWithAnimation, isInDOM, shouldClose]);

    useEffect(() => {
      // console.log("🎭 애니메이션 제어:" );
      if (isInDOM) {
        const dynamicHeight = getDynamicHeight();
        // console.log(`🎭 애니메이션 시작: ${dynamicHeight}px로 확장`);
        setCurrentHeight(`${dynamicHeight}px`);
      }
    }, [isInDOM, children]); // children 변경 시 높이 재계산

    // 애니메이션 완료 후 DOM에서 제거
    useEffect(() => {
      if (shouldClose && currentHeight === "0px") {
        const timer = setTimeout(() => {
          onClose(); // 애니메이션 완료 후 부모 컴포넌트에 닫힘 알림
          setIsInDOM(false);
          setShouldClose(false);
          // body 스타일 복원
          document.body.style.overflow = "auto";
        }, 300); // transition 시간과 동일하게 설정

        return () => clearTimeout(timer);
      }
    }, [shouldClose, currentHeight, onClose]);

    useEffect(() => {
      return () => {
        // 컴포넌트 언마운트 시 body 스타일 복원
        document.body.style.overflow = "auto";
      };
    }, []);

    // isOpen이 false가 될 때 body 스타일 복원
    useEffect(() => {
      if (!isOpen && isInDOM) {
        document.body.style.overflow = "auto";
      }
    }, [isOpen, isInDOM]);

    console.log("🔍 BottomPopup DOM 렌더링:", { isInDOM, showOverlay, currentHeight });
    console.log("🔍 BottomPopup children 렌더링:", children);

    return isInDOM ? (
      <>
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-[99]"
            style={{
              zIndex: shouldClose ? -1 : 99, // 닫힐 때 z-index를 낮춰서 다른 요소들이 클릭 가능하도록
            }}
            onClick={e => {
              if (e.target === e.currentTarget) {
                // 오버레이 클릭 시 즉시 닫기 (애니메이션 없이)
                setShowOverlay(false);
                setShouldClose(true);
                setCurrentHeight("0px");
                setIsInDOM(false);

                // body 스타일 즉시 복원
                document.body.style.overflow = "auto";

                // 즉시 onClose 호출
                onClose();
              }
            }}
          />
        )}

        <div
          style={{
            height: currentHeight,
            display: "block",
            transition: "height 0.3s ease-in-out",
            zIndex: shouldClose ? -1 : 100, // 닫힐 때 z-index를 낮춰서 다른 요소들이 클릭 가능하도록
            pointerEvents: shouldClose ? "none" : "auto", // 닫힐 때 클릭 이벤트 무시
          }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] bg-[#FAF6F4] dark:bg-[#29222B] rounded-t-2xl overflow-y-auto shadow-xl"
          onClick={handleContentClick}
        >
          {/* 상단 바 */}
          <div className="w-full flex justify-center py-2">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div ref={contentRef} className="p-6">
            {children}
          </div>
        </div>
      </>
    ) : null;
  }
);

BottomPopup.displayName = "BottomPopup";

export default BottomPopup;
