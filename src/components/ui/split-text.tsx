"use client";

import { motion } from "framer-motion";
import React from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
}: SplitTextProps) {
  const words = text.split(" ");

  return (
    <div className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration,
            delay: delay + i * 0.1,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="mr-2 mb-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
