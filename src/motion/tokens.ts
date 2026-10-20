// Motion tokens matching PRD Section 19 and 28
export const duration = {
  instant: 0.08,
  fast: 0.12,
  base: 0.22,
  medium: 0.32,
  slow: 0.48,
  cinematic: 0.7,
}

export const easing = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  standard: [0.2, 0, 0, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  curtain: [0.76, 0, 0.24, 1] as const,
}
