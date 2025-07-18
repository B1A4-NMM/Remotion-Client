
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

const ANIMATED_PATHS = [
  "/analysis",
  "/relation"
];

const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();

  // analysis, analysis/*, relation, relation/* 경로만 애니메이션 적용
  const shouldAnimate = ANIMATED_PATHS.some((base) =>
    location.pathname === base || location.pathname.startsWith(base + "/")
  );

  const animation = {
    initial: { 
      opacity: 0,
      x: -100,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: 100,
    },
    transition: {
      duration: 0.3,
    },
  };

  if (!shouldAnimate) {
    // 애니메이션 필요 없는 경우 일반 렌더링
    return <>{element}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && (
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animation}
          transition={animation.transition}
        >
          {element}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
