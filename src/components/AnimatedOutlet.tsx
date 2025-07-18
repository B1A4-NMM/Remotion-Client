
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const ANIMATED_PATHS = ["/analysis", "/relation"];

const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();
  const prevPathRef = useRef(location.pathname);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    // /analysis <-> /relation 이동에만 애니메이션 적용
    const isAnalysis = curr === "/analysis";
    const isRelation = curr === "/relation";
    const wasAnalysis = prev === "/analysis";
    const wasRelation = prev === "/relation";
    if ((isAnalysis && wasRelation) || (isRelation && wasAnalysis)) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
    prevPathRef.current = curr;
  }, [location.pathname]);

  if (!shouldAnimate) {
    return <>{element}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && (
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {element}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
