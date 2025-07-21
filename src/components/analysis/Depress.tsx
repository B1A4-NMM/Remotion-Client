import { ChevronRight } from "lucide-react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { useMentalData } from "./../../api/queries/aboutme/useMentalData";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../Loading";



const Depress=()=>{
    const navigator= useNavigate();

    const onClickHandler=()=>{
        navigator("/analysis/depress");
    }

    const { data, isLoading } = useMentalData("우울", 365); // 최근 3일치
    
    return(
        <div className="w-full mt-5 " >
            {/* 메인 컨테이너 */}
            <div className="rounded-3xl shadow-xl bg-white">
                {/* 헤더 */}
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                <h1 className="text-lg font-bold text-gray-900">
                    우울
                </h1>
                <div onClick={onClickHandler} className="cursor-pointer">
                    <ChevronRight className="text-gray-400"/>
                </div>
                </div>
                <hr className="mr-5 ml-5"/>
                <div className="h-44 content-end">
                    <div className="h-fit">
                    {isLoading? (
                        <LoadingAnimation />
                        ) : (
                        <MentalChart type={"우울"} data={data.date} limit={4} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Depress;