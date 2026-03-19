"use client";
import { motion, useReducedMotion } from "framer-motion";
import { sectionReveal, staggerRevealChild, staggerRevealParent } from "@/lib/motion";
export function Reveal({ children, className, delay = 0 }) {
    const reduceMotion = useReducedMotion();
    return (<motion.div className={className} initial={reduceMotion ? { opacity: 1 } : "hidden"} whileInView={reduceMotion ? { opacity: 1 } : "show"} variants={reduceMotion ? undefined : sectionReveal} viewport={{ once: true, margin: "-12% 0px -12% 0px" }} transition={{ delay }}>
      {children}
    </motion.div>);
}
export const staggerParent = staggerRevealParent;
export const staggerChild = staggerRevealChild;
