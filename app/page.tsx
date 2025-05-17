"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun, RotateCcw, RotateCw, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import Confetti from 'react-confetti';
import { HabitList } from '@/components/HabitList';
import { CircularProgress } from '@/components/CircularProgress';
import { AddHabitModal } from '@/components/AddHabitModal';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';

const pageTransitionVariants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: "circOut" } },
  exit: { opacity: 0, filter: 'blur(4px)', transition: { duration: 0.3, ease: "circIn" } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20, delay, duration: 0.8 },
  }),
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    habits,
    addHabit,
    toggleHabit,
    updateHabits,
    getCompletionPercentage,
  } = useHabits();

  const [history, setHistory] = useState<Habit[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => setMounted(true), []);

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

  if (!mounted) return <div className="main-bg-pattern flex items-center justify-center"><p className="text-xl text-muted-foreground">Initializing Interface...</p></div>;

  return (
    <motion.div 
      className="main-bg-pattern flex flex-col items-center w-full text-foreground pb-10"
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {showConfetti && 
        <Confetti 
          recycle={false} 
          numberOfPieces={400} 
          gravity={0.1} 
          initialVelocityX={{min: -10, max: 10}}
          initialVelocityY={{min: -15, max: 5}}
          colors={theme === 'dark' ? ['#00BFFF', '#9F50FF', '#FFD700'] : ['#66CCFF', '#FFCCDD', '#A8E6CF']}
          className="!fixed z-[100]"
        />
      }
      
      <header className="w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10 flex justify-between items-center">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0.1}>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-primary-secondary text-tracking-in-contract">
            QUANTUM HABITS
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-focus-in">
            Engineer your optimal reality, one cycle at a time.
          </p>
        </motion.div>
        <motion.div className="flex items-center gap-2 sm:gap-3" variants={sectionVariants} initial="hidden" animate="visible" custom={0.2}>
          <motion.button
            whileHover={{ scale: 1.15, rotate: -8, boxShadow: "0px 5px 15px hsl(var(--primary)/0.3)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2.5 rounded-lg hover:bg-card/80 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo Action Matrix Reversion"
          >
            <RotateCcw size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 8, boxShadow: "0px 5px 15px hsl(var(--primary)/0.3)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1 || history.length <= 1}
            className="p-2.5 rounded-lg hover:bg-card/80 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Redo Action Matrix Forwarding"
          >
            <RotateCw size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15, boxShadow: "0px 0px 12px hsl(var(--accent)/0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-lg hover:bg-card/80"
            title="Toggle Dimensional Theme Shift"
          >
            {theme === 'dark' ? <Sun size={22} className="text-accent"/> : <Moon size={22} className="text-accent"/>}
          </motion.button>
        </motion.div>
      </header>

      <main className="w-full max-w-2xl px-4 sm:px-6 py-8 flex flex-col gap-10 sm:gap-12">
        <motion.section 
          aria-label="Overall Progress Nexus"
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          custom={0.3}
          className="flex justify-center"
        >
          <CircularProgress percentage={completionPercentage} />
        </motion.section>

        <motion.section 
          aria-label="Habit Protocols Interface"
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          custom={0.4}
          className="glassmorphism-interactive rounded-2xl p-4 sm:p-6"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-focus-in">
              Active Protocols
            </h2>
          </div>
          <HabitList
            habits={habits}
            onHabitsChange={updateHabits}
            onToggleHabit={toggleHabit}
          />
        </motion.section>
      </main>

      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="btn-futuristic fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center !rounded-full !p-0 shadow-xl shadow-primary/40 dark:shadow-glow-primary"
        whileHover={{ scale: 1.1, y: -5, transition: { type: 'spring', stiffness: 250 } }}
        whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400 } }}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0.6}
        aria-label="Initiate New Habit Protocol"
      >
        <Plus size={30} />
      </motion.button>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </motion.div>
  );
}
