import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CircularProgressProps {
  percentage: number;
}

const AnimatedPercentage: React.FC<{ percentage: number }> = ({ percentage }) => {
  const spring = useSpring(0, { stiffness: 80, damping: 25, mass: 1 });
  const display = useTransform(spring, (current) => Math.round(current));

  React.useEffect(() => {
    spring.set(percentage);
  }, [spring, percentage]);

  return <motion.span>{display}</motion.span>;
};

export const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 12;
  const viewBoxSize = 2 * (radius + strokeWidth + 5);
  const center = viewBoxSize / 2;

  const progressSpring = useSpring(circumference, { stiffness: 50, damping: 30, mass: 1.2 });
  React.useEffect(() => {
    progressSpring.set(circumference - (percentage / 100) * circumference);
  }, [progressSpring, percentage, circumference]);

  const getMotivationalText = (p: number) => {
    if (p === 0) return "SYSTEM STANDBY. AWAITING DIRECTIVE... _";
    if (p === 100) return "ALL SYSTEMS OPTIMAL. REALITY MATRIX SYNCED. _";
    if (p >= 75) return "CONVERGENCE IMMINENT. ENERGY SIGNATURES SPIKING. _";
    if (p >= 50) return "PARAMETER ESCALATION. CORE OUTPUT AT 50%. _";
    if (p >= 25) return "INITIALIZING SEQUENCE. SUBROUTINES ENGAGED. _";
    return "AWAITING INPUT. PATHWAY TO OPTIMIZATION OPEN. _";
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center gap-5 sm:gap-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
    >
      <div className="relative h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]">
        <svg
          className="absolute inset-0 -rotate-90 transform"
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          <defs>
            <filter id="terminalGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0
                        1 0 0 0 1
                        0 0 0 0 0
                        0 0 0 1 0"
              />
              <feComposite in="SourceGraphic" operator="over" />
            </filter>
            <linearGradient id="terminalProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 255, 0, 1)" />
              <stop offset="100%" stopColor="rgba(0, 255, 0, 0.7)" />
            </linearGradient>
            <clipPath id="circularClip">
              <circle cx={center} cy={center} r={radius + strokeWidth / 2 + 2} />
            </clipPath>
          </defs>

          <g clipPath="url(#circularClip)">
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              className="fill-none stroke-[rgba(0,255,0,0.1)]"
              strokeWidth={strokeWidth * 0.8} 
            />
            {/* Terminal Glow Effect */}
            <circle 
              cx={center}
              cy={center}
              r={radius + strokeWidth / 3}
              className="fill-none stroke-[rgba(0,255,0,0.2)]"
              strokeWidth={strokeWidth * 1.5}
              filter="url(#terminalGlow)"
            />
            {/* Progress Arc */}
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              className="fill-none stroke-[url(#terminalProgressGradient)]"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              style={{ strokeDashoffset: progressSpring }}
              strokeLinecap="round"
              filter="url(#terminalGlow)"
            />
          </g>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <div className="terminal-text text-4xl sm:text-5xl font-mono font-bold tracking-tighter leading-none">
            <AnimatedPercentage percentage={percentage} />%
          </div>
        </div>
      </div>

      <motion.p
        key={getMotivationalText(percentage)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "circOut" }}
        className="terminal-text text-center text-sm sm:text-base font-medium max-w-xs terminal-text-blink"
      >
        {getMotivationalText(percentage)}
      </motion.p>
    </motion.div>
  );
}; 