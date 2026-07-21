// Portfolio presentations should keep their full motion even when the
// operating system has "reduced motion" enabled.
export const FORCE_FULL_MOTION = true;

export function shouldReducePortfolioMotion(
  systemReducedMotion,
  forceFullMotion = FORCE_FULL_MOTION,
) {
  return forceFullMotion ? false : Boolean(systemReducedMotion);
}
