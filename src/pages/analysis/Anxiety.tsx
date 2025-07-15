import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import Stress from "@/components/analysis/Stress";
import Depress from "@/components/analysis/Depress";
import Title from "@/components/analysis/Title";

const Anxiety=()=>{
    const {data}= useMentalData("불안", 365) //최근 
    return(

        <div className="mb-10">
            <Title
                name="불안"
                isBackActive={true}
            />
            <div className="bg-white rounded-3xl shadow-xl mb-4">
                <div className="text-xl font-bold p-3"> 일자별 불안 수치</div>
                <MentalChart
                    type="불안"
                    data={data?.date??[]}/>

            </div>

            <div className="bg-white rounded-3xl shadow-xl mb-4">
            <div className="text-xl font-bold pt-5 pl-5 pb-2"> 불안을 느낀 활동</div>
                <ActivitySection type="불안" data={data?.activities ?? []} />
            <div className="text-xl font-bold pt-5 pl-5 mt-10"> 불안하게 한 사람들</div>
                <PeopleSection type="불안" data={data?.people ?? []} />
            </div>


            <div className="text-2xl font-bold pt-10">다른 심리 상태 둘러보기</div>
            <div className="grid grid-cols-2 gap-3">
                <Stress/>
                <Depress/>                
            </div>

            
        </div>
    )

}

export default Anxiety;