import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Flame } from 'lucide-react';
import { Habit } from '@/types';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`
        relative flex items-center gap-4 rounded-xl p-4
        bg-white/5 backdrop-blur-lg
        border border-white/10 shadow-lg
        hover:bg-white/10 transition-all
        ${isDragging ? 'z-50 scale-105' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      {...attributes}
    >
      <button
        className="flex-none cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80"
        {...listeners}
      >
        <GripVertical size={20} />
      </button>

      <button
        onClick={onToggle}
        className={`
          relative flex-none h-6 w-6 rounded-lg
          border-2 transition-all duration-300
          ${habit.completed
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent'
            : 'border-white/30 hover:border-white/50'
          }
        `}
      >
        {habit.completed && (
          <motion.svg
            className="absolute inset-0 h-full w-full text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}
      </button>

      <div className="flex-grow">
        <h3 className="text-lg font-medium text-white">{habit.name}</h3>
        {habit.description && (
          <p className="text-sm text-white/60">{habit.description}</p>
        )}
      </div>

      {habit.streak > 0 && (
        <div className="flex items-center gap-1 text-orange-400">
          <Flame size={16} className="animate-pulse" />
          <span className="text-sm font-medium">{habit.streak} days</span>
        </div>
      )}
    </motion.div>
  );
}; 