import Anxiety from "@/components/analysis/Anxiety";
import Character from "@/components/analysis/Character";
import Depress from "@/components/analysis/Depress";
import EmotionCards from "@/components/analysis/EmotionCards";
import RelationGraph from "@/components/analysis/RealationGraph";
import StrengthGraph from "@/components/analysis/StrengthGraph";
import Stress from "@/components/analysis/Stress";
import Title from "@/components/analysis/Title";


const Analysis=()=>{

    return(
      <div className="pl-3 pr-3   text-foreground min-h-screen">
        <Title name={"심층 분석"} isBackActive={false}/>
        <StrengthGraph
            userName="user Name"/>

        <div className="grid grid-cols-2 gap-2 grid-rows-2 h-100" >

            <Stress />
            <Anxiety/>
            <Depress/>
            <Character/>
        </div>
        <RelationGraph/>
        <EmotionCards/>


      </div>  

    );

}

export default Analysis;