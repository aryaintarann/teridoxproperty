"use client";

import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function BlurText({ text, className = "", delay = 0, duration = 0.8 }: BlurTextProps) {
  const words = (text || "").split(" ");

  return (
    <span className={`inline-flex flex-wrap gap-1 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: duration,
            delay: delay + i * 0.05,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
