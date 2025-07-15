import React,{useState, useEffect} from "react";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useGetEmotionAnalysis } from "../../api/queries/aboutme/useGetEmoanalysis";



import type { AnimalKey, AnimalTypeProps } from "@/types/diary";
import { useNavigate } from "react-router-dom";


// 동물 정보 데이터
const animalData: Record<AnimalKey, { name: string; description: string; imgSrc: string }> = {
  호랑이: {
    name: "모두를 리드하는 파워 긍정 호랑이",
    description:
      "항상 팀의 앞에 서서 분위기를 끌어올리는 리더형입니다. 강력한 자신감과 에너지로 주변 사람에게 활력을 전하지만, 가끔은 상대의 페이스를 놓칠 수 있어 세심한 배려가 필요합니다. 새로운 목표가 생기면 누구보다 빨리 달려가며, 함께하는 사람에게도 같은 열정을 기대합니다.",
    imgSrc: "../assets/img/tiger.svg",
  },
  새: {
    name: "밝게 웃지만 속은 불안한 작은 토끼",
    description:
      "처음엔 밝고 사랑스러운 웃음으로 상대를 사로잡지만, 내면엔 '잘하고 있을까?' 하는 걱정이 자리합니다. 사랑과 설렘을 동시에 추구해 감정의 롤러코스터를 자주 타며, 지나간 선택에 대한 후회를 오래 품곤 합니다. 꾸준한 지지와 안전한 공간을 제공해 주면 한층 안정되고 깊은 애정을 보여 줍니다.",
    imgSrc: "../assets/img/rabbit.svg",
  },
  개: {
    name: "지나치게 배려하는 긴장한 강아지",
    description:
      "타인의 감정을 빠르게 캐치해 공감과 도움을 아끼지 않는 '센서'형이지만, 그만큼 자신은 불안을 품고 있습니다. 모든 관계에서 평화를 지키려다 보니 스스로의 욕구를 뒤로 미루는 경우가 많습니다. 적절한 '거절'을 연습하고 성취감을 스스로 인정할 때 더 당당해집니다.",
    imgSrc: "../assets/img/dog.svg",
  },
  고양이: {
    name: "불안한 시선을 가진 예민한 고양이",
    description:
      "친밀함을 원하면서도 작은 신호에 크게 동요하여 자꾸 상대의 마음을 확인하려 합니다. 초조함이 커지면 부끄러움을 감추려 날카로워질 수 있으니, 느긋한 소통이 중요합니다. 자신에게 안전하다고 느끼면 누구보다 다정하고 깊은 유대를 맺습니다.",
    imgSrc: "../assets/img/cat.svg",
  },
  팬더: {
    name: "조용히 따뜻함을 나누는 팬더",
    description:
      "큰 소리보다 잔잔한 대화를 통해 온기를 전하는 평화주의자입니다. 관계 속 안정감을 최우선으로 두고, 상대의 기쁨에 함께 미소 짓는 능력이 탁월합니다. 격렬한 갈등보다 서로를 포근히 감싸는 분위기에서 가장 빛을 발합니다.",
    imgSrc: "../assets/img/panda.svg",
  },
  펭귄: {
    name: "정적 속 외로움을 숨기는 펭귄",
    description:
      "차분한 겉모습 뒤에 '혹시 혼자일까?' 하는 고독을 감추고 있습니다. 신뢰가 형성되면 속마음을 천천히 털어놓으며, 서툴지만 진심 어린 애정을 보여 줍니다. 상대가 섣불리 판단하지 않고 묵묵히 들어줄 때 자존감이 단단해집니다.",
    imgSrc: "../assets/img/penguin.svg",
  },
  나무늘보: {
    name: "무기력해도 다정한 나무늘보",
    description:
      "에너지는 낮아 보여도 정서적 유대에 목마른 따뜻한 관찰자입니다. 느릿한 속도로 이야기를 풀어가며, 상대에게 전해 주는 작은 관심에 큰 뿌듯함을 느낍니다. 서두르지 않고 함께 같은 속도로 걸어주는 사람이 있다면 깊은 친밀감을 쌓습니다.",
    imgSrc: "../assets/img/sloth.svg",
  },
  다람쥐: {
    name: "친구를 갈망하는 외로운 다람쥐",
    description:
      "사교적인 듯 보이지만 금세 지쳐 혼자 남겨질까 두려워합니다. 공감 능력이 높아 주변의 하소연을 잘 들어주지만, 정작 자신의 고단함은 숨긴 채 창피함을 느끼곤 합니다. 진솔한 칭찬과 휴식 기회를 주면 다시 밝은 에너지가 살아납니다.",
    imgSrc: "../assets/img/squirrel.svg",
  },
  독수리: {
    name: "혼자 날며 열정을 쏟는 독수리",
    description:
      "높은 목표를 세우고 스스로를 증명하려는 경쟁심이 강합니다. 때때로 주변의 응원보다 자신의 자긍심에 더 큰 의미를 두어, 질투나 긴장을 동력으로 삼습니다. 함께할 파트너가 도전 의지를 존중해 준다면 깊은 신뢰를 쌓을 수 있습니다.",
    imgSrc: "../assets/img/eagle.svg",
  },
  코브라: {
    name: "화려하지만 마음은 복잡한 코브라",
    description:
      "매력적인 외향 뒤에 시기와 죄책감이 교차하는 내면의 소용돌이를 안고 있습니다. 흥분을 추구해 관계를 빠르게 발전시키지만, 속내를 들키면 상처받을까 걱정합니다. 솔직함과 따뜻한 수용이 균형을 잡아줄 때 진짜 친밀함이 시작됩니다.",
    imgSrc: "../assets/img/cobra.svg",
  },
  여우: {
    name: "조심스럽지만 자기 확신 있는 여우",
    description:
      "첫 만남에 거리를 두고 관찰하지만, 이득이 아닌 신뢰로 관계를 결정합니다. 긴장 속에서도 또렷한 자신감을 유지해, 상대에게 듬직한 인상을 줍니다. 천천히 마음을 열며 장기적으로 의리를 중시합니다.",
    imgSrc: "../assets/img/fox.svg",
  },
  박쥐: {
    name: "긴장 속에 숨는 박쥐",
    description:
      "과한 소음이나 관심에 부담을 느껴 그늘에서 자신을 보호합니다. 짜증과 굴욕감이 올라올 때 말을 아끼지만, 이해심 많은 동행이 있으면 조금씩 밝은 면을 보여 줍니다. 비난 대신 공감하는 태도가 관계 유지의 열쇠입니다.",
    imgSrc: "../assets/img/bat.svg",
  },
  고래: {
    name: "고요한 만족 속에 사는 고래",
    description:
      "넓은 바다처럼 포용력 있지만 때로는 실망을 혼자 삭이는 성향입니다. 큰 변동보다 안정적인 일상을 선호하고, 성취를 이뤘을 때도 요란한 축하 대신 잔잔히 기뻐합니다. 깊은 대화로 꿈을 나누면 묵직한 믿음이 생깁니다.",
    imgSrc: "../assets/img/whale.svg",
  },
  거북이: {
    name: "조용히 방어적인 거북이",
    description:
      "평온해 보이지만 상처받지 않으려 방어벽을 단단히 세우는 타입입니다. 배신감의 기억이 올라올 때 속도를 더욱 늦추지만, 꾸준한 신뢰가 쌓이면 껍질 밖으로 나와 따뜻함을 나눕니다. 서두르지 않는 상황에서 관계가 단단해집니다.",
    imgSrc: "../assets/img/turtle.svg",
  },
  개구리: {
    name: "느리지만 무언가 하려는 의지가 있는 개구리",
    description:
      "무기력한 기분 속에서도 '한 번 해보자'는 작은 용기를 품고 있습니다. 속상함이 밀려오면 잠시 웅크리지만, 성취의 경험이 쌓이면 자존감이 서서히 올라갑니다. 지나친 압박보다 칭찬과 작은 목표가 큰 도움이 됩니다.",
    imgSrc: "../assets/img/frog.svg",
  },
  문어: {
    name: "세상과 단절된 채 가라앉은 문어",
    description:
      "상처와 외로움으로 인해 깊은 곳에 숨으려 하지만, 여전히 연결을 갈망합니다. 후회가 많아 과거 이야기를 반복하기도 하나, 따뜻한 공감이 오면 다리가 뻗어지듯 서서히 세상으로 나옵니다. 안정을 찾기까지 시간을 존중해 주는 것이 중요합니다.",
    imgSrc: "../assets/img/octopus.svg",
  },
  unknown: {
    name: "아직 무엇이 될 지 모를 작은 알",
    description: "아직 데이터가 부족해요. 더 데이터를 쌓아 알을 부화시켜봐요.",
    imgSrc: "../assets/img/bird.svg",
  },
};


const Character=()=>{
  const [animalType, setAnimalType] = useState<{ character: AnimalKey } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const token = localStorage.getItem("accessToken") || "";
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  
  const navigator = useNavigate();
  
  const onClickHandler=()=>{
    navigator("/analysis/character");
  }
    useEffect(() => {
        const fetchCharacter = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/member/character`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            });

            // 올바른 객체 형태로 저장
            setAnimalType({ character: response.data.character as AnimalKey });
        } catch (error) {
            console.error("Error fetching character:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
        };

        fetchCharacter();
    }, [token, BASE_URL]);


    if (isLoading) return <div>로딩 중...</div>;
    if (isError) return <div>캐릭터 정보를 불러오는 데 실패했습니다.</div>;

    if (!animalType) {
        return (
            <span className="max-w-md w-full shadow-lg rounded-3xl p-6">
              <p className="text-center text-gray-500">알 수 없는 동물 타입입니다.</p>
            </span>
        );
      }

    const currentAnimal = animalData[animalType.character];



    return(
        <div className="w-full h-48 mt-5 " >
            {/* 메인 컨테이너 */}
            <div className="rounded-3xl shadow-xl bg-white">
                {/* 헤더 */}
                <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
                <h1 className="text-lg font-bold text-gray-900">
                    캐릭터
                </h1>
                <div onClick={onClickHandler} className="cursor-pointer">
                    <ChevronRight className="text-gray-400"/>
                </div>                </div>
                <hr className="mr-5 ml-5"/>
                <div>
                    <img
                    src={currentAnimal.imgSrc}
                    alt={currentAnimal.name}
                    className="w-full h-24 object-fill mt-2"
                    />
                </div>
                <h2 className="text-base text-center mb-4 text-gray-800 leading-tight p-4">
                    {currentAnimal.name}
                </h2>
            </div>
        </div>
    )
}

export default Character;