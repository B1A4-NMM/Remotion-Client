import Title from "@/components/recommend/Title";
import Video from "@/components/recommend/Video";

const Contents=()=>{

    return(
        <div className="base">
            <Title/>

            <div className="flex justify-between px-7">
                <h1 className="text-xl font-bold ">당신을 위해 준비된 영상</h1>
                <span> 모두 보기 </span>
            </div>

            <Video/>

            <div className="flex justify-between px-7">
                <h1 className="text-xl font-bold ">당신을 위해 준비된 영상</h1>
                <span> 모두 보기 </span>
            </div>

            {/* <Video/> */}

        </div>
    );
}

export default Contents;