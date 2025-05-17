import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Flame, Zap, CheckCircle, Target, Trash2 } from 'lucide-react';
import { Habit } from '@/types';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, onDelete }) => {
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
    transition: isDragging ? undefined : transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.75 : 1,
  };

  const cardVariants = {
    initial: { opacity: 0, y: 25, scale: 0.96, filter: 'blur(3px)' },
    animate: { 
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', 
      transition: { type: 'spring', stiffness: 260, damping: 22, duration: 0.5 }
    },
    exit: { opacity: 0, y: -20, scale: 0.95, filter: 'blur(3px)', transition: { duration: 0.25 } },
    hover: { 
      scale: 1.02,
      boxShadow: "0 0 20px rgba(0, 255, 0, 0.2)",
      borderColor: "var(--terminal-green)"
    }
  };
  
  const streakGlowClass = habit.streak > 5 
    ? 'shadow-glow-accent dark:shadow-glow-accent' 
    : habit.streak > 0 ? 'shadow-sm dark:shadow-md' : '';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`
        terminal-card relative flex items-center gap-4 sm:gap-6 rounded-xl p-5 sm:p-6 
        ${isDragging ? 'scale-105 shadow-glow-primary cursor-grabbing' : 'cursor-default'}
        ${habit.completed ? 'bg-opacity-40' : 'bg-opacity-70'}
      `}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      layout
      {...attributes}
    >
      <motion.button
        className="flex-none cursor-grab active:cursor-grabbing text-terminal-green opacity-60 hover:opacity-100 p-1 rounded-md focus-visible:ring-1 focus-visible:ring-terminal-green"
        {...listeners}
        title="Drag to reorder protocol"
        whileTap={{ scale: 1.2, color: 'var(--terminal-green)' }}
      >
        <GripVertical size={14} strokeWidth={1.5} />
      </motion.button>

      <motion.button
        onClick={onToggle}
        className={`
          relative flex-none h-6 w-6 sm:h-8 sm:w-8 rounded-lg 
          flex items-center justify-center 
          border border-terminal-green transition-all duration-200 ease-in-out 
          focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-terminal-background focus-visible:ring-terminal-green
          group terminal-button
          ${habit.completed
            ? 'shadow-glow-primary'
            : 'hover:shadow-glow-primary'
          }
        `}
        whileHover={{ 
          scale: 1.1,
          transition: { type: 'spring', stiffness: 300, damping: 15 }
        }}
        whileTap={{ scale: 0.9, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
        title={habit.completed ? "Deactivate Protocol" : "Activate Protocol"}
      >
        <AnimatePresence mode='wait' initial={false}>
          {habit.completed ? (
            <motion.div
              key="completed-icon"
              initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: 0, 
                transition: { type: "spring", stiffness: 400, damping: 18, delay: 0.05 } 
              }}
              exit={{ 
                scale: 0.3, 
                opacity: 0, 
                rotate: 90, 
                transition: { type: "spring", stiffness: 300, damping: 20, duration: 0.2 } 
              }}
              className="text-terminal-green"
            >
              <CheckCircle size={14} strokeWidth={2}/>
            </motion.div>
          ) : (
            <motion.div
              key="incomplete-icon"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                transition: { type: "spring", stiffness: 400, damping: 18 } 
              }}
              exit={{ 
                scale: 0.6, 
                opacity: 0, 
                transition: { type: "spring", stiffness: 300, damping: 20, duration: 0.15 } 
              }}
              className="text-terminal-green opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Target size={13} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-grow min-w-0 mr-2">
        <h3 className={`terminal-text text-sm sm:text-base font-semibold transition-colors duration-300 truncate 
          ${habit.completed ? 'line-through opacity-70' : 'hover:text-terminal-green'}
        `}>
          {habit.name}
        </h3>
        {habit.description && (
          <p className={`text-xs sm:text-sm opacity-90 truncate transition-all duration-200
            ${habit.completed ? 'line-through opacity-70' : 'hover:opacity-100 hover:text-terminal-green'}
            group-hover:opacity-100`}>
            {habit.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {habit.streak > 0 && (
          <motion.div 
            className={`terminal-status flex items-center gap-1.5 text-sm sm:text-base font-medium p-1.5 sm:p-2 min-w-[50px] justify-center rounded-lg
              ${habit.completed ? 'shadow-glow-primary' : ''}
              ${habit.streak > 5 ? 'bg-terminal-green bg-opacity-10' : ''}
            `}
            initial={{ opacity: 0, y: 10}}
            animate={{ opacity: 1, y: 0}}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15}}
            title={`Current cycle: ${habit.streak} ${habit.streak === 1 ? 'day' : 'days'}`}
          >
            <Flame size={12} strokeWidth={1.5} className={`${habit.streak > 5 ? 'text-terminal-green animate-pulse-strong' : 'opacity-80' }`} />
            <span className="font-mono tracking-tight font-semibold">{habit.streak}</span>
          </motion.div>
        )}
        
        <motion.button
          onClick={onDelete}
          className="terminal-button p-1 opacity-60 hover:opacity-100 transition-opacity duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Delete Protocol"
        >
          <Trash2 size={12} className="text-red-500" />
        </motion.button>
      </div>
    </motion.div>
  );
}; 