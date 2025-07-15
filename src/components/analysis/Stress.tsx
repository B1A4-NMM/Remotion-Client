import { ChevronRight } from "lucide-react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { useMentalData } from "./../../api/queries/aboutme/useMentalData";
import { useNavigate } from "react-router-dom";


const Stress=()=>{
    const navigator= useNavigate();

    const onClickHandler=()=>{
        navigator("/analysis/Stress");
    }
    const { data } = useMentalData("스트레스", 4); // 최근 3일치
    return(
        <div className="w-full mt-5 " >
            {/* 메인 컨테이너 */}
            <div className="rounded-3xl shadow-xl bg-white">
                {/* 헤더 */}
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                <h1 className="text-lg font-bold text-gray-900">
                    스트레스
                </h1>
                <div onClick={onClickHandler} className="cursor-pointer">
                    <ChevronRight className="text-gray-400"/>
                </div>
                </div>
                <hr className="mr-5 ml-5"/>
                <div className="h-44 content-end">
                    <div className="h-fit">
                        <MentalChart type={"스트레스"} data={data?.date ?? []} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stress;