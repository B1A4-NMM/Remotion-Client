import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Title = ({name, isBackActive=false, back="/analysis"}:{name:string, isBackActive:boolean, back:string}) => {
  const navigate = useNavigate();

  const onClickHandler=()=>{
    navigate(back)
  }

  // name 길이에 따른 폰트 크기 계산 함수
  const getFontSizeClass = (nameLength: number) => {
    if (nameLength <= 4) return "text-3xl"; // 30px
    if (nameLength <= 6) return "text-2xl"; // 24px  
    if (nameLength <= 8) return "text-xl";  // 20px
    if (nameLength <= 10) return "text-lg"; // 18px
    return "text-base"; // 16px
  }

  // 더 세밀한 조정이 필요한 경우 인라인 스타일 사용
  const getFontSize = (nameLength: number) => {
    const baseSize = 32; // text-3xl 기본 크기
    const minSize = 25;  // 최소 크기
    
    if (nameLength <= 8) return baseSize;
    
    // 4글자 초과 시 1글자당 2px씩 감소
    const reducedSize = baseSize - (nameLength - 4) * 4;
    return Math.max(reducedSize, minSize);
  }

  return (
    <>
      <div className="w-full ">
        {/* 메인 헤더 */}
        <div className="flex items-center justify-between px-4 py-8 ">
          {isBackActive? (
              <>
                <div className="flex items-center">
                  <button onClick={onClickHandler} className="flex items-center gap-1">
                    <ChevronLeft className="size-8 text-gray-600"/>
                  </button>
                </div>
                <h1 
                  className={`font-bold text-gray-900 ${getFontSizeClass(name.length)}`}
                  style={{fontSize: `${getFontSize(name.length)}px`}}
                >
                  {name}
                </h1>
              </>
          ):(
            <>
              <h1 
                className="font-bold text-gray-900 text-3xl"
              >
                {name}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full text-foreground border border-border hover:bg-secondary focus:ring-2 focus:ring-primary transition-colors box-shadow shadow-xl"
                  aria-label="검색"
                  onClick={() => navigate("/analysis")}
                >
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-big-icon lucide-chart-column-big">
                    <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
                    <rect x="15" y="5" width="4" height="12" rx="1"/><rect x="7" y="8" width="4" height="9" rx="1"/>
                  </svg>

                  </button>

                  <button
                  className="p-2 rounded-full text-foreground border border-border hover:bg-secondary focus:ring-2 focus:ring-primary transition-colors box-shadow shadow-xl"
                  aria-label="검색"
                  onClick={() => navigate("/relation")}
                >
                 
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-network-icon lucide-chart-network">
                  <path d="m13.11 7.664 1.78 2.672"/>
                  <path d="m14.162 12.788-3.324 1.424"/>
                  <path d="m20 4-6.06 1.515"/>
                  <path d="M3 3v16a2 2 0 0 0 2 2h16"/><circle cx="12" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="15" r="2"/>
                  </svg>

                  </button>
                </div>
            </>
            
          )}
        </div>
      </div>
    </>
  );
}

export default Title;
