// components/ActivityCard.tsx
import { motion } from 'framer-motion';
import type { ActivityCardData } from '../utils/activityCardUtils';

import '../../../src/styles/button.css';
interface ActivityCardProps {
  card: ActivityCardData; // ActivityCard가 아닌 ActivityCardData 사용
  index: number;
}

const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      // High Energy / Pleasant
      '행복': '😊', '기쁨': '😄', '즐거움': '😆', '설렘': '🤩', 
      '흥분': '🤯', '활력': '⚡', '자긍심': '😎', '자신감': '💪',
      '뿌듯함': '🥳', '성취감': '🏆', '사랑': '❤️', '애정': '💕',
      '기대': '🤗', '놀람': '😮',
  
      // High Energy / Unpleasant  
      '분노': '😡', '짜증': '😤', '질투': '😒', '시기': '🙄',
      '경멸': '😠', '거부감': '🤢', '불쾌': '😫', '긴장': '😬',
      '불안': '😰', '초조': '😟', '억울': '😭', '배신감': '💔',
      '상처': '😢',
  
      // Low Energy / Unpleasant
      '우울': '😔', '슬픔': '😞', '공허': '😶', '외로움': '😕',
      '실망': '😩', '속상': '😣', '부끄러움': '😳', '수치': '😖',
      '죄책감': '😓', '후회': '😰', '뉘우침': '😔', '창피': '🫣',
      '굴욕': '😵', '피로': '😴', '지침': '🥱', '무기력': '😑',
      '지루': '😪', '부담': '😰',
  
      // Low Energy / Pleasant
      '평온': '😌', '편안': '☺️', '안정': '🙂', '차분': '😊',
      '감사': '🙏', '존경': '🥰', '신뢰': '😇', '친밀': '🤗',
      '유대': '🤝', '공감': '🥹', '만족감': '😌'
    };
    
    return emojiMap[emotion] || '🙂';
  };

const getEmotionCSSClass = (emotion: string): string => {
    // High Energy / Pleasant [노랑]
    const highEnergyPleasant = new Set([
      '행복', '기쁨', '즐거움', '설렘', '흥분', '활력',
      '자긍심', '자신감', '뿌듯함', '성취감',
      '사랑', '애정', '기대', '놀람'
    ]);
  
    // High Energy / Unpleasant [빨강]  
    const highEnergyUnpleasant = new Set([
      '분노', '짜증', '질투', '시기', '경멸', '거부감', '불쾌',
      '긴장', '불안', '초조', '억울', '배신감', '상처'
    ]);
  
    // Low Energy / Unpleasant [파랑]
    const lowEnergyUnpleasant = new Set([
      '우울', '슬픔', '공허', '외로움', '실망', '속상',
      '부끄러움', '수치', '죄책감', '후회', '뉘우침', '창피', '굴욕',
      '피로', '지침', '무기력', '지루', '부담'
    ]);
  
    // Low Energy / Pleasant [초록]
    const lowEnergyPleasant = new Set([
      '평온', '편안', '안정', '차분', '감사', '존경', 
      '신뢰', '친밀', '유대', '공감', '만족감'
    ]);
  
    if (highEnergyPleasant.has(emotion)) {
      return 'emotion-button -sun'; // 노랑
    }
    if (highEnergyUnpleasant.has(emotion)) {
      return 'emotion-button -salmon'; // 빨강
    }
    if (lowEnergyUnpleasant.has(emotion)) {
      return 'emotion-button -blue'; // 파랑
    }
    if (lowEnergyPleasant.has(emotion)) {
      return 'emotion-button -green'; // 초록
    }
    
    // 알 수 없는 감정의 경우 기본값
    return 'emotion-button -dark';
  };

const ActivityCard: React.FC<ActivityCardProps> = ({ card, index }) => {
  return (
    <motion.div
      className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >

      {/* 문제 요약 */}
      {card.problem_summary && (
        <motion.div
            className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h3 className="text-lg font-semibold text-white/90 mb-2">오늘의 도전</h3>
            <div 
            className="text-white/80 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: card.problem_summary }}
            />
        </motion.div>
        )}

     {/* 만난 사람들과 감정 */}
     {card.peoples_emotions.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">함께한 사람들</h3>
          {card.peoples_emotions.map((person, idx) => (
            <motion.div
              key={idx}
              className="mb-3 p-3 bg-white/5 "
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <p className="text-white font-medium mb-2">{person.name}</p>
              <div className="emotion-container">
                {person.emotions.map((emotion, emotionIdx) => (
                  <motion.div
                    key={emotionIdx}
                    className={getEmotionCSSClass(emotion[0])}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + emotionIdx * 0.1 }}
                  >
                    <span >{getEmotionEmoji(emotion[0])}</span>
                    <span >{emotion[0]}</span>
                    <span className="text-xs opacity-80">({emotion[1]})</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 자의식 감정 */}
      {card.self_emotions.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">내 마음</h3>
          <div className="emotion-container">
            {card.self_emotions.map((emotion, idx) => (
              <motion.div
                key={idx}
                className={getEmotionCSSClass(emotion[0])}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-lg">{getEmotionEmoji(emotion[0])}</span>
                <span>{emotion[0]}</span>
                <span className="text-xs opacity-80">({emotion[1]})</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 상태 감정 */}
      {card.state_emotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">전체적인 기분</h3>
          <div className="emotion-container">
            {card.state_emotions.map((emotion, idx) => (
              <motion.div
                key={idx}
                className={getEmotionCSSClass(emotion[0])}
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <span className="text-lg">{getEmotionEmoji(emotion[0])}</span>
                <span>{emotion[0]}</span>
                <span className="text-xs opacity-80">({emotion[1]})</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActivityCard;
export type { ActivityCardProps };
