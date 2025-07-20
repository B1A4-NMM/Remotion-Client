import React from "react";

interface TodoHeaderProps {
  initialTab: string;
}

export default function TodoHeader({ initialTab }: TodoHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-lg font-bold">{initialTab}</h4>
    </div>
  );
}
