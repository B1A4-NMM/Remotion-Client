import Title from "@/components/recommend/Title";
import Video from "@/components/recommend/VideoBox";
import MeditationCard from "@/components/recommend/MeditationCard";
import { motion } from "framer-motion";
import { useRef } from "react";

const Contents = () => {
    const constraintsRef = useRef(null);

    return (
        <motion.div ref={constraintsRef} style={{ height: "100dvh", overflow: "hidden" }}>
            <motion.div
                drag="y"
                dragConstraints={{ top: -500, bottom: 0 }}
                dragElastic={0.2}
                dragMomentum={false}
                style={{ height: "100%"}}
            >
                <Title />

                <div className="flex justify-between px-7 mt-10">
                    <h1 className="text-xl font-bold ">당신을 위해 준비된 영상</h1>
                </div>

                <Video />

                <div className="flex justify-between px-7 mt-10">
                    <h1 className="text-xl font-bold ">마음 비워내기</h1>
                </div>

                <MeditationCard />
            </motion.div>
        </motion.div>
    );
};

export default Contents;
