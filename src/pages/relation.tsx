// React 훅 및 motion import
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// pastelColors: 원 색상 배열 (랜덤 배정용)
import { pastelColors } from "../constants/pastelColors";

// Circle 컴포넌트: 하나의 원(사용자)을 렌더링
import { Circle } from "../components/Circle";

// names: 각 원에 표시될 이름 배열
const names = [
  "나",
  "채민",
  "수빈",
  "하린",
  "진영",
  "구철",
  "도영",
  "도연",
  "은범",
  "운석",
  "효식",
  "우현",
  "민하",
  "유진",
  "재웅1",
  "재웅2",
  "경호",
  "준석",
  "세현",
];

// generateCircles: 중심 원 + 주변 원 위치와 속성 초기 생성
const generateCircles = (count: number) => {
  const circles = []; // 최종 원 리스트
  const layers = Math.ceil(Math.sqrt(count)); // 필요 레이어 수 계산
  let id = 0; // 원마다 고유 ID 부여

  // 중심 원 추가
  circles.push({
    id: id++,
    colors: ["#ffffff"], // 중심은 흰색
    name: names[0] || "중심",
    baseSize: 110, // 다른 원보다 크게
    isCenter: true,
    position: { x: 0, y: 0 },
  });

  // 주변 원들 계층적으로 배치 (원형 레이어)
  for (let layer = 1; id < names.length; layer++) {
    const perLayer = layer * 6; // 각 레이어에 위치할 원 수
    for (let i = 0; i < perLayer && id < names.length; i++) {
      const angle = (i / perLayer) * 2 * Math.PI;
      const radius = layer * 80;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      circles.push({
        id: id,
        name: names[id] || `이름${id}`,
        colors: [
          pastelColors[Math.floor(Math.random() * pastelColors.length)],
          pastelColors[Math.floor(Math.random() * pastelColors.length)],
        ],

        baseSize: 80,
        isCenter: false,
        position: { x, y },
      });
      id++;
    }
  }
  return circles;
};

export default function Relation() {
  // 상태: 모든 원 정보 저장
  const [gridCircles, setGridCircles] = useState(() => generateCircles(names.length));

  // phoneRef: 전체 wrapper (중심 기준 계산용)
  const phoneRef = useRef<HTMLDivElement>(null);
  // innerRef: 모든 원들을 담는 내부 드래그 요소
  const innerRef = useRef<HTMLDivElement>(null);

  // hoveredIndex: 중심에 가장 가까운 원 index (확대용)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 중심에서 가장 가까운 원 탐색 (100ms마다)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (!innerRef.current || !phoneRef.current) return;

        const rect = phoneRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const circles = innerRef.current.querySelectorAll(".circle");

        let closestId: number | null = null;
        let minDistance = Infinity;

        circles.forEach((circle: any, index) => {
          const rect = circle.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(cx - centerX, cy - centerY);
          if (dist < 60 && dist < minDistance) {
            closestId = index;
            minDistance = dist;
          }
        });

        setHoveredIndex(closestId);
      }, 100);

      return () => clearInterval(interval);
    }, 1000); // 1초 후부터 감지 시작

    return () => clearTimeout(timeout);
  }, []);

  // 원끼리 겹침 방지 알고리즘 (간단한 충돌 해소)
  const resolveOverlaps = (positions: any[], sizes: number[]) => {
    const maxIterations = 3;
    for (let iter = 0; iter < maxIterations; iter++) {
      for (let i = 0; i < positions.length; i++) {
        for (let j = 0; j < positions.length; j++) {
          if (i === j) continue;
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.hypot(dx, dy);
          const minDist = (sizes[i] + sizes[j]) / 2;
          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            positions[i].x += nx * (overlap / 2);
            positions[i].y += ny * (overlap / 2);
            positions[j].x -= nx * (overlap / 2);
            positions[j].y -= ny * (overlap / 2);
          }
        }
      }
    }
    return positions;
  };

  // 원들 렌더링 (hover된 원은 확대, 주변은 밀려남)
  const renderCircles = (circles: any[], hoveredIndex: number | null) => {
    const expandedSize = 1.3; // 확대 비율
    const pushRadius = 100; // hover 시 밀어내는 반경

    const hoveredCircle = hoveredIndex != null ? circles[hoveredIndex] : null;

    const tempPositions = circles.map(c => ({ ...c.position }));
    const tempSizes = circles.map((c, i) =>
      i === hoveredIndex ? c.baseSize * expandedSize : c.baseSize
    );

    // 중심 근처 원을 hover했을 때 주변 원들 밀어냄
    if (hoveredCircle) {
      for (let i = 0; i < circles.length; i++) {
        if (i === hoveredIndex) continue;
        const dx = tempPositions[i].x - hoveredCircle.position.x;
        const dy = tempPositions[i].y - hoveredCircle.position.y;
        const dist = Math.hypot(dx, dy);
        if (dist < pushRadius && dist > 0) {
          const pushAmount = (pushRadius - dist) * 0.5;
          const normX = dx / dist;
          const normY = dy / dist;
          tempPositions[i].x += normX * pushAmount;
          tempPositions[i].y += normY * pushAmount;
        }
      }
      resolveOverlaps(tempPositions, tempSizes);
    }

    // 각 원 컴포넌트 렌더링
    return circles.map((circle, i) => {
      const isHovered = i === hoveredIndex;
      const scale = isHovered ? expandedSize : 1;
      const size = circle.baseSize * scale;
      const x = tempPositions[i].x;
      const y = tempPositions[i].y;

      return (
        <Circle
          key={circle.id}
          id={circle.id}
          name={circle.name}
          x={x}
          y={y}
          size={size}
          colors={circle.colors}
          isHovered={isHovered}
          isCenter={circle.isCenter}
        />
      );
    });
  };

  return (
    <div className="base relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full" ref={phoneRef}>
        {/* 중심 위치를 표시하는 시각적 가이드 */}
        <div className="absolute top-1/2 left-1/2 w-10 h-10 border-2 border-dashed border-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />

        {/* 원들 담는 드래그 가능한 레이어 */}
        <motion.div
          drag
          dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
          className="w-full h-full cursor-grab"
          ref={innerRef}
          whileDrag={{ scale: 1.05 }}
        >
          {renderCircles(gridCircles, hoveredIndex)}
        </motion.div>
      </div>
    </div>
  );
}
