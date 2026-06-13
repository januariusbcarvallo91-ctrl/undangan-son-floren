/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollSectionProps {
  children: ReactNode;
  variant?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
  className?: string;
  delay?: number;
  duration?: number;
}

export default function ScrollSection({
  children,
  variant = 'scale',
  className = '',
  delay = 0,
  duration = 0.8,
}: ScrollSectionProps) {
  const getVariants = () => {
    switch (variant) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
      case 'fade-in':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: -40, scale: 0.95 },
          visible: { opacity: 1, x: 0, scale: 1 },
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: 40, scale: 0.95 },
          visible: { opacity: 1, x: 0, scale: 1 },
        };
      case 'scale':
      default:
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // premium cubic bezier
      }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
