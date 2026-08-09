import { motion, useReducedMotion } from "framer-motion";

export function StaggerGrid({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0, scale: 1 }, visible: { opacity: 1, y: 0, scale: 1 } }
    : {
        hidden: { opacity: 0, y: 14, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  return <motion.div variants={itemVariants}>{children}</motion.div>;
}