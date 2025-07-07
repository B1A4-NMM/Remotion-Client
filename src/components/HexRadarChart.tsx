import React, { useMemo } from "react";
import { line as d3line, curveCardinalClosed } from "d3-shape";
import { motion } from "framer-motion";

type Props = {
  values: number[]; // 0~4 값 6개
};

const WIDTH = 100;
const HEIGHT = 00;
const RADIUS = 100;
const CENTER_X = WIDTH / 3;
const CENTER_Y = HEIGHT / 2;
const LEVELS = 5;

const HexRadarChart: React.FC<Props> = ({ values }) => {
  const polarToCartesian = (angle: number, ratio: number) => {
    const x = CENTER_X + RADIUS * ratio * Math.cos(angle);
    const y = CENTER_Y + RADIUS * ratio * Math.sin(angle);
    return [x, y];
  };

  const backgroundPaths = useMemo(() => {
    return [...Array(LEVELS)].map((_, level) => {
      const ratio = level / (LEVELS - 1);
      const points = [...Array(6)].map((_, i) => {
        const angle = (2 * Math.PI * i) / 6;
        return polarToCartesian(angle, ratio);
      });

      const line = d3line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(curveCardinalClosed);

      return line(points as [number, number][])!;
    });
  }, []);

  const { dataPath, pointCoords } = useMemo(() => {
    const coords = values.map((v, i) => {
      const angle = (2 * Math.PI * i) / 6;
      return polarToCartesian(angle, v / (LEVELS - 1));
    });

    const line = d3line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(curveCardinalClosed);

    return {
      dataPath: line(coords as [number, number][])!,
      pointCoords: coords,
    };
  }, [values]);

  return (
    <div className="flex justify-center items-center p-6 rounded-xl w-full h-[300px]">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        {/* 회색 배경선 */}
        {backgroundPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#444" strokeWidth={0.8} />
        ))}

        <motion.g
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.path
            d={dataPath}
            fill="#E63995"
            stroke="#E63995"
            strokeWidth={2}
            fillOpacity={0.7}
            initial={false}
            animate={{ d: dataPath }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </motion.g>
        {/* 꼭짓점 점 */}
        {pointCoords.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill="#fff"
            stroke="#E63995"
            strokeWidth={1.5}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
          />
        ))}
      </svg>
    </div>
  );
};

export default HexRadarChart;
