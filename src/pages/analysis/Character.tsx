import { useGetCharacter } from "@/api/queries/aboutme/useGetCharacter";
import { useGetEmotionAnalysis } from "@/api/queries/aboutme/useGetEmoanalysis";
import { useGetAuthTest } from "@/api/queries/auth/useGetAuthTest";
import AnimalCard from "@/components/aboutMe/Emotion/AnimalCard";
import Title from "@/components/analysis/Title";

const combination: Record<
  string,
  { harmony: string; description_h: string; disHarmony: string; description_d: string }
> = {
  호랑이: {
    harmony: "팬더",
    description_h:
      "호랑이의 넘치는 추진력을 팬더는 부드럽고 안정된 에너지로 감싸주며, 균형과 따뜻함을 불어넣습니다.",
    disHarmony: "코브라",
    description_d:
      "직진적인 호랑이와 감정적으로 복잡한 코브라는 서로의 방식을 이해하지 못해 자주 부딪힙니다.",
  },
  새: {
    harmony: "나무늘보",
    description_h:
      "새의 감정 기복을 나무늘보의 느긋하고 따뜻한 태도가 편안하게 안정시켜줍니다.",
    disHarmony: "고래",
    description_d:
      "변화를 추구하는 새와 고요함을 지키려는 고래는 속도와 방향이 달라 쉽게 멀어집니다.",
  },
  강아지: {
    harmony: "펭귄",
    description_h:
      "강아지의 섬세한 배려는 펭귄의 조용한 외로움을 자연스럽게 감싸고 치유합니다.",
    disHarmony: "여우",
    description_d:
      "강아지의 즉각적인 배려는 여우에게는 조심스러움 없이 들이대는 부담으로 느껴질 수 있습니다.",
  },
  고양이: {
    harmony: "강아지",
    description_h:
      "강아지의 따뜻한 공감이 예민한 고양이의 불안한 마음을 부드럽게 다독입니다.",
    disHarmony: "코브라",
    description_d:
      "서로 예민하고 불신이 강해 감정 소모가 크며, 오해가 반복됩니다.",
  },
  팬더: {
    harmony: "문어",
    description_h:
      "곰의 방어적인 내면을 팬더의 포용력이 조심스럽게 감싸며, 신뢰를 만들어냅니다.",
    disHarmony: "사슴",
    description_d:
      "소통을 원하는 팬더와 감정을 숨기는 사슴은 오해 속에서 멀어지기 쉽습니다.",
  },
  펭귄: {
    harmony: "강아지",
    description_h:
      "강아지의 섬세한 이해는 물범의 조용한 외로움을 완화하고 유대감을 만들어줍니다.",
    disHarmony: "거북이",
    description_d:
      "둘 다 쉽게 다가가지 않기 때문에, 관계가 정체되고 깊어지기 어렵습니다.",
  },
  나무늘보: {
    harmony: "새",
    description_h:
      "토끼의 감정 기복을 나무늘보가 느긋하게 받아주며, 감정의 균형을 이룹니다.",
    disHarmony: "독수리",
    description_d:
      "성과를 중시하는 독수리는 돼지의 느린 속도에 인내심을 잃기 쉽습니다.",
  },
  다람쥐: {
    harmony: "개구리",
    description_h:
      "둘 다 외롭고 무기력하지만, 서로를 이해하려는 노력을 통해 따뜻한 공감대를 만듭니다.",
    disHarmony: "박쥐",
    description_d:
      "감정 표현을 원하는 다람쥐와 감정을 숨기려는 사슴은 서로를 이해하지 못합니다.",
  },
  독수리: {
    harmony: "여우",
    description_h:
      "목표 지향적이고 독립적인 성향이 잘 맞아, 시너지를 내는 관계입니다.",
    disHarmony: "곰",
    description_d:
      "감정적 연결을 원하는 곰에겐 독수리의 냉정한 태도가 상처가 됩니다.",
  },
  코브라: {
    harmony: "박쥐",
    description_h:
      "감정을 감추는 두 존재가 서로의 복잡함을 조심스럽게 이해해 갑니다.",
    disHarmony: "호랑이",
    description_d:
      "뱀은 호랑이의 직진적인 태도에 위축되며, 감정적으로 고립됩니다.",
  },
  여우: {
    harmony: "독수리",
    description_h:
      "서로의 자율성과 실용적 태도가 조화를 이루며, 안정된 파트너십을 형성합니다.",
    disHarmony: "강아지",
    description_d:
      "여우에게 강아지의 직진적인 배려는 부담스럽고 감정적으로 빠르다고 느껴집니다.",
  },
  박쥐: {
    harmony: "코브라",
    description_h:
      "감정을 숨기는 성향이 유사해, 시간은 걸리지만 진솔한 유대를 형성할 수 있습니다.",
    disHarmony: "팬더",
    description_d:
      "팬더의 따뜻한 관심조차 박쥐에게는 지나친 부담으로 느껴질 수 있습니다.",
  },
  고래: {
    harmony: "개구리",
    description_h:
      "느리고 꾸준한 두 존재는 서로를 재촉하지 않으며, 깊고 조용한 유대를 맺습니다.",
    disHarmony: "새",
    description_d:
      "코끼리의 고요함과 토끼의 요동치는 감정은 서로를 이해하지 못한 채 멀어집니다.",
  },
  거북이: {
    harmony: "돼지",
    description_h:
      "서두르지 않고 신뢰를 천천히 쌓는 두 존재는 서로에게 편안한 쉼터가 됩니다.",
    disHarmony: "코브라",
    description_d:
      "코알라의 느린 접근 방식이 뱀에겐 답답하게 느껴지며, 관계가 지치기 쉽습니다.",
  },
  개구리: {
    harmony: "코끼리",
    description_h:
      "소의 느린 성장 욕구를 코끼리가 차분히 지지해주며, 함께 나아갑니다.",
    disHarmony: "독수리",
    description_d:
      "소은 자신만의 속도를 유지하고 싶지만, 독수리는 빠른 성과를 원합니다.",
  },
  문어: {
    harmony: "팬더",
    description_h:
      "팬더의 따뜻한 관심은 곰의 방어적인 내면을 부드럽게 녹여줍니다.",
    disHarmony: "독수리",
    description_d:
      "곰은 감정적 유대를 원하지만, 독수리는 실용과 속도를 중시해 서로 상처받기 쉽습니다.",
  },
  unknown: {
    harmony: "데이터 부족",
    description_h: "아직 데이터가 부족해요. 더 데이터를 쌓아 알을 부화시켜봐요.",
    disHarmony: "데이터 부족",
    description_d: "아직 데이터가 부족해요. 더 데이터를 쌓아 알을 부화시켜봐요.",
  },
};



const Character = () => {
  const { data: animal, isLoading, isError } = useGetCharacter();
  const {data:authData} = useGetAuthTest();
  const apiUser = authData?.user;
  const nickname = apiUser?.nickname ||"하루뒤";

  const harmony = combination[animal?.character]?.harmony;
  const description_h = combination[animal?.character]?.description_h;
  const disHarmony = combination[animal?.character]?.disHarmony;
  const description_d = combination[animal?.character]?.description_d;

  return (
    <>
    <Title name="캐릭터" isBackActive={true}  back="/analysis"/>
      <div className="px-4 py-5 text-foreground min-h-screen space-y-10 ">
        <section className="bg-white rounded-xl shadow pt-6 pl-6 pr-6">
          <div className="flex justify-between mb-5">
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">{nickname}님의 동물은</h3>
          </div>
          <AnimalCard animalType={animal?.character} script="" isMain={false}/>
        </section>

        {animal?.character==="unknown" ?
        (
          <div>
          </div>
        ):
        (
          <>
            <div className="text-2xl font-bold pt-10">다른 동물들과의 궁합</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow-sm">
                <AnimalCard animalType={harmony} script={description_h} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm">
                <AnimalCard animalType={disHarmony} script={description_d} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Character;
