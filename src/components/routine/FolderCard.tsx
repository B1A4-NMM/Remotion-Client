
interface FolderCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  
}

const FolderCard = ({ title, subtitle, imageSrc}: FolderCardProps) => {
  return (
    <div className="relative min-w-[240px] h-[160px] mr-4" >
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ borderRadius: "0"}} 
      />

      <div className="absolute top-5 left-5 text-white text-sm font-semibold">
        {title}
        <div className="text-xs mt-1 font-normal">{subtitle}</div>
      </div>
      <button className="absolute bottom-5 right-5 w-7 h-7 bg-white/40 rounded-full text-white text-xl flex items-center justify-center">
        +
      </button>
    </div>
  );
};

export default FolderCard;
