import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { HabitItem } from './HabitItem';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit } from '@/types';

interface HabitListProps {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onHabitsChange, onToggleHabit, onDeleteHabit }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = habits.findIndex((habit) => habit.id === active.id);
      const newIndex = habits.findIndex((habit) => habit.id === over.id);
      const newHabits = arrayMove(habits, oldIndex, newIndex);
      onHabitsChange(newHabits);
    }
  };

  return (
    <motion.div
      className="space-y-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={() => onToggleHabit(habit.id)}
                onDelete={() => onDeleteHabit(habit.id)}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-400 dark:text-gray-500"
        >
          No habits added yet. Add your first habit to get started!
        </motion.div>
      )}
    </motion.div>
  );
}; 