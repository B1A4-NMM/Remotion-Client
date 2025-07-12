import Title from "@/components/recommend/Title";
import FolderCardList from "@/components/routine/FolderCardList";


const Routine=()=>{

    return(

        <div >
            <Title/>

            <div className="mt-[78px] flex justify-between px-7">
                <h1 className="text-xl font-bold mb-[20px] ">당신의 루틴</h1>

            </div>

            <FolderCardList/>

            <div className="flex justify-between px-7">
                <h1 className="text-xl font-bold ">테마 별 루틴 </h1>
            </div>

            {/* <Video/> */}

        </div>
        
        
    );
}

export default Routine;