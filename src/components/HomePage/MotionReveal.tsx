"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface MotionRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function MotionReveal({
    children,
    className,
    delay = 0,
}: MotionRevealProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                delay: shouldReduceMotion ? 0 : delay,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}
