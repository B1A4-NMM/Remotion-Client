import React from "react";

interface HomeBarProps {
  continuousWritingDate: number;
  emotionCountByMonth: number;
  totalDiaryCount: number;
}

const HomeBar: React.FC<HomeBarProps> = ({
  continuousWritingDate,
  emotionCountByMonth,
  totalDiaryCount,
}) => {
  return (
    <div className="w-full px-4 pb-4">
      <div className="grid grid-cols-3 relative">
        {/* 연속 기록 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center justify-center">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.20667 1.33325H10.794C12.8533 1.33325 14 2.51992 14 4.55325V11.4399C14 13.5066 12.8533 14.6666 10.794 14.6666H5.20667C3.18 14.6666 2 13.5066 2 11.4399V4.55325C2 2.51992 3.18 1.33325 5.20667 1.33325ZM5.38667 4.43992H7.37933C7.66667 4.43992 7.9 4.66659 7.9 4.95259C7.9 5.24659 7.66667 5.47992 7.37933 5.47992H5.38667C5.09933 5.47992 4.86667 5.24659 4.86667 4.95992C4.86667 4.67325 5.09933 4.43992 5.38667 4.43992ZM5.38667 8.49325H10.6133C10.9 8.49325 11.1333 8.25992 11.1333 7.97325C11.1333 7.68659 10.9 7.45259 10.6133 7.45259H5.38667C5.09933 7.45259 4.86667 7.68659 4.86667 7.97325C4.86667 8.25992 5.09933 8.49325 5.38667 8.49325ZM5.38667 11.5399H10.6133C10.8793 11.5133 11.08 11.2859 11.08 11.0199C11.08 10.7466 10.8793 10.5199 10.6133 10.4933H5.38667C5.18667 10.4733 4.99333 10.5666 4.88667 10.7399C4.78 10.9066 4.78 11.1266 4.88667 11.2999C4.99333 11.4666 5.18667 11.5666 5.38667 11.5399Z"
                  fill="#6983E3"
                />
              </svg>
            </div>
            <p className="text-[12px] text-[#85848f] text-center">연속 기록</p>
          </div>
          <p className="text-[16px] font-semibold text-black text-center">
            {continuousWritingDate}일
          </p>
        </div>
        {/* 이 달의 감정 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center justify-start">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path
                  d="M11.9456 9.54675C11.7729 9.71408 11.6936 9.95608 11.7329 10.1934L12.3256 13.4734C12.3756 13.7514 12.2583 14.0327 12.0256 14.1934C11.7976 14.3601 11.4943 14.3801 11.2456 14.2467L8.29292 12.7067C8.19026 12.6521 8.07626 12.6227 7.95959 12.6194H7.77892C7.71626 12.6287 7.65493 12.6487 7.59893 12.6794L4.64559 14.2267C4.49959 14.3001 4.33426 14.3261 4.17226 14.3001C3.77759 14.2254 3.51426 13.8494 3.57893 13.4527L4.17226 10.1727C4.21159 9.93341 4.13226 9.69008 3.95959 9.52008L1.55226 7.18675C1.35093 6.99141 1.28093 6.69808 1.37293 6.43341C1.46226 6.16941 1.69026 5.97675 1.96559 5.93341L5.27892 5.45275C5.53093 5.42675 5.75226 5.27341 5.86559 5.04675L7.32559 2.05341C7.36026 1.98675 7.40493 1.92541 7.45893 1.87341L7.51892 1.82675C7.55026 1.79208 7.58626 1.76341 7.62626 1.74008L7.69893 1.71341L7.81226 1.66675H8.09293C8.34359 1.69275 8.56426 1.84275 8.67959 2.06675L10.1589 5.04675C10.2656 5.26475 10.4729 5.41608 10.7123 5.45275L14.0256 5.93341C14.3056 5.97341 14.5396 6.16675 14.6323 6.43341C14.7196 6.70075 14.6443 6.99408 14.4389 7.18675L11.9456 9.54675Z"
                  fill="#EF7C80"
                />
              </svg>
            </div>
            <p className="text-[12px] text-muted-foreground text-center whitespace-nowrap">이 달의 감정</p>
          </div>
          <p className="text-[16px] font-semibold text-black text-center">
            {emotionCountByMonth}가지
          </p>
        </div>
        {/* 누적 하루뒤 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center justify-center">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path
                  d="M14.2899 1.72124C13.9565 1.37898 13.4629 1.25148 13.0027 1.38569L2.27167 4.50627C1.78614 4.64116 1.442 5.02838 1.34929 5.52029C1.25459 6.02092 1.58539 6.65644 2.01757 6.9222L5.37294 8.98446C5.71708 9.19585 6.16126 9.14284 6.44605 8.85561L10.2883 4.98945C10.4817 4.78813 10.8018 4.78813 10.9952 4.98945C11.1887 5.18407 11.1887 5.49948 10.9952 5.70081L7.14633 9.56764C6.86088 9.85419 6.80753 10.3005 7.01762 10.6468L9.06779 14.0358C9.30789 14.4384 9.72139 14.6666 10.1749 14.6666C10.2283 14.6666 10.2883 14.6666 10.3416 14.6599C10.8619 14.5928 11.2754 14.2371 11.4288 13.7338L14.6101 3.01645C14.7501 2.5601 14.6234 2.0635 14.2899 1.72124Z"
                  fill="#565190"
                />
              </svg>
            </div>
            <p className="text-[12px] text-muted-foreground text-center whitespace-nowrap">누적 하루뒤</p>
          </div>
          <p className="text-[16px] font-semibold text-foreground text-center">{totalDiaryCount}개</p>
        </div>
        {/* 구분선들 */}
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-border" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-border" />
      </div>
    </div>
  );
};

export default HomeBar;
