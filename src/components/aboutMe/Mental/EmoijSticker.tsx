// ✅ EmojiSticker.tsx 예시
import { useDrag } from "react-dnd";

const EmojiSticker = ({ type, emoji }: { type: string; emoji: string }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "MENTAL_TYPE",
    item: { type }, // 이게 꼭 있어야 Drop에서 읽음!
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      data-drag-emoji
      className="text-4xl cursor-grab"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {emoji}
    </div>
  );
};

export default EmojiSticker;
