// src/components/result/DiaryContent.tsx

import React from "react";

interface DiaryContentProps {
  content: string;
}

const DiaryContent: React.FC<DiaryContentProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg ">
      <p className="whitespace-pre-wrap text-foreground leading-relaxed">
        {content}
      </p>
    </div>
  );
};

export default DiaryContent;
