import type { Variants } from 'framer-motion'
import { duration, easing } from './tokens'

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.outExpo },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: duration.base * 0.7, ease: easing.in },
  },
}

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: easing.outExpo },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: duration.base * 0.7, ease: easing.in },
  },
}

export const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: duration.medium, ease: easing.outExpo },
  },
  exit: {
    x: '100%',
    opacity: 0.8,
    transition: { duration: duration.medium * 0.7, ease: easing.in },
  },
}

export const sheetVariants: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { duration: duration.medium, ease: easing.outExpo },
  },
  exit: {
    y: '100%',
    transition: { duration: duration.medium * 0.7, ease: easing.in },
  },
}

export const scrimVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast },
  },
}

export const staggerContainer = (staggerMs = 60): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerMs / 1000,
    },
  },
})
