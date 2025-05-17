import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  percentage: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getMotivationalText = (percentage: number) => {
    if (percentage === 0) return "Let's get started!";
    if (percentage === 100) return "Amazing job! You did it! 🎉";
    if (percentage >= 75) return "Almost there! Keep pushing!";
    if (percentage >= 50) return "Halfway there! You're doing great!";
    if (percentage >= 25) return "Great progress! Keep going!";
    return "You've made a start! Keep it up!";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-[160px] w-[160px]">
        {/* Background circle */}
        <svg
          className="absolute inset-0 -rotate-90 transform"
          width="160"
          height="160"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none stroke-white/10"
            strokeWidth="12"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none stroke-[url(#progress-gradient)]"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5BCEFA" />
              <stop offset="100%" stopColor="#FF6AC1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.span
              key={percentage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold text-white"
            >
              {percentage}%
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Motivational text */}
      <motion.p
        key={getMotivationalText(percentage)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-lg font-medium text-white/80"
      >
        {getMotivationalText(percentage)}
      </motion.p>
    </div>
  );
}; 