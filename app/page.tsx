"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun, RotateCcw, RotateCw } from 'lucide-react';
import { useTheme } from 'next-themes';
import confetti from 'canvas-confetti';
import { HabitList } from '@/components/HabitList';
import { CircularProgress } from '@/components/CircularProgress';
import { AddHabitModal } from '@/components/AddHabitModal';
import { useHabits } from '@/hooks/useHabits';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    habits,
    addHabit,
    toggleHabit,
    updateHabits,
    deleteHabit,
    getCompletionPercentage,
  } = useHabits();

  // History for undo/redo
  const [history, setHistory] = useState<Array<typeof habits>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (getCompletionPercentage() === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [habits]);

  // Update history when habits change
  useEffect(() => {
    if (historyIndex === -1) {
      setHistory([habits]);
      setHistoryIndex(0);
    } else {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), habits]);
      setHistoryIndex(prev => prev + 1);
    }
  }, [habits]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      updateHabits(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      updateHabits(history[historyIndex + 1]);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
            Daily Habits
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RotateCw size={20} />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <CircularProgress percentage={getCompletionPercentage()} />
        </div>

        {/* Habits List */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Your Habits
          </h2>
          <HabitList
            habits={habits}
            onHabitsChange={updateHabits}
            onToggleHabit={toggleHabit}
          />
        </div>

        {/* Add Habit Button */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={24} />
        </motion.button>

        {/* Add Habit Modal */}
        <AddHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addHabit}
        />
      </div>
    </main>
  );
}
