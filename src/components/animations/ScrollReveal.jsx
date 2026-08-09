import { motion, useReducedMotion } from "framer-motion";

export default function ScrollReveal({ children, delay = 0, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}