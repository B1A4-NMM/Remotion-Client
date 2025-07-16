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
  const bodyOverflowRef = useRef<string>(document.body.style.overflow);
  const topRef = useRef<string>(document.body.style.top);
  const contentRef = useRef<HTMLDivElement>(null);

  const { heightPixel: _heightPixel, wrapChildren } = heightOption || {};
  const heightPixel = wrapChildren
    ? contentRef.current?.offsetHeight || 0
    : _heightPixel || window.innerHeight / 2;

  const [springProps, api] = useSpring(() => ({
    height: "0px",
    config: { tension: 300, friction: 30 },
    onRest: {
      height: value => {
        if (value.value === "0px") {
          setIsInDOM(false);
        }
      },
    },
  }));

  const handleOverlayClick = useCallback(() => onClose(), [onClose]);
  const handleContentClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  useEffect(() => {
    if (isOpen) {
      setIsInDOM(true);
      const currY = window.scrollY || 0;
      bodyOverflowRef.current = document.body.style.overflow;
      topRef.current = document.body.style.top;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${currY}px`;
    } else {
      api.start({ height: "0px" });
    }
  }, [isOpen, api]);

  useEffect(() => {
    if (isInDOM) {
      api.start({ height: `${heightPixel}px` });
    } else {
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    }
  }, [isInDOM, api, heightPixel]);

  useEffect(
    () => () => {
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    },
    []
  );

  if (!wrapChildren && !isInDOM) return null;

  return (
    <>
      {isInDOM && (
        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-40"
          onClick={handleOverlayClick}
        />
      )}
      <animated.div
        style={springProps}
        className="absolute bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl overflow-y-auto shadow-xl"
        onClick={handleContentClick}
      >
        <div ref={contentRef} className="p-6">
          {children}
        </div>
      </animated.div>
    </>
  );
};

export default BottomPopup;
