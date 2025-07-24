import Title from '@/components/analysis/Title';
import React, { useState } from 'react';

const FAQ = () => {
  // 단일 인덱스 대신 배열로 여러 개의 열린 상태 관리
  const [openIndexes, setOpenIndexes] = useState([]);

  const faqs = [
    {
        question: '감정은 총 몇 종류가 있나요?',
        answer: `
        감정은 총 57가지가 있고, 3 종류로 나뉩니다.

        • 관계 기반 감정: 
            1. 연결 지향형 감정: 감사, 존경, 신뢰, 애정, 친밀, 유대, 사랑, 공감
            2. 거리 지향형 감정: 질투, 시기, 분노, 짜증, 실망, 억울, 속상, 상처, 배신감, 경멸, 거부감, 불쾌

        • 상태성 감정: 
            1. 고양(에너지 넘치고 긍정적인 상태) : 활력, 설렘, 기쁨, 기대, 즐거움, 행복, 흥분
            2. 긴장(에너지가 높지만 불안정한 상태): 긴장, 불안, 초조, 부담, 놀람
            3. 평온(안정적이고 잔잔한 긍정 상태): 평온, 편안, 안정, 차분
            4. 무기력(에너지가 낮고 정서고 침체된 상태): 피로, 지침, 무기력, 지루, 공허, 외로움, 우울, 슬픔

        • 자기 자신에 대한 감정:
            1. 긍정적 자아: 자긍심, 자신감, 뿌듯함, 성취감, 만족감
            2. 부정적 자아: 부끄러움, 수치, 죄책감, 후회, 뉘우침, 창피, 굴욕
        
        `
    },
    {
      question: '이슬의 각 색상은 무엇을 의미하나요?',
      answer: `이슬은 초록색, 노란색, 파란색, 빨간색의 4가지 색상으로 표현됩니다.

      긍정적인 감정이 강하게 나타나면 초록색, 약하게 나타나면 노란색으로 표현됩니다.

      부정적인 감정이 강하게 나타나면 빨간색, 약하게 나타나면 파란색으로 표현됩니다.
      `
    },
    {
      question: '심리 검사는 신뢰성 있는 검사인가요?',
      answer: `네. PHQ-9(우울검사)는 DSM-5의 주요 우울증 진단 기준을 바탕으로 한 자가 보고형 우울증 선별 도구로써, 민감도(Sensitivity)·특이도(Specificity)는 약 88%로 우울증 선별에서 높은 정확도를 자랑합니다. 또한 신뢰도 지표와 재검사 신뢰도 역시 매우 좋은 검사 도구입니다. 

      GAD-7(불안 검사)는 범불안장애(GAD)의 중증도 평가를 위해 2006년 Spitzer 등 연구진이 개발한 7문항의 자가 보고식 척도로, 다수 연구에서 Cronbach's α = 0.89 - 0.92 수준의 매우 높은 내적 일관성과, test-retest 신뢰도 ICC ≈ 0.83로 안정적 평가도구임이 확인되었습니다.

      PSS(스트레스 검사)는 Cohen과 동료들이 1983년에 개발한 자가 보고형 스트레스 평가 도구로, 내적 일관성과 재검사 신뢰도가 높은 검사 도구입니다. 
      `
    },
    {
        question: '오늘 사건 리포트는 무엇인가요?',
        answer: `오늘 사건 리포트는 일기에 나타난 특정 문제 상황을 어떤 방식을 통해 해결했으며, 이 행동이 어떠한 갈등 대응 방식에 해당하는지를 나타냅니다.

        갈등 대응 분류는 Thomas-Kilmann Conflict Mode Instrument (TKI)를 사용하였습니다. TKI는 갈등 상황에서의 대응 방식을 5가지로 분류한 조직행동론 모델입니다.
        • 회피형: 갈등 자체를 피하거나 무시
        • 경쟁형: 자기주장을 강하게 밀어붙임
        • 타협형: 중간 지점에서 절충
        • 수용형: 상대 의견에 맞춤
        • 협력형: 함께 최선의 해결책을 찾음
        `
    },
    {
        question: '감정 타임라인이 무엇인가요?',
        answer: `감정 타임라인은 4일 전부터 해당 일기를 작성한 시점까지의 감정 변화를 나타내는 그래프입니다. 
        그래프가 0점을 기준으로 위로 올라가 있다면 해당 날자의 일기는 전반저긍로 긍정적이었다는 의미이며, 아래로 내려가 있다면 그날은 전반적으로 부정적인 감정을 느꼈다는 의미입니다.
        `
    },
    {
        question: '나만의 감정 회복 루틴이 무엇인가요?',
        answer: `감정 회복 루틴은 부정적인 감정을 완화하는 개인별 맞춤 방법을 제안하는 기능입니다.

        예를 들어, 과거 일기에서 '불안한 상황'에 '심호흡하기'를 통해 감정이 호전되었다는 기록이 있다면, 이후 비슷한 불안 감정이 나타날 때 '심호흡하기'를 추천해드립니다.
        즉, 사용자의 일기 데이터를 분석하여 효과적이었던 대처 방법을 학습하고, 유사한 감정 상황에서 개인화된 솔루션을 제공하는 시스템입니다.
        
        회복 루틴 관리는 추천 탭의 회복 루틴에서 추가 및 삭제가 가능합니다.
        `
    },
    {
        question: '캐릭터는 어떤 기준으로 변경되나요? / 캐릭터는 몇 종류가 있나요?',
        answer: `
        캐릭터는 총 16종류가 있으며, 사용자가 주로 느끼는 감정의 종류에 따라 변화합니다.
        다양한 일기를 작성하여 캐릭터를 변경해 보세요!
        `
    },
    {
        question: '추천 영상이 없어요!',
        answer: `
        영상은 7일 내로 작성한 일기를 바탕으로 추천됩니다. 또한 작성한 일기가 모두 긍정적이고 아무런 문제도 나타나지 않았다면 추천되는 영상이 없을 수 있어요. 
        `
    },
    {
        question: '푸시 알림이 오지 않아요.',
        answer: `
        푸시 알림을 허용하였는지 확인 해 주세요. 만약 웹 푸시 알림을 지원하지 않는 브라우저를 사용중이시라면 웹 푸시가 가지 않을 수 있습니다.
        `
    },
    
    
  ];

  const toggleFAQ = (index) => {
    if (openIndexes.includes(index)) {
      // 이미 열려있으면 해당 인덱스만 제거 (닫기)
      setOpenIndexes(openIndexes.filter(i => i !== index));
    } else {
      // 닫혀있으면 배열에 추가 (열기)
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <>
      <Title name="FAQ" isBackActive={true} back="/mypage" />
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {faqs.map((faq, index) => (
          <div key={index}>
            {/* 질문 부분 (Q) - 클릭 가능한 헤더 */}
            <div
              onClick={() => toggleFAQ(index)}
              className='bg-white cursor-pointer p-4 mt-4 flex justify-between'
            >
              <span>Q. {faq.question}</span>
              <span style={{ 
                transform: openIndexes.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}>
                ▼
              </span>
            </div>
            
            {/* 답변 부분 (A) - 드롭다운 콘텐츠 */}
            {openIndexes.includes(index) && (
              <div className='bg-white p-4 mb-4'
              style={{ whiteSpace: 'pre-line' }}>
                <strong>A.</strong> {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;