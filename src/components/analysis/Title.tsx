import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Title = ({name, isBackActive=false, back="/analysis"}:{name:string, isBackActive:boolean, back:string}) => {
  const navigate = useNavigate();

  const onClickHandler=()=>{
    navigate(back)
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
                    <span className="text-xl">
                      감정 추이
                    </span>
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              </>
          ):(
            <>
              <h1 className="text-3xl font-bold text-gray-900 ">{name}</h1>
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
