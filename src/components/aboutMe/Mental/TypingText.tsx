import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingTextProps {
  textList: string[];
  typingSpeed?: number;
  delayBetween?: number;
  onComplete?: () => void;
}

const TypingText = ({
  textList,
  typingSpeed = 40,
  delayBetween = 700,
  onComplete,
}: TypingTextProps) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (lineIndex >= textList.length) {
      // 모든 문장을 다 타이핑했을 때
      const timer = setTimeout(() => {
        setIsFinished(true);
        setTimeout(() => {
          onComplete?.();
        }, 600); // fade-out 끝나고
      }, delayBetween);
      return () => clearTimeout(timer);
    }

    const line = textList[lineIndex];
    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + line[charIndex]);
        setCharIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedLines(prev => [...prev, line]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(prev => prev + 1);
      }, delayBetween);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, textList, typingSpeed, delayBetween, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="typing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-white text-base font-medium leading-relaxed px-6 space-y-2"
        >
          {typedLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          {lineIndex < textList.length && (
            <p>
              {currentLine}
              <span className="inline-block w-[1px] bg-white animate-blink ml-[2px]" />
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingText;
