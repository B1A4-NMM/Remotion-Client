import { ChevronRight } from "lucide-react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { useMentalData } from "./../../api/queries/aboutme/useMentalData";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../Loading";

const Vitality = () => {
  const navigator = useNavigate();
  const onClickHandler = () => {
    navigator("/analysis/vitality");
  };
  const { data, isLoading } = useMentalData("활력", 365);
  return (
    <div className="w-full mt-5 ">
      <div className="rounded-3xl shadow-xl bg-white">
        <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
          <h1 className="text-lg font-bold text-gray-900">활력</h1>
          <div onClick={onClickHandler} className="cursor-pointer">
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
        <hr className="mr-5 ml-5" />
        <div className="h-44 content-end">
          <div className="h-fit">
            {isLoading ? <LoadingAnimation /> : <MentalChart type={"활력"} data={data.date} limit={4} />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vitality; 