import { useState, useEffect } from 'react';
import { Habit } from '@/types';

const STORAGE_KEY = 'daily-habits';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on mount
  useEffect(() => {
    const storedHabits = localStorage.getItem(STORAGE_KEY);
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);
      // Check and update streaks
      const updatedHabits = parsedHabits.map((habit: Habit) => {
        const lastCompleted = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
        const today = new Date();
        const isToday = lastCompleted?.toDateString() === today.toDateString();
        const wasYesterday = lastCompleted && 
          new Date(lastCompleted.setDate(lastCompleted.getDate() + 1)).toDateString() === today.toDateString();

        // Reset streak if more than a day has passed
        if (!isToday && !wasYesterday) {
          return {
            ...habit,
            streak: 0,
            completed: false,
          };
        }

        return habit;
      });
      setHabits(updatedHabits);
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string, description?: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      description,
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(),
      position: habits.length,
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id !== id) return habit;

        const now = new Date();
        const lastCompleted = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
        const isToday = lastCompleted?.toDateString() === now.toDateString();
        const wasYesterday = lastCompleted && 
          new Date(lastCompleted.setDate(lastCompleted.getDate() + 1)).toDateString() === now.toDateString();

        // If completing the habit
        if (!habit.completed) {
          return {
            ...habit,
            completed: true,
            lastCompletedAt: now.toISOString(),
            streak: wasYesterday || isToday ? habit.streak + 1 : 1,
          };
        }
        
        // If uncompleting the habit
        return {
          ...habit,
          completed: false,
          streak: Math.max(0, habit.streak - 1),
        };
      })
    );
  };

  const updateHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  const getCompletionPercentage = () => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(habit => habit.completed).length;
    return Math.round((completedCount / habits.length) * 100);
  };

  return {
    habits,
    addHabit,
    toggleHabit,
    updateHabits,
    deleteHabit,
    getCompletionPercentage,
  };
}; 