"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun, RotateCcw, RotateCw, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import Confetti from 'react-confetti';
import { HabitList } from '@/components/HabitList';
import { CircularProgress } from '@/components/CircularProgress';
import { AddHabitModal } from '@/components/AddHabitModal';
import { OperatorLogin } from '@/components/OperatorLogin';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';

const pageTransitionVariants = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { 
    opacity: 1, 
    filter: 'blur(0px)', 
    transition: { 
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.5,
  }
  },
  exit: { 
    opacity: 0, 
    filter: 'blur(8px)', 
    transition: { 
      duration: 0.5, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      type: 'spring',
      stiffness: 50,
      damping: 20,
      delay: 0.5 + delay,
      duration: 1.2,
    },
  }),
};

const LoadingSequence = () => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const loadingSteps = [
    "INITIALIZING QUANTUM CORE...",
    "ESTABLISHING NEURAL INTERFACE...",
    "CALIBRATING DIMENSIONAL MATRIX...",
    "SYNCHRONIZING TIME PROTOCOLS...",
    "LOADING QUANTUM ALGORITHMS...",
    "ESTABLISHING QUANTUM LINK...",
    "REALITY INTERFACE ONLINE"
  ];

  // Typewriter effect for current step
  useEffect(() => {
    if (loadingStep >= loadingSteps.length) return;
    
    const text = loadingSteps[loadingStep];
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setLoadingText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Move to next step after a delay
        setTimeout(() => {
          setLoadingStep(prev => prev + 1);
        }, 500);
      }
    }, 50); // Typing speed

    return () => clearInterval(typingInterval);
  }, [loadingStep]);

  // Calculate percentage based on both the current step and typing progress
  const calculateProgress = () => {
    if (loadingStep >= loadingSteps.length) return 100;
    const stepProgress = (loadingStep / (loadingSteps.length - 1)) * 100;
    const typingProgress = (loadingText.length / loadingSteps[loadingStep].length) * (100 / loadingSteps.length);
    return Math.min(100, Math.round(stepProgress + typingProgress));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="terminal-screen w-full max-w-2xl aspect-video p-8 rounded-sm">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full flex flex-col items-center justify-center gap-8"
        >
          <>
            <div className="flex flex-col items-center gap-2 w-full">
          <motion.div 
            className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="terminal-text text-xl mb-2">
                  {loadingText}<span className="terminal-cursor" />
                </p>
                <p className="terminal-text-static text-sm opacity-60">
                  {calculateProgress()}% COMPLETE
                </p>
              </motion.div>
              
              <div className="loading-bar-container mt-4">
                <motion.div
                  className="loading-bar"
                  initial={{ width: "0%" }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs opacity-50 font-mono mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="terminal-text-static">
                    SYSTEM_{i + 1}_OK
                  </span>
                </div>
              ))}
            </div>
          </>
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [operatorName, setOperatorName] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const {
    habits,
    addHabit,
    toggleHabit,
    updateHabits,
    getCompletionPercentage,
    deleteHabit,
  } = useHabits();

  const [history, setHistory] = useState<Habit[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Increase loading time for more dramatic effect
    const mountTimer = setTimeout(() => setMounted(true), 1000);
    const loadTimer = setTimeout(() => {
      setIsFullyLoaded(true);
      // Always show login screen on refresh
      setOperatorName(null);
    }, 6000);
    
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const completionPercentage = useMemo(getCompletionPercentage, [habits]);

  useEffect(() => {
    if (completionPercentage === 100 && habits.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [completionPercentage, habits.length]);

  useEffect(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(habits)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [habits]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevHistoryIndex = historyIndex - 1;
      updateHabits(JSON.parse(JSON.stringify(history[prevHistoryIndex])));
      setHistoryIndex(prevHistoryIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextHistoryIndex = historyIndex + 1;
      updateHabits(JSON.parse(JSON.stringify(history[nextHistoryIndex])));
      setHistoryIndex(nextHistoryIndex);
    }
  };

  if (!mounted || !isFullyLoaded) {
    return <LoadingSequence />;
  }

  if (!operatorName) {
    return <OperatorLogin onComplete={setOperatorName} />;
  }

  return (
    <motion.div 
      className="terminal-container"
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {showConfetti && 
        <Confetti 
          recycle={false} 
          numberOfPieces={300}
          gravity={0.1} 
          initialVelocityX={{min: -8, max: 8}}
          initialVelocityY={{min: -12, max: 4}}
          colors={['#00FF00', '#33FF33', '#66FF66']}
          className="!fixed z-[100]"
        />
      }
      
      <header className="w-full max-w-3xl mx-auto px-2 sm:px-3 py-2 sm:py-3">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0.1}>
          <h1 className="terminal-title text-base sm:text-lg md:text-xl mb-1">
            {'>'}QUANTUM HABITS_ <span className="text-sm opacity-70">| OPERATOR: {operatorName}</span>
          </h1>
          <p className="terminal-subtitle text-2xs sm:text-xs">
            $ initialize reality_matrix --mode=optimization
          </p>
        </motion.div>
      </header>

      <main className="w-full max-w-xl mx-auto px-2 sm:px-3 py-2 flex flex-col gap-3 sm:gap-4">
        <motion.section 
          aria-label="Overall Progress Nexus"
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          custom={0.3}
          className="flex justify-center"
        >
          <CircularProgress percentage={completionPercentage} />
          <div className="text-center mt-1">
            <p className="terminal-text text-2xs sm:text-xs">
              {completionPercentage === 0 
                ? "SYSTEM STANDBY. AWAITING DIRECTIVE... ⚡️"
                : `SYSTEM OPTIMIZATION: ${completionPercentage}%`
              }
            </p>
                </div>
        </motion.section>

        <motion.section 
          aria-label="Habit Protocols Interface"
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          custom={0.4}
          className="terminal-window relative"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="terminal-section-title text-sm sm:text-base">
              {'>'}ACTIVE_PROTOCOLS
            </h2>
          </div>

          <HabitList
            habits={habits}
            onHabitsChange={updateHabits}
            onToggleHabit={toggleHabit}
            onDeleteHabit={deleteHabit}
          />
          
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="add-habit-btn"
            whileHover={{ 
              scale: 1.05,
              boxShadow: 'var(--terminal-glow)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              transition: { delay: 0.2, type: 'spring', stiffness: 200}
            }}
            aria-label="Initiate New Habit Protocol"
          >
            <Plus size={12} />
          </motion.button>
        </motion.section>
      </main>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </motion.div>
  );
}
