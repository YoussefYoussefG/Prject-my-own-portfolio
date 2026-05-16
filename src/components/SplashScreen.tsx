"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock scrolling while splash screen is active
    document.body.style.overflow = "hidden";

    // Sequence timing
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = "";
        onComplete();
      }, 1000); // Wait for exit animation to finish before calling onComplete
    }, 2500); // Time to show the splash screen

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[#F9F8F6] flex flex-col items-center justify-center"
        >
          <div className="relative flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-serif text-foreground tracking-tight"
            >
              YG
            </motion.h1>
            
            {/* Animated line underneath */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
              className="h-[2px] bg-accent/80 mt-4"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
