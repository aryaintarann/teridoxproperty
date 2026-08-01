"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function SplitText({ text, className = "", delay = 0, duration = 0.5 }: SplitTextProps) {
  const characters = text.split("");

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {characters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: duration,
            delay: delay + i * 0.02,
            ease: [0.215, 0.61, 0.355, 1.0], // smooth premium ease out
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
