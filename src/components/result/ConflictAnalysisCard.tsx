import React from "react";

interface ConflictData {
  situation: string;
  approach: string;
  outcome: string;
  conflict_response_code: string;
}

interface ConflictAnalysisCardProps {
  conflicts: ConflictData[];
  title?: string;
}

const ConflictAnalysisCard: React.FC<ConflictAnalysisCardProps> = ({
  conflicts,
  title = "마음 사건 리포트",
}) => {
  // None이 아닌 갈등만 필터링
  const validConflicts = conflicts.filter(
    conflict =>
      conflict.situation !== "None" &&
      conflict.approach !== "None" &&
      conflict.outcome !== "None" &&
      conflict.conflict_response_code !== "None"
  );

  if (validConflicts.length === 0) {
    return null;
  }

  const getResponseTypeDisplay = (code: string) => {
    const responseTypes: { [key: string]: string } = {
      회피형: "조용히 들어주는",
      경쟁형: "적극적으로 맞서는",
      협력형: "함께 해결책을 찾는",
      타협형: "서로 양보하는",
      순응형: "상대방 의견을 받아들이는",
    };
    return responseTypes[code] || code;
  };

  const getConflictTemplate = (conflict: ConflictData) => {
    const responseDisplay = getResponseTypeDisplay(conflict.conflict_response_code);

    return `${conflict.situation} 상황에서, 나는 ${responseDisplay} 방식으로 대응했고, 그 결과 ${conflict.outcome}했어요. 그 선택은 신중한 판단이었고, 나는 ${conflict.conflict_response_code} 방식으로 갈등에 반응했어요.`;
  };

  const renderHighlightedText = (text: string, conflict: ConflictData) => {
    const parts = [];
    let lastIndex = 0;

    // 하이라이트할 키워드들 정의
    const keywords = [
      { text: conflict.situation, className: "bg-blue-200 px-1 rounded" },
      {
        text: getResponseTypeDisplay(conflict.conflict_response_code),
        className: "bg-yellow-200 px-1 rounded",
      },
      { text: conflict.outcome, className: "bg-green-200 px-1 rounded" },
      { text: conflict.conflict_response_code, className: "bg-purple-200 px-1 rounded" },
    ];

    // 텍스트에서 키워드 위치 찾기
    const matches: Array<{ start: number; end: number; className: string }> = [];

    keywords.forEach(keyword => {
      const index = text.indexOf(keyword.text);
      if (index !== -1) {
        matches.push({
          start: index,
          end: index + keyword.text.length,
          className: keyword.className,
        });
      }
    });

    // 위치순으로 정렬
    matches.sort((a, b) => a.start - b.start);

    // 겹치지 않는 매치만 선택
    const validMatches: Array<{ start: number; end: number; className: string }> = [];
    matches.forEach(match => {
      const isOverlapping = validMatches.some(vm => match.start < vm.end && match.end > vm.start);
      if (!isOverlapping) {
        validMatches.push(match);
      }
    });

    // 텍스트 렌더링
    validMatches.forEach((match, index) => {
      // 이전 매치와 현재 매치 사이의 일반 텍스트
      if (match.start > lastIndex) {
        parts.push(<span key={`text-${index}`}>{text.substring(lastIndex, match.start)}</span>);
      }

      // 하이라이트된 텍스트
      parts.push(
        <span key={`highlight-${index}`} className={match.className}>
          {text.substring(match.start, match.end)}
        </span>
      );

      lastIndex = match.end;
    });

    // 마지막 일반 텍스트
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className="bg-white rounded-2xl shadow-md px-4 py-5">
      <div className="space-y-4">
        {validConflicts.map((conflict, index) => {
          const templateText = getConflictTemplate(conflict);

          return (
            <div key={index} className="bg-gray-100 rounded-lg p-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {renderHighlightedText(templateText, conflict)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConflictAnalysisCard;
