'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { cn } from '@heroui/react';

interface AnimatedCopyIconProps {
  onCopy: () => void;
  className?: string;
}

export function AnimatedCopyIcon({ onCopy, className }: AnimatedCopyIconProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleClick = () => {
    setIsCopied(true);
    onCopy();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative w-4 h-4 m-3 text-gray-500 hover:text-gray-700',
        className,
      )}
      aria-label={isCopied ? 'Copied' : 'Copy'}
    >
      <AnimatePresence initial={false} mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="w-full h-full text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Copy className="w-full h-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
