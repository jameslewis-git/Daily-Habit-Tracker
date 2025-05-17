export type Category = 'HEALTH' | 'PRODUCTIVITY' | 'FITNESS' | 'LEARNING' | 'MINDFULNESS' | 'CUSTOM';
export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type Reminder = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NONE';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  streak: number;
  lastCompletedAt?: string;
  createdAt: string;
  position: number;
  category: Category;
  frequency: Frequency;
  reminder: Reminder;
} 