// src/components/result/DiaryContent.tsx

import React from "react";

interface DiaryContentProps {
  content: string;
}

const DiaryContent: React.FC<DiaryContentProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {content}
      </p>
    </div>
  );
};

export default DiaryContent;
