// 동물 정보 데이터
const animalData: Record<string, { name: string; description: string; imgSrc: string }> = {
  호랑이: {
    name: "모두를 리드하는 파워 긍정 호랑이",
    description:
      "항상 팀의 앞에 서서 분위기를 끌어올리는 리더형입니다. 강력한 자신감과 에너지로 주변 사람에게 활력을 전하지만, 가끔은 상대의 페이스를 놓칠 수 있어 세심한 배려가 필요합니다. 새로운 목표가 생기면 누구보다 빨리 달려가며, 함께하는 사람에게도 같은 열정을 기대합니다.",
    imgSrc: "../assets/img/tiger.svg",
  },
  새: {
    name: "밝게 웃지만 속은 불안한 토끼",
    description:
      "처음엔 밝고 사랑스러운 웃음으로 상대를 사로잡지만, 내면엔 '잘하고 있을까?' 하는 걱정이 자리합니다. 사랑과 설렘을 동시에 추구해 감정의 롤러코스터를 자주 타며, 지나간 선택에 대한 후회를 오래 품곤 합니다. 꾸준한 지지와 안전한 공간을 제공해 주면 한층 안정되고 깊은 애정을 보여 줍니다.",
    imgSrc: "../assets/img/rabbit.svg",
  },
  강아지: {
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
    name: "정적 속 외로움을 숨기는 물범",
    description:
      "겉으론 평온하고 신뢰를 주지만, 내면에 깊은 외로움이 자리합니다. 감정을 표현하기보단 조용히 삼키며 주변을 배려합니다. 말없이 함께 있어주는 사람이 있을 때 마음의 문을 열고, 자신도 모르게 따뜻한 감정을 나누게 됩니다.",
    imgSrc: "../assets/img/seal.svg",
  },
  나무늘보: {
    name: "무기력해도 다정한 돼지",
    description:
      "에너지가 부족할 땐 쉽게 늘어지지만, 관계에선 따뜻함을 잃지 않는 성향입니다. 혼자 있는 시간이 길어도 주변의 애정 어린 시선에는 민감하게 반응하며, 작고 소박한 인정에도 큰 위로를 느낍니다. 무리하지 않는 속도로 관계를 이어가려 합니다.",
    imgSrc: "../assets/img/pig.svg",
  },
  다람쥐: {
    name: "친구를 갈망하는 외로운 들소",
    description:
      "겉으론 강해 보여도 속으론 외로움에 흔들리는 감수성 높은 유형입니다. 주변에 기대고 싶지만 쉽게 말하지 못하고, 무기력함 속에서도 누군가와의 연결을 갈망합니다. 진심을 알아봐 주는 단 한 명의 친구가 세상과의 다리를 놓아줄 수 있습니다.",
    imgSrc: "../assets/img/buffalo.svg",
  },
  독수리: {
    name: "혼자 날며 열정을 쏟는 독수리",
    description:
      "높은 목표를 세우고 스스로를 증명하려는 경쟁심이 강합니다. 때때로 주변의 응원보다 자신의 자긍심에 더 큰 의미를 두어, 질투나 긴장을 동력으로 삼습니다. 함께할 파트너가 도전 의지를 존중해 준다면 깊은 신뢰를 쌓을 수 있습니다.",
    imgSrc: "../assets/img/eagle.svg",
  },
  코브라: {
    name: "화려하지만 마음은 복잡한 뱀",
    description:
      "매력적인 외향 뒤에 시기와 죄책감이 교차하는 내면의 소용돌이를 안고 있습니다. 흥분을 추구해 관계를 빠르게 발전시키지만, 속내를 들키면 상처받을까 걱정합니다. 솔직함과 따뜻한 수용이 균형을 잡아줄 때 진짜 친밀함이 시작됩니다.",
    imgSrc: "../assets/img/snake.svg",
  },
  여우: {
    name: "조심스럽지만 자기 확신 있는 여우",
    description:
      "첫 만남에 거리를 두고 관찰하지만, 이득이 아닌 신뢰로 관계를 결정합니다. 긴장 속에서도 또렷한 자신감을 유지해, 상대에게 듬직한 인상을 줍니다. 천천히 마음을 열며 장기적으로 의리를 중시합니다.",
    imgSrc: "../assets/img/fox.svg",
  },
  박쥐: {
    name: "긴장 속에 숨는 사슴",
    description:
      "다정한 관계를 원하지만 자신감이 부족해 쉽게 움츠러드는 유형입니다. 상대의 시선에 민감하며, 짐작과 부담으로 인해 자주 긴장합니다. 자신을 솔직하게 드러내는 법을 배운다면 훨씬 유연하고 따뜻한 연결을 만들 수 있습니다.",
    imgSrc: "../assets/img/deer.svg",
  },
  고래: {
    name: "고요한 만족 속에 사는 코끼리",
    description:
      "말은 적지만 깊은 감정과 기억을 품은 존재입니다. 감정 표현은 느리지만 진심은 변하지 않으며, 관계 속 성취감과 신뢰를 중시합니다. 조용한 환경에서 꾸준히 쌓아온 유대가 오히려 강한 결속력을 만들어냅니다.",
    imgSrc: "../assets/img/elephant.svg",
  },
  거북이: {
    name: "조용히 방어적인 코알라",
    description:
      "겉으로는 느긋하고 평온해 보여도, 내면에선 상처를 경계하며 거리를 유지하려 합니다. 상대로부터 받은 실망을 오랫동안 품으며, 쉽게 마음을 열지 않습니다. 믿음이 형성되면 서서히 자신의 따뜻한 면모를 드러냅니다.",
    imgSrc: "../assets/img/austalia.svg",
  },
  개구리: {
    name: "무언가 하려는 의지가 있는 소",
    description:
      "에너지가 떨어질 땐 무기력함에 빠지지만, 스스로를 다시 움직이려는 의지가 있습니다. 한 번 동기부여가 생기면 강한 추진력을 보이며, 주변의 격려가 변화를 돕는 중요한 자극이 됩니다. 느리지만 꾸준히 회복하고 성장하는 유형입니다.",
    imgSrc: "../assets/img/cow.svg",
  },
  문어: {
    name: "세상과 단절된 곰",
    description:
      "표정과 말은 적지만 내면엔 말할 수 없는 상처와 후회가 켜켜이 쌓여 있습니다. 세상과의 연결을 단절한 듯 보이지만, 따뜻한 접근이 있다면 천천히 반응을 보이기 시작합니다. 깊이 있는 신뢰를 줄 수 있는 사람이 필요합니다.",
    imgSrc: "../assets/img/bear.svg",
  },
  unknown: {
    name: "아직 무엇이 될 지 모를 작은 알",
    description: "아직 데이터가 부족해요. 더 데이터를 쌓아 알을 부화시켜봐요.",
    imgSrc: "../assets/img/egg.svg",
  },
};

const AnimalCard = ({
  animalType,
  script = "",
  isMain,
}: {
  animalType: string;
  script: string;
  isMain: boolean;
}) => {
  // 현재 동물 정보 가져오기
  const currentAnimal = animalData[animalType] || animalData.unknown;

  // 동물 타입이 잘못된 경우 처리
  if (!currentAnimal) {
    return (
      <div className="flex justify-center p-6">
        <p className="text-center text-gray-500">알 수 없는 동물 타입입니다.</p>
      </div>
    );
  }

  if (animalType === "unknown") {
    return (
      <div className="flex justify-center p-6 pb-10">
        <p className="text-center text-gray-500">데이터가 없습니다. 일기를 작성해 주세요!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full rounded-3xl overflow-hidden ">
        <img
          src={currentAnimal.imgSrc}
          alt={currentAnimal.name}
          className="w-full max-h-28 object-fill mb-4 mt-4"
        />
        <div className="pl-3 pr-3 pb-6">
          <h2 className="text-lg font-semibold text-center mb-4 text-gray-800 leading-tight">
            {currentAnimal.name}
          </h2>
          {isMain ? (
            <div></div>
          ) : (
            <p className="text-bg text-gray-800 leading-relaxed text-justify">
              {script ? script : currentAnimal.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
