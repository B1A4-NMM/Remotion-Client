import { ChevronRight } from "lucide-react";

const RelationCard=()=>{
    return(
        <div className="w-full mt-5 " >
            {/* 메인 컨테이너 */}
            <div className="rounded-3xl shadow-xl bg-white">
                {/* 헤더 */}
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                <h1 className="text-lg font-bold text-gray-900">
                    관계에 관한 20가지 감정
                </h1>
                <ChevronRight className="text-gray-400"/>
                </div>
                <hr className="mr-5 ml-5"/>
                <div className="h-40">
                </div>
            </div>
        </div>
    )
}

const SelfCard=()=>{
    return(
        <div className="w-full mt-5 " >
            {/* 메인 컨테이너 */}
            <div className="rounded-3xl shadow-xl bg-white">
                {/* 헤더 */}
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                <h1 className="text-lg font-bold text-gray-900">
                    User Names에 관한 12가지 감정
                </h1>
                <ChevronRight className="text-gray-400"/>
                </div>
                <hr className="mr-5 ml-5"/>
                <div className="h-40">
                </div>
            </div>
        </div>
    )
}

const StateCard=()=>{
    return(
        <div className="w-full mt-5 " >
            {/* 메인 컨테이너 */}
            <div className="rounded-3xl shadow-xl bg-white">
                {/* 헤더 */}
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                <h1 className="text-lg font-bold text-gray-900">
                    상황에 관한 20가지 감정
                </h1>
                <ChevronRight className="text-gray-400"/>
                </div>
                <hr className="mr-5 ml-5"/>
                <div className="h-40">
                </div>
            </div>
        </div>
    )
}

const EmotionCards=()=>{
    return(
        <div>
            <RelationCard/>
            <SelfCard/>
            <StateCard/>
        </div>
    )
}

export default EmotionCards;