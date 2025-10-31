"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function FloatingParticles() {
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -100, y: Math.random() * 100 }}
          animate={{
            opacity: [0, 1, 0],
            x: windowWidth,
            y: Math.random() * 100 + i * 100,
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
        />
      ))}
    </div>
  );
}

