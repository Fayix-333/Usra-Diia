import { Variants } from 'motion/react';

/**
 * Top-level page transition variants between sections in App.tsx
 * Coordinates child animations and provides a fluid, polished entry/exit.
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.04,
      when: 'beforeChildren'
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 1.012,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Stagger Container variants for sections and sub-containers.
 * Staggers direct children variants.
 */
export const staggerContainerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
      duration: 0.18,
    },
  },
};

/**
 * Faster Stagger Container for badge lists, filter pills, and button rows.
 */
export const fastStaggerContainerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
  },
};

/**
 * Standard staggered item (headers, text blocks, banners, rows).
 */
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 22,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(2px)',
    transition: {
      duration: 0.18,
      ease: 'easeOut',
    },
  },
};

/**
 * Staggered Card variants for grids, cards, posters, and profiles.
 */
export const staggerCardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: {
      duration: 0.18,
      ease: 'easeOut',
    },
  },
};

/**
 * Section Header Stagger variant (drops in smoothly from top).
 */
export const staggerHeaderVariants: Variants = {
  initial: {
    opacity: 0,
    y: -16,
    filter: 'blur(3px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 28,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};
