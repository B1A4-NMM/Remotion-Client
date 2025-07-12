interface BottomNaviProps {
  onMicClick: () => void;
  onLocationClick: () => void;
  onImageClick: () => void;
  isListening: boolean;
  isPhotoActive: boolean;
  isLocationActive: boolean;
  keyboardHeight: number;
  }

  const BottomNavi = ({
  onMicClick,
  onLocationClick,
  onImageClick,
  isListening,
  isPhotoActive,
  isLocationActive,
  keyboardHeight,
    }: BottomNaviProps) => {
    return (
    <div
    className={`absolute bottom-0 w-full h-[84px] z-50 flex justify-center transition-transform duration-300 ease-in-out`}
    style={{
      transform:  `translateY(-${keyboardHeight}px)`,
    }}
    >
      {/* ✅ SVG는 절대 그대로 유지 */}
      <svg
        width="178"
        height="72"
        viewBox="0 0 178 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_548_3742)">
          <rect
            x="10"
            y="8"
            width="158"
            height="52"
            rx="24"
            fill="white"
            fillOpacity="0.7"
            shapeRendering="crispEdges"
          />
          <circle cx="40" cy="34" r="23" 
          fill={isListening? "black":"transparent"}/>
          <circle cx="89" cy="34" r="23" 
          fill={isPhotoActive? "black":"transparent"}/>
          <circle cx="137" cy="34" r="23" z="1"
          fill={isLocationActive? "black":"transparent"}/>

          <path
            d="M49.7861 31.4644C50.41 31.4644 50.916 31.9634 50.916 32.5806C50.9158 37.6013 47.0671 41.7471 42.1309 42.3042V44.5513C42.1306 45.1671 41.6237 45.6665 41 45.6665C40.3753 45.6664 39.8704 45.167 39.8701 44.5513V42.3042C34.9325 41.7473 31.0832 37.6014 31.083 32.5806C31.083 31.9635 31.5892 31.4645 32.2129 31.4644C32.8367 31.4644 33.3438 31.9634 33.3438 32.5806C33.344 36.7487 36.7779 40.14 41 40.1401C45.221 40.1401 48.656 36.7488 48.6562 32.5806C48.6562 31.9634 49.1623 31.4644 49.7861 31.4644ZM41.2031 22.3335C44.0071 22.3335 46.2812 24.5783 46.2812 27.3472V32.7407C46.2812 35.5084 44.007 37.7534 41.2031 37.7534H40.7959C37.992 37.7534 35.7188 35.5084 35.7188 32.7407V27.3472C35.7188 24.5783 37.9919 22.3335 40.7959 22.3335H41.2031Z"
            fill={isListening? "white":"black"}
          />
          <path
            d="M94.0791 22.334C98.0189 22.334 100.666 25.0896 100.666 29.2031V38.7861C100.666 38.9622 100.635 39.1198 100.626 39.29C100.62 39.3892 100.62 39.4887 100.612 39.5879C100.608 39.6322 100.595 39.6735 100.591 39.7178C100.552 40.084 100.493 40.4341 100.41 40.7734C100.389 40.8643 100.364 40.9515 100.34 41.04C100.247 41.369 100.137 41.6836 100.005 41.9834C99.9664 42.0673 99.9244 42.1477 99.8848 42.2305C99.7424 42.5163 99.5886 42.7906 99.4102 43.0449C99.3554 43.123 99.2944 43.1928 99.2373 43.2686C99.0519 43.5088 98.8579 43.7385 98.6387 43.9473C98.5675 44.0149 98.4868 44.0735 98.4121 44.1377C98.187 44.3313 97.9572 44.5171 97.7041 44.6758C97.6132 44.7328 97.5131 44.7749 97.4199 44.8262C97.1621 44.9685 96.9016 45.1075 96.6182 45.2148C96.5016 45.2591 96.3722 45.2828 96.251 45.3213C95.9722 45.4076 95.6963 45.4965 95.3965 45.5479C95.1702 45.5875 94.9235 45.5925 94.6855 45.6123C94.4827 45.6275 94.2901 45.667 94.0791 45.667H83.9111C83.4725 45.667 83.0532 45.6231 82.6484 45.5566C82.6334 45.5543 82.6194 45.5521 82.6055 45.5498C81.027 45.278 79.717 44.5154 78.7988 43.3662C78.7884 43.3662 78.7877 43.3552 78.7773 43.3447C77.8545 42.1827 77.333 40.6201 77.333 38.7861V29.2031C77.3331 25.0896 79.983 22.334 83.9111 22.334H94.0791ZM83.9111 23.9619C80.9047 23.9619 78.962 26.0229 78.9619 29.2031V38.7861C78.9619 39.6786 79.1276 40.4755 79.4111 41.165C79.4538 41.1139 81.7073 38.3667 81.7178 38.3574C82.5251 37.4358 84.0402 36.0609 86.0293 36.8926C86.5076 37.0909 86.9275 37.3702 87.3125 37.6152C87.9807 38.0619 88.3741 38.2721 88.7822 38.2373C88.9513 38.214 89.1103 38.1635 89.2607 38.0703C89.9111 37.6693 91.7484 34.9902 91.8623 34.8398C93.134 33.1832 95.0942 32.7397 96.7275 33.7197C96.9469 33.8504 98.5187 34.9477 99.0391 35.3887V29.2031C99.039 26.0229 97.096 23.9619 94.0791 23.9619H83.9111ZM84.8926 27C85.7063 27.0001 86.4429 27.3428 86.9707 27.8887C87.5009 28.4156 87.834 29.1419 87.834 29.9346C87.8338 31.5152 86.511 32.8339 84.9229 32.834C83.5268 32.834 82.3363 31.8137 82.0693 30.4932C82.0252 30.295 82 30.0904 82 29.8799C82.0002 28.288 83.2942 27 84.8926 27Z"
            fill={isPhotoActive? "white":"black"}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M127.083 32.0375C127.083 26.671 131.568 22.3335 136.992 22.3335C142.432 22.3335 146.916 26.671 146.916 32.0375C146.916 34.7418 145.933 37.2524 144.314 39.3803C142.528 41.7276 140.327 43.7727 137.85 45.378C137.283 45.749 136.771 45.777 136.149 45.378C133.657 43.7727 131.456 41.7276 129.685 39.3803C128.065 37.2524 127.083 34.7418 127.083 32.0375ZM133.726 32.3397C133.726 34.1375 135.193 35.5514 136.992 35.5514C138.792 35.5514 140.273 34.1375 140.273 32.3397C140.273 30.5559 138.792 29.0731 136.992 29.0731C135.193 29.0731 133.726 30.5559 133.726 32.3397Z"
            fill={isLocationActive? "white":"black"}
          />
        </g>
        <defs>
          <filter
            id="filter0_d_548_3742"
            x="0"
            y="0"
            width="178"
            height="72"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_548_3742" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_548_3742"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      {/* ✅ 클릭 영역을 정확한 아이콘 위치에 덧씌우기 */}
      <div className="absolute inset-0 flex justify-center px-3 items-end pb-6 pr-5">
      {/* 마이크 아이콘 버튼 */}
      <button
        className="w-[56px] h-[56px] rounded-full transition-all"
        onClick={onMicClick}
      />

      {/* 카메라 아이콘 버튼 */}
      <button
        className="w-[52px] h-[52px] rounded-full cursor-pointer flex items-center justify-center transition-all "
        onClick={onImageClick}
      />

      {/* 위치 아이콘 버튼 */}
      <button
        className="w-[52px] h-[52px] rounded-full transition-all"
        onClick={onLocationClick}
      />
    </div>
    </div>
  );
};

export default BottomNavi;
