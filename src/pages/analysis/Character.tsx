
import { useGetCharacter } from "@/api/queries/aboutme/useGetCharacter";
import { useGetEmotionAnalysis } from "@/api/queries/aboutme/useGetEmoanalysis";
import AnimalCard from "@/components/aboutMe/Emotion/AnimalCard";
import Title from "@/components/analysis/Title";

const combination: Record<string, { harmony: string; description_h: string; disHarmony: string , description_d:string}> = {
    "호랑이": {
    harmony: "팬더",
    description_h: "안정되고 따뜻한 팬더는 호랑이의 과열된 에너지를 부드럽게 감싸주며 균형을 맞춰 줍니다.",
    disHarmony: "코브라",
    description_d: "호랑이의 직진성과 코브라의 회피적이고 시기심 많은 성향은 자주 충돌합니다.",
  },
  "새": {
    harmony: "나무늘보",
    description_h: "나무늘보의 느긋한 안정감은 토끼의 불안을 부드럽게 감싸줍니다.",
    disHarmony: "독수리",
    description_d: "독수리는 경쟁과 독립을 중시해, 감정적 지지가 필요한 토끼를 외롭게 만듭니다.",
  },
  "강아지": {
    harmony: "고양이",
    description_h: "서로 민감한 신호를 잘 이해해주는 조합으로, 깊은 공감대가 형성됩니다.",
    disHarmony: "여우",
    description_d: "강아지의 즉각적인 배려는 여우에게 부담스러운 간섭처럼 느껴질 수 있습니다.",
  },
  "고양이": {
    harmony: "강아지",
    description_h: "강아지의 공감 능력이 고양이의 불안을 따뜻하게 다독입니다.",
    disHarmony: "코브라",
    description_d: "서로 불신이 강해, 감정적 소용돌이만 남기고 연결되기 어렵습니다.",
  },
  "팬더": {
    harmony: "나무늘보",
    description_h: "둘 다 느리고 따뜻한 교류를 선호해 깊고 안정적인 관계를 맺습니다.",
    disHarmony: "박쥐",
    description_d: "팬더는 소통을 원하지만 박쥐는 숨기에 바빠 대화 자체가 어려워집니다.",
  },
  "펭귄": {
    harmony: "강아지",
    description_h: "강아지의 섬세한 배려가 펭귄의 외로움을 자연스럽게 덜어줍니다.",
    disHarmony: "거북이",
    description_d: "둘 다 먼저 다가가지 않기에 정적만 길어지며 외로움이 심화됩니다.",
  },
  "나무늘보": {
    harmony: "새",
    description_h: "토끼의 감정 기복을 느긋한 속도로 따뜻하게 받아줍니다.",
    disHarmony: "독수리",
    description_d: "독수리의 재촉과 속도감은 나무늘보를 더 위축시키고 무기력하게 만듭니다.",
  },
  "다람쥐": {
    harmony: "개구리",
    description_h: "둘 다 피로감을 느끼면서도 노력하는 의지가 있어 공감대가 형성됩니다.",
    disHarmony: "박쥐",
    description_d: "감정 표현을 원하는 다람쥐와 숨어버리는 박쥐는 정서적으로 엇갈립니다.",
  },
  "독수리": {
    harmony: "여우",
    description_h: "자율성과 성취를 중시하는 두 존재가 전략적으로 잘 어울립니다.",
    disHarmony: "나무늘보",
    description_d: "속도와 방향성 모두 맞지 않아, 관계가 금방 지치게 됩니다.",
  },
  "코브라": {
    harmony: "박쥐",
    description_h: "복잡한 내면을 지닌 두 존재가 천천히 서로를 이해해 나갈 수 있습니다.",
    disHarmony: "호랑이",
    description_d: "호랑이의 직선적인 에너지에 코브라는 방어적으로 굳어버립니다.",
  },
  "여우": {
    harmony: "독수리",
    description_h: "서로의 독립성과 목표 지향성이 잘 맞아 협력적 관계를 형성합니다.",
    disHarmony: "강아지",
    description_d: "여우에게 강아지의 다가감은 지나치게 빠르고 부담스럽게 느껴집니다.",
  },
  "박쥐": {
    harmony: "코브라",
    description_h: "감정을 숨기는 공통점이 있어 조심스럽게 가까워질 수 있습니다.",
    disHarmony: "팬더",
    description_d: "팬더의 부드러운 대화 시도가 박쥐에게는 부담이 되고, 갈등을 피하게 만듭니다.",
  },
  "고래": {
    harmony: "개구리",
    description_h: "고요한 내면과 점진적인 성장을 중시하는 둘은 말없이 깊이 연결됩니다.",
    disHarmony: "새",
    description_d: "고래는 변화를 싫어하고, 토끼는 감정의 요동을 멈추기 어려워 충돌합니다.",
  },
  "거북이": {
    harmony: "나무늘보",
    description_h: "서두르지 않고 조용히 다가오는 나무늘보와 깊은 신뢰를 쌓습니다.",
    disHarmony: "코브라",
    description_d: "거북이의 느린 신뢰 구축을 코브라는 답답해하고 조급해합니다.",
  },
  "개구리": {
    harmony: "고래",
    description_h: "개구리의 성장 욕구를 고래의 넉넉함이 부드럽게 감싸줍니다.",
    disHarmony: "독수리",
    description_d: "느린 개구리에게 독수리의 성과 중심 태도는 압박으로 작용합니다.",
  },
  "문어": {
    harmony: "팬더",
    description_h: "팬더의 포용력 있는 태도는 문어의 방어적 껍질을 녹이는 데 큰 역할을 합니다.",
    disHarmony: "독수리",
    description_d: "문어는 감정을 나누고 싶지만, 독수리는 그 시간조차 허락하지 않으려 합니다.",
  },
    "unknown": {
    harmony: "데이터 부족",
    description_h: "아직 데이터가 부족해요. 더 데이터를 쌓아 알을 부화시켜봐요.",
    disHarmony: "데이터 부족",
    description_d:"아직 데이터가 부족해요. 더 데이터를 쌓아 알을 부화시켜봐요.",
    },
}



const Character=()=>{
    const token = localStorage.getItem("accessToken") || "";
    const {data: animal, isLoading, isError} = useGetCharacter(token);

    const harmony = combination[animal?.character]?.harmony;
    const description_h = combination[animal?.character]?.description_h;
    const disHarmony = combination[animal?.character]?.disHarmony;
    const description_d = combination[animal?.character]?.description_d;
    
    return(

        <div className="mb-10">
            <Title
                name="캐릭터"
                isBackActive={true}
            />
            <div className="pl-3 pr-3">

              <div className="bg-white rounded-3xl mb-4">
                  <div className="text-xl font-bold p-3"> 당신의 현재 캐릭터는 </div>
                  <AnimalCard
                      animalType={animal?.character}/>

              </div>

              <div className="text-2xl font-bold pt-10 pb-3">다른 동물들과의 궁합</div>
              <div className="grid grid-cols-2 gap-3">
                  <AnimalCard
                      animalType={harmony}
                      script={description_h}/>
                  <AnimalCard
                      animalType={disHarmony}
                      script={description_d}/>
              </div>
            </div>
        </div>
    )

}

export default Character;