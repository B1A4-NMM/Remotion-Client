import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Title = ({name, isBackActive=false, back="/analysis"}:{name:string, isBackActive:boolean, back:string}) => {
  const navigator = useNavigate();

  const onClickHandler=()=>{
    navigator(back)
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
                      심층 분석
                    </span>
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              </>
          ):(
            <h1 className="text-3xl font-bold text-gray-900 ">{name}</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Title;
