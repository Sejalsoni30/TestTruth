import React from 'react';
import { motion } from 'framer-motion';

export const HeroMeshBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radiant Orb 1 (Top Left Accent Rose) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/30 blur-3xl"
      />

      {/* Radiant Orb 2 (Center Right Warm Cream Glow) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, -40, 0],
          y: [0, 35, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 right-0 w-[480px] h-[480px] rounded-full bg-[#E6D2C4]/20 blur-3xl"
      />

      {/* Radiant Orb 3 (Bottom Center Deep Mauve) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-24 left-1/3 w-[380px] h-[380px] rounded-full bg-accent/25 blur-3xl"
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(247, 239, 231, 0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

