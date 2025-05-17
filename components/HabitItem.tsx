import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Flame, Zap, CheckCircle, Target } from 'lucide-react';
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
      boxShadow: "0px 8px 25px -8px hsl(var(--primary) / 0.3), 0px 4px 10px -5px hsl(var(--primary) / 0.2)",
      borderColor: "hsl(var(--primary) / 0.8)"
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
        relative flex items-center gap-3 sm:gap-4 rounded-xl p-3.5 sm:p-4 
        glassmorphism-interactive
        border-2 border-transparent
        ${isDragging ? 'scale-105 !shadow-2xl !shadow-primary/40 cursor-grabbing' : 'cursor-default'}
        ${habit.completed ? 'bg-card/40 dark:bg-card/50' : 'bg-card/70 dark:bg-card/80'}
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
        className="flex-none cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-primary p-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
        {...listeners}
        title="Drag to reorder protocol"
        whileTap={{ scale: 1.2, color: 'hsl(var(--primary))' }}
      >
        <GripVertical size={22} strokeWidth={1.5} />
      </motion.button>

      <motion.button
        onClick={onToggle}
        className={`
          relative flex-none h-8 w-8 sm:h-9 sm:w-9 rounded-lg 
          flex items-center justify-center 
          border-2 transition-all duration-200 ease-in-out 
          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary
          group
          ${habit.completed
            ? 'bg-primary/20 border-primary/70 shadow-glow-primary dark:shadow-glow-primary'
            : 'bg-transparent border-muted-foreground/30 hover:border-primary/70'
          }
        `}
        whileHover={{ 
          scale: 1.18, 
          borderColor: habit.completed ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
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
              className="text-primary"
            >
              <CheckCircle size={22} strokeWidth={2.5}/>
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
              className="text-muted-foreground/60 group-hover:text-primary transition-colors duration-200"
            >
              <Target size={20} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-grow min-w-0 mr-2">
        <h3 className={`text-base sm:text-lg font-semibold transition-colors duration-300 truncate 
          ${habit.completed ? 'line-through text-muted-foreground/70' : 'text-foreground hover:text-primary'}
        `}>
          {habit.name}
        </h3>
        {habit.description && (
          <p className={`text-xs sm:text-sm text-muted-foreground/80 truncate ${habit.completed ? 'line-through' : ''}`}>
            {habit.description}
          </p>
        )}
      </div>

      {habit.streak > 0 && (
        <motion.div 
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium p-1.5 sm:p-2 rounded-lg min-w-[50px] justify-center ${streakGlowClass}
            bg-card/50 dark:bg-card/30 border border-border/30
            ${habit.completed ? 'text-primary/90' : 'text-accent dark:text-accent'}
          `}
          initial={{ opacity: 0, y: 10}}
          animate={{ opacity: 1, y: 0}}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15}}
          title={`Current cycle: ${habit.streak} ${habit.streak === 1 ? 'day' : 'days'}`}
        >
          <Flame size={16} strokeWidth={1.5} className={`${habit.streak > 5 ? 'text-red-500 animate-pulse-strong' : 'opacity-80' }`} />
          <span className="font-mono tracking-tight">{habit.streak}</span>
        </motion.div>
      )}
    </motion.div>
  );
}; 