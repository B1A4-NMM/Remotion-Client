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
  // situation만 있어도 렌더링되도록 수정
  const validConflicts = conflicts.filter(
    conflict => conflict.situation && conflict.situation !== "None"
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

  const isValid = (value?: string | null) => !!value && value.toLowerCase?.() !== "none";

  const getConflictTemplate = (conflict: ConflictData) => {
    const { situation, approach, conflict_response_code } = conflict;

    if (!isValid(situation)) return null; // situation은 필수

    const outcome = isValid(conflict.outcome) ? conflict.outcome : null;
    const responseDisplay = isValid(conflict_response_code)
      ? getResponseTypeDisplay(conflict_response_code!)
      : null;

    const validApproach = isValid(approach) ? approach : null;

    const hasApproach = !!validApproach;
    const hasResponse = !!responseDisplay;
    const hasOutcome = !!outcome;

    // ✅ 3개 모두 있는 경우
    if (hasApproach && hasResponse && hasOutcome) {
      return `${situation} 상황에서 ${responseDisplay} 방식으로 대응했어요. '${validApproach}'라는 접근을 통해 ${outcome}했고, 이는 ${conflict.conflict_response_code} 스타일의 갈등 해결 방식이었어요.`;
    }

    // ✅ 2개 조합
    if (hasResponse && hasOutcome && !hasApproach) {
      return `${situation} 상황에서, 나는 ${responseDisplay} 방식으로 대응했고, 그 결과 ${outcome}했어요.`;
    }

    if (hasResponse && hasApproach && !hasOutcome) {
      return `${situation} 상황에서, 나는 ${responseDisplay} 방식으로 대응했고, '${validApproach}'라는 접근을 택했어요.`;
    }

    if (hasOutcome && hasApproach && !hasResponse) {
      return `${situation} 상황에서, 나는 '${validApproach}'라는 선택을 했고, 그 결과 ${outcome}했어요.`;
    }

    // ✅ 1개만 있는 경우
    if (hasResponse && !hasOutcome && !hasApproach) {
      return `${situation} 상황에서, 나는 ${responseDisplay} 방식으로 대응했어요.`;
    }

    if (hasOutcome && !hasResponse && !hasApproach) {
      return `${situation} 상황에서, 그 결과 ${outcome}하게 되었어요.`;
    }

    if (hasApproach && !hasResponse && !hasOutcome) {
      return `${situation} 상황에서, 나는 '${validApproach}'라는 선택을 했어요.`;
    }

    return null; // 전혀 정보가 없으면 출력 안 함
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
      { text: conflict.approach, className: "bg-purple-200 px-1 rounded" },
      // 원본 conflict_response_code도 추가 (변환된 텍스트와 함께)
      { text: conflict.conflict_response_code, className: "bg-orange-200 px-1 rounded" },
    ];

    // 텍스트에서 키워드 위치 찾기
    const matches: Array<{ start: number; end: number; className: string }> = [];

    keywords.forEach(keyword => {
      if (keyword.text && keyword.text !== "None") {
        const index = text.indexOf(keyword.text);
        if (index !== -1) {
          matches.push({
            start: index,
            end: index + keyword.text.length,
            className: keyword.className,
          });
        }
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

          if (!templateText) return null; // templateText가 null이면 렌더링하지 않음

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
