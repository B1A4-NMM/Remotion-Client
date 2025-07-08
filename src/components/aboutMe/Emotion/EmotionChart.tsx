import React, { useRef, useEffect, useState} from 'react';
import type { EmotionAnalysisResponse } from '../../../types/diary';

import {useGSAP} from '@gsap/react';

import "./../../../styles/pieChart.css";


interface EmotionChartProps {
  emotionAnalysis?: EmotionAnalysisResponse; // 새로운 API 데이터
  animate?: boolean;
}

const EmotionChart: React.FC<EmotionChartProps> = ({
  emotionAnalysis,
  animate = true
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // 차트 상태 관리
  const [currentChart, setCurrentChart] = useState<'relation' | 'self' | 'state'>('relation');
  
  // 차트 순환 핸들러
  const handleChartClick = () => {
    setCurrentChart(prev => {
      switch (prev) {
        case 'relation': return 'self';
        case 'self': return 'state';
        case 'state': return 'relation';
        default: return 'relation';
      }
    });
  };

  // 색상 팔레트 정의
  const colors = [
    '#53C480', '#5381C6', '#f95da4', '#FF6200', '#9B59B6', 
    '#E74C3C', '#F39C12', '#1ABC9C', '#3498DB', '#95A5A6',
    '#34495E', '#E67E22', '#2ECC71', '#8E44AD', '#C0392B'
  ];

  // 데이터 총합 계산
  const calculateTotal = (data: EmotionAnalysisItem[]) => {
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  // 퍼센티지 계산
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  // 세그먼트 데이터 생성 (새로운 구조용)
  const createSegments = (emotions: EmotionAnalysisItem[]) => {
    const total = calculateTotal(emotions);
    let cumulativePercentage = 0;
    
    return emotions.map((emotion, index) => {
      const percentage = calculatePercentage(emotion.count, total);
      const startOffset = cumulativePercentage;
      cumulativePercentage += percentage;
      
      return {
        name: emotion.emotion,
        count: emotion.count,
        intensity: emotion.intensity,
        percentage: Math.round(percentage * 10) / 10,
        strokeDasharray: `${percentage.toFixed(1)} ${(100 - percentage).toFixed(1)}`,
        strokeDashoffset: 25 - startOffset,
        color: colors[index % colors.length]
      };
    });
  };

  // 관계 기반 감정 차트
  const renderRelationChart = () => {
    if (!emotionAnalysis?.Relation) return null;
    
    const segments = createSegments(emotionAnalysis.Relation);
    const total = calculateTotal(emotionAnalysis.Relation);

    return (
      <div className="svg-item chart-center">
        <div className='donut-wrapper' onClick={handleChartClick} style={{cursor: 'pointer'}}>
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

  // 자아 감정 차트
  const renderSelfChart = () => {
    if (!emotionAnalysis?.Self) return null;
    
    const segments = createSegments(emotionAnalysis.Self);
    const total = calculateTotal(emotionAnalysis.Self);

    return (
      <div className="svg-item chart-center">
        <div className='donut-wrapper' onClick={handleChartClick} style={{cursor: 'pointer'}}>
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
                  animation: animate ? `donut-${index + 10} 3s ease-in-out` : 'none'
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
            <div key={`legend-self-${index}`} style={{ 
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

  // 상태 감정 차트
  const renderStateChart = () => {
    if (!emotionAnalysis?.State) return null;
    
    const segments = createSegments(emotionAnalysis.State);
    const total = calculateTotal(emotionAnalysis.State);

    return (
      <div className="svg-item chart-center">
        <div className='donut-wrapper' onClick={handleChartClick} style={{cursor: 'pointer'}}>
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
                  animation: animate ? `donut-${index + 20} 3s ease-in-out` : 'none'
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
            <div key={`legend-state-${index}`} style={{ 
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

  // 동적 애니메이션 생성 (기존 useEffect 코드 유지)
  useEffect(() => {
    // 기존 애니메이션 로직...
  }, [emotionAnalysis, animate]);

  return (
    <div ref={chartRef} style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      {/* 현재 활성 차트만 표시 */}
      <div style={{ 
        transition: 'all 0.5s ease-in-out',
        opacity: 1,
        transform: 'scale(1)'
      }}>
        {currentChart === 'relation' && renderRelationChart()}
        {currentChart === 'self' && renderSelfChart()}
        {currentChart === 'state' && renderStateChart()}
      </div>
      
      {/* 차트 전환 안내 */}
      <div style={{ 
        marginTop: '16px', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px'
      }}>
        💡 차트 중앙을 클릭하여 다른 감정 차트를 확인하세요
      </div>
    </div>
  );
};

export default EmotionChart;