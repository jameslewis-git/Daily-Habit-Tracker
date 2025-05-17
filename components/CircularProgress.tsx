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
  const strokeWidth = 12;
  const viewBoxSize = 2 * (radius + strokeWidth + 5); // Added a little padding for clip path
  const center = viewBoxSize / 2;

  const circumference = 2 * Math.PI * radius;
  const progressSpring = useSpring(circumference, { stiffness: 50, damping: 30, mass: 1.2 });
  React.useEffect(() => {
    progressSpring.set(circumference - (percentage / 100) * circumference);
  }, [progressSpring, percentage, circumference]);

  const getMotivationalText = (p: number) => {
    if (p === 0) return "SYSTEM STANDBY. AWAITING DIRECTIVE... ⚡️";
    if (p === 100) return "ALL SYSTEMS OPTIMAL. REALITY MATRIX SYNCED. ✨";
    if (p >= 75) return "CONVERGENCE IMMINENT. ENERGY SIGNATURES SPIKING. 🌌";
    if (p >= 50) return "PARAMETER ESCALATION. CORE OUTPUT AT 50%. 🚀";
    if (p >= 25) return "INITIALIZING SEQUENCE. SUBROUTINES ENGAGED. 🌠";
    return "AWAITING INPUT. PATHWAY TO OPTIMIZATION OPEN. 💫";
  };

  const progressColorStop1 = `hsl(var(--primary))`;
  const progressColorStop2 = `hsl(var(--secondary))`;

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
            <filter id="atmosphereGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
              <feComponentTransfer in="offsetBlur" result="glowTransfer">
                <feFuncA type="linear" slope="0.7" intercept="0" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glowTransfer" />
                <feMergeNode in="SourceGraphic" /> 
              </feMerge>
            </filter>
            <linearGradient id="sciFiProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={progressColorStop1} />
              <stop offset="100%" stopColor={progressColorStop2} /> 
            </linearGradient>
            <clipPath id="circularClip">
              {/* Clip path slightly larger than the main radius + stroke to contain glow */}
              <circle cx={center} cy={center} r={radius + strokeWidth / 2 + 2} />
            </clipPath>
          </defs>

          <g clipPath="url(#circularClip)">
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              className="fill-none stroke-slate-500/15 dark:stroke-slate-700/20"
              strokeWidth={strokeWidth * 0.8} 
            />
            {/* Futuristic Glow / Atmosphere Base */}
            <circle 
              cx={center}
              cy={center}
              r={radius + strokeWidth / 3}
              className="fill-none stroke-primary/20 dark:stroke-primary/30 opacity-0 dark:opacity-60"
              strokeWidth={strokeWidth * 1.5}
              filter="url(#atmosphereGlow)"
            />
            {/* Progress Arc */}
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              className="fill-none stroke-[url(#sciFiProgressGradient)] drop-shadow-[0_0_8px_hsl(var(--primary)/0.7)] dark:drop-shadow-[0_0_12px_hsl(var(--primary)/0.9)]"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              style={{ strokeDashoffset: progressSpring }}
              strokeLinecap="round"
            />
          </g>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <div
            className="text-4xl sm:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary dark:from-primary dark:to-secondary tracking-tighter leading-none"
          >
            <AnimatedPercentage percentage={percentage} />%
          </div>
        </div>
      </div>

      <motion.p
        key={getMotivationalText(percentage)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "circOut" }}
        className="text-center text-sm sm:text-base font-medium text-muted-foreground max-w-xs text-focus-in"
      >
        {getMotivationalText(percentage)}
      </motion.p>
    </motion.div>
  );
}; 