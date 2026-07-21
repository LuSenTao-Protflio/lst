import { useReducedMotion } from "framer-motion";
import { shouldReducePortfolioMotion } from "../config/motion";

export default function usePortfolioReducedMotion() {
  const systemReducedMotion = useReducedMotion();

  return shouldReducePortfolioMotion(systemReducedMotion);
}
