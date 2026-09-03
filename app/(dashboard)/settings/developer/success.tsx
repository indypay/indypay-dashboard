'use client';

import { motion } from 'framer-motion';

export default function AnimatedTick() {
  return (
    <div className="flex items-center justify-center w-16 h-16">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 64 64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.path
          fill="none"
          stroke="#4CAF50"
          strokeWidth="4"
          d="M16 32l10 10 22-22"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
}
