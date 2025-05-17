export interface Habit {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  streak: number;
  lastCompletedAt?: string;
  createdAt: string;
  position: number;
} 