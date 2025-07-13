import React, { useState } from "react";
import { Card, CardHeader } from "../ui/card";
import Meditation from "./Meditation";

const MeditationCard = () => {
    // 상태 변수명과 setter 함수명을 일치시킴
    const [showMeditation, setShowMeditation] = useState(false);
    const [type, setType] = useState(0);

    // 명상 카드 클릭 핸들러 개선
    const handleMeditationClick = (num: number) => {
        setType(num);
        setShowMeditation(true); // 항상 true로 설정
    };

    // 명상 닫기 핸들러
    const handleCloseMeditation = () => {
        setShowMeditation(false);
    };

    return (
        <div>
            <div className="p-4 grid-cols-2 gap-3">
                {/* 분노 진정하기 - 빨간색 계열 */}
                <Card className="bg-gradient-to-br from-red-100 to-red-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mb-3">
                    <CardHeader className="p-6">
                        <div className="flex items-center space-x-3" onClick={() => handleMeditationClick(1)}>
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 1.5 2 2.5 5 2.5 7 2-1 2.657-2.657 2.657-2.657z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-red-800 text-lg font-semibold mb-1">분노 진정하기</h3>
                                <p className="text-red-600 text-sm">마음의 평온을 찾아보세요</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* 우울 다스리기 - 파란색 계열 */}
                <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mb-3">
                    <CardHeader className="p-6">
                        <div className="flex items-center space-x-3" onClick={() => handleMeditationClick(2)}>
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-blue-800 text-lg font-semibold mb-1">우울 다스리기</h3>
                                <p className="text-blue-600 text-sm">긍정적인 에너지를 충전하세요</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* 긴장 완화하기 - 녹색 계열 */}
                <Card className="overflow-hidden bg-gradient-to-br from-green-100 to-green-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mb-3">
                    <CardHeader className="p-6">
                        <div className="flex items-center space-x-3" onClick={() => handleMeditationClick(3)}>
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-green-800 text-lg font-semibold mb-1">긴장 완화하기</h3>
                                <p className="text-green-600 text-sm">편안한 휴식을 취하세요</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            
            {showMeditation && (
                <Meditation
                    type={type}
                    onClose={handleCloseMeditation} 
                />
            )}
        </div>
    );
};

export default MeditationCard;
