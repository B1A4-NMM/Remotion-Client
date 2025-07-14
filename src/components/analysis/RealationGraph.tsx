import EmotionalGraph from "@/pages/Relation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RelationGraph = () => {
    const navigate = useNavigate();

    const handleRelationGraph = () => {
        navigate("/relation");
    };
    
    return (
        <div className="w-full mt-5">
            <div className="rounded-3xl shadow-xl bg-white">
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                    <h1 className="text-lg font-bold text-gray-900">
                        관계 그래프
                    </h1>
                    <button onClick={handleRelationGraph}>
                        <ChevronRight className="text-gray-400 cursor-pointer hover:text-gray-600" />
                    </button>
                </div>
                <hr className="mr-5 ml-5 mb-2"/>
                
                <div className="transition-all duration-30">
                    <div className="p-3 h-[280px] overflow-hidden rounded-[3rem]">
                        <div className="transform scale-70 origin-center w-full h-full -translate-y-80">
                            <EmotionalGraph />
                        </div>
                            <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                                <p className="text-white text-sm font-medium bg-black bg-opacity-75 px-3 py-1 rounded">
                                    클릭하여 자세히 보기
                                </p>
                            </div>
                        </div>
                    <div className="pt-3">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelationGraph;
