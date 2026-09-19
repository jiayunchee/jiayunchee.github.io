"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

// Skip the fade on the very first load so content appears instantly,
// then gently fade in every page you navigate to afterwards.
let isFirstLoad = true;

export default function Template({ children }: { children: ReactNode }) {
  const shouldFade = !isFirstLoad;

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  return (
    <motion.div
      initial={shouldFade ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
