// utils/emotionDataConverter.ts
import type { MemberSummaryResponse, ProcessedMemberSummary, EmotionData } from "../types/diary";

// 감정 분류 매핑 (실제 감정명에 따라 조정 필요)
const EMOTION_CATEGORIES = {
  // 관계 기반 감정
  connected: ['감사', '존경', '신뢰', '애정', '친밀', '유대', '사랑', '공감'],
  distanced: ['질투', '시기', '분노', '짜증', '실망', '억울', '속상', '상처', '배신감', '경멸', '거부감', '불쾌'],
  
  // 상태성 감정
  elevated: ['활력', '설렘', '기쁨', '기대', '즐거움', '행복', '흥분'],
  tense: ['긴장', '불안', '초조', '부담', '놀람'],
  calm: ['평온', '편안', '안정', '차분'],
  lethargic: ['피로', '지침', '무기력', '지루', '공허', '외로움', '우울', '슬픔'],
  
  // 자아 감정
  positive: ['자긍심', '자신감', '뿌듯함', '성취감', '만족감'],
  negative: ['부끄러움', '수치', '죄책감', '후회', '뉘우침', '창피', '굴욕']
};

const categorizeEmotion = (emotion: string, category: 'relation' | 'state' | 'self') => {
  if (category === 'relation') {
    if (EMOTION_CATEGORIES.connected.includes(emotion)) return 'connected';
    if (EMOTION_CATEGORIES.distanced.includes(emotion)) return 'distanced';
    return 'connected'; // 기본값
  }
  
  if (category === 'state') {
    if (EMOTION_CATEGORIES.elevated.includes(emotion)) return 'elevated';
    if (EMOTION_CATEGORIES.tense.includes(emotion)) return 'tense';
    if (EMOTION_CATEGORIES.calm.includes(emotion)) return 'calm';
    if (EMOTION_CATEGORIES.lethargic.includes(emotion)) return 'lethargic';
    return 'elevated'; // 기본값
  }
  
  if (category === 'self') {
    if (EMOTION_CATEGORIES.positive.includes(emotion)) return 'positive';
    if (EMOTION_CATEGORIES.negative.includes(emotion)) return 'negative';
    return 'positive'; // 기본값
  }
  
  return 'unknown';
};

export const convertMemberSummaryToEmotionData = (
  summary: MemberSummaryResponse
): ProcessedMemberSummary => {
  // 관계 감정 변환
  const connected: EmotionData[] = [];
  const distanced: EmotionData[] = [];
  
  summary.Relation.forEach(item => {
    const category = categorizeEmotion(item.emotion, 'relation');
    const emotionData = { name: item.emotion, count: item.count };
    
    if (category === 'connected') {
      connected.push(emotionData);
    } else {
      distanced.push(emotionData);
    }
  });

  // 상태 감정 변환
  const elevated: EmotionData[] = [];
  const tense: EmotionData[] = [];
  const calm: EmotionData[] = [];
  const lethargic: EmotionData[] = [];
  
  summary.State.forEach(item => {
    const category = categorizeEmotion(item.emotion, 'state');
    const emotionData = { name: item.emotion, count: item.count };
    
    switch (category) {
      case 'elevated': elevated.push(emotionData); break;
      case 'tense': tense.push(emotionData); break;
      case 'calm': calm.push(emotionData); break;
      case 'lethargic': lethargic.push(emotionData); break;
    }
  });

  // 자아 감정 변환
  const positive: EmotionData[] = [];
  const negative: EmotionData[] = [];
  
  summary.Self.forEach(item => {
    const category = categorizeEmotion(item.emotion, 'self');
    const emotionData = { name: item.emotion, count: item.count };
    
    if (category === 'positive') {
      positive.push(emotionData);
    } else {
      negative.push(emotionData);
    }
  });

  return {
    relationData: { connected, distanced },
    stateData: { elevated, tense, calm, lethargic },
    selfData: { positive, negative }
  };
};
