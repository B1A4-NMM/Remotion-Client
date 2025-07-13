import Title from "@/components/recommend/Title";
import FolderCardList from "@/components/routine/FolderCardList";
import PersonalizedRoutineList from "@/components/routine/PersonalizedRoutineList";


const Routine=()=>{

    const PersonalizedRoutines = [
        { id: 1, title: "물 한잔 마시기" },
        { id: 2, title: "햇빛 쬐기" },
        { id: 3, title: "깊게 십호흡 3번"},
        { id: 4, title: "햇빛 쬐기" },
        { id: 5, title: "햇빛 쬐기" },
        { id: 6, title: "햇빛 쬐기" },
        { id: 7, title: "햇빛 쬐기" },
        { id: 8, title: "햇빛 쬐기" },
        { id: 9, title: "햇빛 쬐기" },
        { id: 10, title: "햇빛 쬐기" },
        { id: 11, title: "햇빛 쬐기" },
        { id: 12, title: "햇빛 쬐기" },
        { id: 13, title: "햇빛 쬐기" },
        { id: 14, title: "햇빛 쬐기" },
        { id: 15, title: "햇빛 쬐기" },
    ];

    return(
        <div className="">
            <Title/>

            <div className="mt-10 flex justify-between px-7">
                <h1 className="text-xl font-bold mb-[20px] ">당신의 루틴</h1>

            </div>

            <FolderCardList/>

            <div className="flex justify-between px-7">
                <h1 className="text-xl font-bold ">하루뒤가 선별한 루틴 </h1>
            </div>

            {/* 루틴 목록 */}

            <PersonalizedRoutineList routines={PersonalizedRoutines} />
        </div>

    );
};

export default Routine;