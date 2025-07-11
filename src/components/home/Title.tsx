const Title = () => {
    return (
        <div className="absolute top-10 left-0 w-full z-50">
            {/* 메인 헤더 */}
            <div className="flex items-center justify-between px-4 py-3">
                <h1 className="text-4xl font-bold text-gray-900 ml-2">하루 기록</h1>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2">
                    {/* 검색 버튼 */}
                    <button 
                        className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
                        aria-label="검색"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    
                    {/* 위치 버튼 */}
                    <button 
                        className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
                        aria-label="위치"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    
                    {/* 메뉴 버튼 */}
                    <button 
                        className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
                        aria-label="메뉴"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* 통계 섹션 */}
            <div className="flex justify-around items-center py-3 divide-x-2 divide-gray-200">
                {/* 연속 기록 */}
                <div className="flex items-start gap-2 px-6">
                    <img 
                        src="../assets/img/Document.svg" 
                        style={{
                            filter: 'invert(73%) sepia(89%) saturate(4477%) hue-rotate(204deg) brightness(93%) contrast(91%)'
                        }}
                    />
                    <div>
                        <p className="text-sm text-gray-500">연속 기록</p>
                        <p className="text-lg font-bold text-gray-900">0일</p>
                    </div>
                </div>
                
                {/* 이 달의 감정 */}
                <div className="flex items-start gap-2 px-6">
                <img 
                        src="../assets/img/Star.svg" 
                        style={{
                            filter: 'invert(64%) sepia(4%) saturate(5367%) hue-rotate(309deg) brightness(92%) contrast(104%)'
                        }}
                    />
                    <div>
                        <p className="text-sm text-gray-500">이 달의 감정</p>
                        <p className="text-lg font-bold text-gray-900">0가지</p>
                    </div>
                </div>
                
                {/* 누적 하루뒤 */}
                <div className="flex items-start gap-2 px-6">
                <img 
                        src="../assets/img/Send.svg" 
                        style={{
                            filter: ' invert(32%) sepia(11%) saturate(2571%) hue-rotate(205deg) brightness(95%) contrast(83%)'
                        }}
                    />
                    <div>
                        <p className="text-sm text-gray-500">누적 하루뒤</p>
                        <p className="text-lg font-bold text-gray-900">0개</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Title;
