import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Terminal, Hash, Zap } from 'lucide-react';
import { Habit } from '@/types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'completed'>) => void;
}

const COMMON_HABITS = [
  {
    name: "Morning Meditation",
    description: "Start the day with 10 minutes of mindfulness",
    category: "MINDFULNESS"
  },
  {
    name: "Daily Exercise",
    description: "30 minutes of physical activity",
    category: "FITNESS"
  },
  {
    name: "Read Books",
    description: "Read for 20 minutes",
    category: "LEARNING"
  },
  {
    name: "Drink Water",
    description: "8 glasses of water daily",
    category: "HEALTH"
  },
  {
    name: "Code Practice",
    description: "1 hour of coding practice",
    category: "LEARNING"
  },
  {
    name: "Journal Writing",
    description: "Document daily thoughts and experiences",
    category: "MINDFULNESS"
  },
  {
    name: "Early Rise",
    description: "Wake up at 6:00 AM",
    category: "PRODUCTIVITY"
  },
  {
    name: "Healthy Meal",
    description: "Prepare a nutritious meal",
    category: "HEALTH"
  }
] as const;

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    // Simulate loading for terminal effect
    await new Promise(resolve => setTimeout(resolve, 1000));

    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
      position: Date.now(),
      category: 'CUSTOM',
      frequency: 'DAILY',
      reminder: 'NONE'
    });

    setName('');
    setDescription('');
    setLoading(false);
    onClose();
  };

  const selectCommonHabit = (habit: typeof COMMON_HABITS[number]) => {
    setName(habit.name);
    setDescription(habit.description);
    setShowSuggestions(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="terminal-window w-full max-w-xl relative"
          >
            {/* Terminal Header */}
            <div className="terminal-header mb-4">
              <div className="terminal-controls">
                <div className="terminal-control bg-red-500 w-3 h-3" onClick={onClose}></div>
                <div className="terminal-control bg-yellow-500 w-3 h-3"></div>
                <div className="terminal-control bg-green-500 w-3 h-3"></div>
              </div>
              <div className="flex-1 text-center text-base opacity-70">Initialize New Protocol</div>
            </div>

            <form onSubmit={handleSubmit} className="terminal-content space-y-4 p-3">
              {showSuggestions ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-terminal-green" />
                    <h3 className="terminal-text text-sm">{'>'}_Quick Protocol Selection</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {COMMON_HABITS.map((habit) => (
                      <motion.button
                        key={habit.name}
                        type="button"
                        onClick={() => selectCommonHabit(habit)}
                        className="terminal-suggestion-btn text-left p-2 border border-terminal-green border-opacity-20 
                                 hover:border-opacity-50 hover:bg-terminal-green hover:bg-opacity-10 transition-all duration-200
                                 rounded-sm flex flex-col gap-0.5"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-terminal-green text-sm font-medium">{habit.name}</span>
                        <span className="text-xs opacity-70 line-clamp-2">{habit.description}</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="terminal-button text-sm px-3 py-1.5"
                    >
                      {'>'}_Custom Protocol
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash size={16} className="text-terminal-green" />
                      <label htmlFor="name" className="terminal-text text-sm">
                        {'>'}_Protocol Name
                      </label>
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="terminal-input w-full text-sm p-2"
                      placeholder="Enter protocol designation..."
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-terminal-green" />
                      <label htmlFor="description" className="terminal-text text-sm">
                        {'>'}_Protocol Description
                      </label>
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="terminal-input w-full text-sm p-2 min-h-[80px] resize-none"
                      placeholder="Enter protocol specifications..."
                      maxLength={200}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-terminal-green border-opacity-20">
                <button
                  type="button"
                  onClick={() => setShowSuggestions(true)}
                  className="terminal-button text-sm px-4 py-2"
                >
                  <span className="flex items-center gap-2">
                    <Zap size={16} />
                    QUICK SELECT
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="terminal-button text-sm px-4 py-2"
                >
                  <span className="flex items-center gap-2">
                    <X size={16} />
                    ABORT
                  </span>
                </button>
                {!showSuggestions && (
                  <button
                    type="submit"
                    disabled={!name.trim() || loading}
                    className="terminal-button text-sm px-4 py-2 min-w-[140px] justify-center"
                  >
                    {loading ? (
                      <span className="terminal-loading flex items-center gap-2">
                        <span className="animate-pulse">INITIALIZING</span>
                        <span className="animate-[blink_1s_steps(1)_infinite]">...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Plus size={16} />
                        INITIALIZE
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 