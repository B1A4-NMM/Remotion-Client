import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import "./../../../styles/pieChart.css";

interface EmotionData {
  name: string;
  count: number;
}

interface EmotionChartProps {
  relationData?: {
    connected: EmotionData[];
    distanced: EmotionData[];
  };
  stateData?: {
    elevated: EmotionData[];
    tense: EmotionData[];
    calm: EmotionData[];
    lethargic: EmotionData[];
  };
  selfData?: {
    positive: EmotionData[];
    negative: EmotionData[];
  };
  animate?: boolean;
}

const EmotionChart: React.FC<EmotionChartProps> = ({
  relationData,
  stateData,
  selfData,
  animate = true
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // 색상 팔레트 정의
  const colors = [
    '#53C480', '#5381C6', '#f95da4', '#FF6200', '#9B59B6', 
    '#E74C3C', '#F39C12', '#1ABC9C', '#3498DB', '#95A5A6',
    '#34495E', '#E67E22', '#2ECC71', '#8E44AD', '#C0392B'
  ];

  // 데이터 총합 계산
  const calculateTotal = (data: EmotionData[]) => {
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  // 퍼센티지 계산
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  // 세그먼트 데이터 생성
  const createSegments = (emotions: EmotionData[]) => {
    const total = calculateTotal(emotions);
    let cumulativePercentage = 0;
    
    return emotions.map((emotion, index) => {
      const percentage = calculatePercentage(emotion.count, total);
      const startOffset = cumulativePercentage;
      cumulativePercentage += percentage;
      
      return {
        name: emotion.name,
        count: emotion.count,
        percentage: Math.round(percentage * 10) / 10,
        strokeDasharray: `${percentage.toFixed(1)} ${(100 - percentage).toFixed(1)}`,
        strokeDashoffset: 25 - startOffset,
        color: colors[index % colors.length]
      };
    });
  };

  // 관계 기반 감정 차트
  const renderRelationChart = () => {
    if (!relationData) return null;
    
    const allEmotions = [...relationData.connected, ...relationData.distanced];
    const segments = createSegments(allEmotions);
    const total = calculateTotal(allEmotions);

    return (
    <div className="svg-item chart-center">
        <div className='donut-wrapper'>
            <svg width="200px" height="200px" viewBox="0 0 40 40" className="donut">
            <circle 
                className="donut-hole" 
                cx="20" 
                cy="20" 
                r="15.91549430918954" 
                fill="#202631"
            />
            <circle 
                className="donut-ring" 
                cx="20" 
                cy="20" 
                r="15.91549430918954" 
                fill="transparent" 
                strokeWidth="3.5"
            />
            
            {segments.map((segment, index) => (
                <circle
                key={`relation-${index}`}
                className="donut-segment"
                cx="20"
                cy="20"
                r="15.91549430918954"
                fill="transparent"
                strokeWidth="3.5"
                stroke={segment.color}
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                style={{
                    animation: animate ? `donut-${index} 3s ease-in-out` : 'none'
                }}
                />
            ))}
            
            <g className="donut-text">
                <text y="45%" transform="translate(0, 2)">
                <tspan x="50%" textAnchor="middle" className="donut-percent" style={{fill: '#ffffff', fontSize: '0.4em'}}>
                    관계
                </tspan>   
                </text>
                <text y="55%" transform="translate(0, 4)">
                <tspan x="50%" textAnchor="middle" className="donut-data" style={{fill: '#ffffff', fontSize: '0.2em'}}>
                    총 {total}개
                </tspan>   
                </text>
            </g>
        </svg>
        </div>
        
        {/* 범례 */}
        <div className='grid h-30 grid-cols-2 content-evenly gap-4'>
            {segments.map((segment, index) => (
                <div key={`legend-relation-${index}`} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
                }}>
                <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: segment.color, 
                    marginRight: '6px',
                    borderRadius: '2px'
                }} />
                <span style={{ color: '#fff', fontSize: '11px' }}>
                    {segment.name}: {segment.count}개 ({segment.percentage}%)
                </span>
                </div>
            ))}
        </div>
      </div>
    );
  };

  // 상태성 감정 차트
  const renderStateChart = () => {
    if (!stateData) return null;
    
    const allEmotions = [
      ...stateData.elevated, 
      ...stateData.tense, 
      ...stateData.calm, 
      ...stateData.lethargic
    ];
    const segments = createSegments(allEmotions);
    const total = calculateTotal(allEmotions);

    return (
      <div className="svg-item mb-8 chart-center">
        <div className='donut-wrapper'>
            <svg width="200px" height="200px" viewBox="0 0 40 40" className="donut">
                <circle 
                className="donut-hole" 
                cx="20" 
                cy="20" 
                r="15.91549430918954" 
                fill="#202631"
            />
            <circle 
                className="donut-ring" 
                cx="20" 
                cy="20" 
                r="15.91549430918954" 
                fill="transparent" 
                strokeWidth="3.5"
            />
            
            {segments.map((segment, index) => (
                <circle
                key={`state-${index}`}
                className="donut-segment"
                cx="20"
                cy="20"
                r="15.91549430918954"
                fill="transparent"
                strokeWidth="3.5"
                stroke={segment.color}
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                style={{
                    animation: animate ? `donut-${index + 10} 3s ease-in-out` : 'none'
                }}
                />
            ))}
            
            <g className="donut-text">
                <text y="45%" transform="translate(0, 2)">
                <tspan x="50%" textAnchor="middle" className="donut-percent" style={{fill: '#ffffff', fontSize: '0.4em'}}>
                    상태
                </tspan>   
                </text>
                <text y="55%" transform="translate(0, 4)">
                <tspan x="50%" textAnchor="middle" className="donut-data" style={{fill: '#ffffff', fontSize: '0.2em'}}>
                    총 {total}개
                </tspan>   
                </text>
            </g>
        </svg>
        </div>
        
        {/* 범례 */}
        <div className='grid h-30 grid-cols-2 content-evenly gap-4'>
            {segments.map((segment, index) => (
                <div key={`legend-relation-${index}`} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
                }}>
                <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: segment.color, 
                    marginRight: '6px',
                    borderRadius: '2px'
                }} />
                <span style={{ color: '#fff', fontSize: '11px' }}>
                    {segment.name}: {segment.count}개 ({segment.percentage}%)
                </span>
                </div>
            ))}
        </div>
      </div>
    );
  };

  // 자아 감정 차트
  const renderSelfChart = () => {
    if (!selfData) return null;
    
    const allEmotions = [...selfData.positive, ...selfData.negative];
    const segments = createSegments(allEmotions);
    const total = calculateTotal(allEmotions);

    return (
    <div className="svg-item mb-8 chart-center">
      <div className=' flex flex-col items-center justify-center'></div>
        <div className='donut-wrapper'>
        <svg width="200px" height="200px" viewBox="0 0 40 40" className="donut">
            <circle 
            className="donut-hole" 
            cx="20" 
            cy="20" 
            r="15.91549430918954" 
            fill="#202631"
          />
          <circle 
            className="donut-ring" 
            cx="20" 
            cy="20" 
            r="15.91549430918954" 
            fill="transparent" 
            strokeWidth="3.5"
          />
          
          {segments.map((segment, index) => (
            <circle
              key={`self-${index}`}
              className="donut-segment"
              cx="20"
              cy="20"
              r="15.91549430918954"
              fill="transparent"
              strokeWidth="3.5"
              stroke={segment.color}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              style={{
                animation: animate ? `donut-${index + 20} 3s ease-in-out` : 'none'
              }}
            />
          ))}
          
          <g className="donut-text">
            <text y="45%" transform="translate(0, 2)">
            <tspan x="50%" textAnchor="middle" className="donut-percent" style={{fill: '#ffffff', fontSize: '0.4em'}}>
                자아
              </tspan>   
            </text>
            <text y="55%" transform="translate(0, 4)">
            <tspan x="50%" textAnchor="middle" className="donut-data" style={{fill: '#ffffff', fontSize: '0.2em'}}>
                총 {total}개
              </tspan>   
            </text>
          </g>
        </svg>
        </div>
        
        {/* 범례 */}
        <div className='grid h-30 grid-cols-2 content-evenly gap-4'>
            {segments.map((segment, index) => (
                <div key={`legend-relation-${index}`} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
                }}>
                <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: segment.color, 
                    marginRight: '6px',
                    borderRadius: '2px'
                }} />
                <span style={{ color: '#fff', fontSize: '11px' }}>
                    {segment.name}: {segment.count}개 ({segment.percentage}%)
                </span>
                </div>
            ))}
        </div>
      </div>
    );
  };

  // 동적 애니메이션 생성
  useEffect(() => {
    if (!animate) return;

    const createAnimations = (emotions: EmotionData[], startIndex: number) => {
      const total = calculateTotal(emotions);
      let cumulativePercentage = 0;
      
      return emotions.map((emotion, index) => {
        const percentage = calculatePercentage(emotion.count, total);
        const animationCSS = `
          @keyframes donut-${startIndex + index} {
            0% { stroke-dasharray: 0, 100; }
            100% { stroke-dasharray: ${percentage.toFixed(1)}, ${(100 - percentage).toFixed(1)}; }
          }
        `;
        cumulativePercentage += percentage;
        return animationCSS;
      });
    };

    const style = document.createElement('style');
    let allAnimations = '';

    if (relationData) {
      const relationEmotions = [...relationData.connected, ...relationData.distanced];
      allAnimations += createAnimations(relationEmotions, 0).join('\n');
    }

    if (stateData) {
      const stateEmotions = [...stateData.elevated, ...stateData.tense, ...stateData.calm, ...stateData.lethargic];
      allAnimations += createAnimations(stateEmotions, 10).join('\n');
    }

    if (selfData) {
      const selfEmotions = [...selfData.positive, ...selfData.negative];
      allAnimations += createAnimations(selfEmotions, 20).join('\n');
    }

    style.textContent = allAnimations;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [relationData, stateData, selfData, animate]);

  return (
    <div ref={chartRef} style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      {renderRelationChart()}
      {renderStateChart()}
      {renderSelfChart()}
    </div>
  );
};

export default EmotionChart;
