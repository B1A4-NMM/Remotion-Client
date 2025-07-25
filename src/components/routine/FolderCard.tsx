interface FolderCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  onClick?: () => void;
}

const FolderCard = ({ title, subtitle, imageSrc, onClick }: FolderCardProps) => {
  return (
    <div className="relative min-w-[240px] h-[160px] mr-4 rounded-[24px] overflow-hidden">
      {/* 배경 이미지 */}
      <img src={imageSrc} alt={title} className="absolute inset-0 w-full h-full object-cover" />

      {/* 텍스트 */}
      <div className="absolute top-[40px] left-[20px] text-black">
        <div className="text-[14px] font-bold text-white leading-tight">{title}</div>
        <div className="text-[12px] font-medium leading-snug mt-[6px] text-white  whitespace-pre-wrap">
          {subtitle}
        </div>
      </div>

      {/* 플러스 버튼 */}
      <button
        onClick={onClick}
        className="absolute bottom-[20px] right-[25px] w-8 h-8 bg-white/40 rounded-full text-white text-xl flex items-center justify-center
             hover:scale-110 transition-transform duration-200 ease-in-out"
      >
        +
      </button>
    </div>
  );
};

export default FolderCard;
