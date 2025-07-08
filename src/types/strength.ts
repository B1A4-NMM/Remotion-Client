// src/types/strength.ts
export type DetailStrength = {
  [detailName: string]: number; // 예: "창의성": 3
};

export type StrengthData = {
  typeCount: {
    [category: string]: number; // 예: "지혜": 4
  };
  detailCount: {
    [category: string]: DetailStrength;
  };
};
