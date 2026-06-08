"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }} // mulai transparan + turun
      animate={{ opacity: 1, y: 0 }} // fade in + naik
      exit={{ opacity: 0, y: -20 }} // kalau di-unmount, fade out + ke atas
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
