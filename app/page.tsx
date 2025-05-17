"use client"

import { useEffect, useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check, Plus, Undo2, Redo2, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

// Types
interface Habit {
  id: string
  text: string
  completed: boolean
  streak: number
  category?: string
  color?: string
}

interface HabitHistoryState {
  habits: Habit[]
}

// SortableHabit component
function SortableHabit({ habit, onToggle, onDelete }: { habit: Habit; onToggle: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Generate a gradient based on the habit's streak
  const getStreakGradient = () => {
    if (habit.streak >= 30) return "from-purple-500 to-purple-300";
    if (habit.streak >= 21) return "from-indigo-500 to-indigo-300";
    if (habit.streak >= 14) return "from-blue-500 to-blue-300";
    if (habit.streak >= 7) return "from-green-500 to-green-300";
    if (habit.streak >= 3) return "from-yellow-500 to-yellow-300";
    return "from-orange-500 to-orange-300";
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center justify-between rounded-lg border-2 p-3 mb-3 bg-card hover:shadow-md transition-all duration-300 ${
        habit.completed ? "border-green-300 dark:border-green-800/50 shadow-sm shadow-green-100 dark:shadow-green-900/30" : "border-primary/10"
      }`}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center gap-3 w-full">
        <motion.button
          onClick={onToggle}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
            habit.completed 
              ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 dark:border-green-800" 
              : "border-primary hover:border-primary/80"
          } transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2`}
          aria-checked={habit.completed}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {habit.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30, 
                  duration: 0.3 
                }}
                className="text-white"
              >
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <div className="flex flex-col">
          <span className={`text-sm font-medium transition-all duration-200 ${habit.completed ? "line-through text-muted-foreground" : ""}`}>
            {habit.text}
          </span>
          
          {habit.streak > 0 && (
            <motion.div 
              className={`mt-1 text-xs flex items-center`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <div className={`rounded-full bg-gradient-to-r ${getStreakGradient()} px-2 py-0.5 text-white font-medium shadow-sm`}>
                {habit.streak} {habit.streak === 1 ? "day" : "days"}
              </div>
              <div className="ml-1 text-muted-foreground">streak</div>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="flex gap-1"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete habit</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}

// CircularProgress component
function CircularProgress({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference * (1 - percentage / 100)

  // Dynamic color gradient based on percentage
  const getProgressGradient = () => {
    if (percentage === 0) return "url(#gradientEmpty)";
    if (percentage < 30) return "url(#gradientLow)";
    if (percentage < 70) return "url(#gradientMedium)";
    if (percentage < 100) return "url(#gradientHigh)";
    return "url(#gradientComplete)";
  };

  // Dynamic message based on percentage
  let message = "Let's get started!";
  let emoji = "🚀";
  if (percentage > 0 && percentage < 30) {
    message = "Good start, keep going!";
    emoji = "👍";
  } else if (percentage >= 30 && percentage < 70) {
    message = `You're making progress!`;
    emoji = "💪";
  } else if (percentage >= 70 && percentage < 100) {
    message = `Almost there, you can do it!`;
    emoji = "🔥";
  } else if (percentage === 100) {
    message = "Amazing! All done today!";
    emoji = "🎉";
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-40 w-40">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Define gradients */}
          <defs>
            <linearGradient id="gradientEmpty" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="gradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="gradientMedium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            <linearGradient id="gradientHigh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="gradientComplete" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            className="text-muted-foreground/10"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          
          {/* Progress circle */}
          <motion.circle
            stroke={getProgressGradient()}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            filter="url(#glow)"
            style={{
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Percentage display */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10, 
              delay: 0.7 
            }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {percentage}%
            </div>
            <motion.div 
              className="text-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
            >
              {emoji}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Message */}
      <motion.p 
        className="mt-3 text-center text-sm font-medium text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        key={message} // This ensures animation re-triggers when message changes
      >
        {message}
      </motion.p>
    </motion.div>
  )
}

// Main component
export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitText, setNewHabitText] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [history, setHistory] = useState<HabitHistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false
  })
  const [showDragHint, setShowDragHint] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load habits from localStorage on initial render
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits)
      setHabits(parsedHabits)
      // Initialize history with the loaded state
      setHistory([{ habits: parsedHabits }])
      setHistoryIndex(0)
    }
  }, [])

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits))
    }
  }, [habits])

  // Calculate progress percentage
  const completedCount = habits.filter((habit) => habit.completed).length
  const totalCount = habits.length
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  // Check if all habits are completed and trigger confetti
  useEffect(() => {
    if (progressPercentage === 100 && totalCount > 0) {
      triggerConfetti()
    }
  }, [progressPercentage, totalCount])

  // Trigger confetti animation
  const triggerConfetti = () => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF577F', '#FF884B', '#FFBD9B', '#F6FFA6']
    });

    // Second burst after a small delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#19376D', '#576CBC', '#A5D7E8', '#0B2447']
      });
    }, 250);

    // Third burst after another small delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#539165', '#3F497F', '#F7C04A', '#8EACCD']
      });
    }, 400);
  }

  // Show notification
  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Add a new habit
  const addHabit = () => {
    if (newHabitText.trim() === "") return

    const newHabit: Habit = {
      id: Date.now().toString(),
      text: newHabitText,
      completed: false,
      streak: 0,
    }

    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ habits: updatedHabits })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    setNewHabitText("")
    setIsAddDialogOpen(false)
  }

  // Toggle habit completion
  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const wasCompleted = habit.completed;
        const newStreak = !wasCompleted ? habit.streak + 1 : 0;
        
        // Show milestone notifications
        if (!wasCompleted && newStreak > 0) {
          if (newStreak === 3) {
            showNotification(`3 day streak on "${habit.text}"! Keep it up!`);
          } else if (newStreak === 7) {
            showNotification(`Amazing! 7 day streak on "${habit.text}"!`);
            triggerConfetti();
          } else if (newStreak === 21) {
            showNotification(`Incredible! 21 day streak on "${habit.text}"! You've formed a habit!`);
            triggerConfetti();
          } else if (newStreak % 30 === 0) {
            showNotification(`${newStreak} day streak on "${habit.text}"! You're unstoppable!`);
            triggerConfetti();
          }
        }
        
        return {
          ...habit,
          completed: !wasCompleted,
          streak: newStreak,
        }
      }
      return habit
    })

    setHabits(updatedHabits)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ habits: updatedHabits })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Delete a habit
  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id)
    setHabits(updatedHabits)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ habits: updatedHabits })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Handle drag end for reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const reorderedItems = arrayMove(items, oldIndex, newIndex)

        // Add to history
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push({ habits: reorderedItems })
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)

        return reorderedItems
      })
    }
  }

  // Undo action
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setHabits(history[historyIndex - 1].habits)
    }
  }

  // Redo action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setHabits(history[historyIndex + 1].habits)
    }
  }

  // Show drag hint when user has multiple habits but hasn't seen the hint yet
  useEffect(() => {
    if (habits.length >= 2 && !localStorage.getItem('dragHintShown')) {
      setShowDragHint(true)
      // After 5 seconds, hide the hint and remember that it was shown
      setTimeout(() => {
        setShowDragHint(false)
        localStorage.setItem('dragHintShown', 'true')
      }, 5000)
    }
  }, [habits.length])

  return (
    <motion.div 
      className="container mx-auto max-w-md p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notification */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="hexagon-container p-1 aspect-[1.15/1] w-full max-w-md mx-auto">
        <Card className="hexagon-inner h-full overflow-hidden border-0 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="h-full flex flex-col"
          >
            <CardHeader className="pb-2 text-center">
              <div className="flex items-center justify-between px-4">
                <div className="flex flex-col">
                  <CardTitle className="text-2xl font-bold text-gradient">Daily Habits</CardTitle>
                  <CardDescription className="text-sm mt-1">Build your perfect routine</CardDescription>
                </div>
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                  <ThemeToggle />
                </motion.div>
              </div>
            </CardHeader>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative flex-grow overflow-auto px-4"
            >
              <CardContent className="relative z-10 h-full flex flex-col">
                <motion.div 
                  className="animate-float mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="hexagon-progress aspect-[1.15/1] w-32 mx-auto p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <div className="h-full w-full relative bg-background/50 backdrop-blur-sm flex items-center justify-center">
                      <CircularProgress percentage={progressPercentage} />
                    </div>
                  </div>
                </motion.div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Your Habits</h3>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={undo} 
                          disabled={historyIndex <= 0} 
                          title="Undo"
                          className="relative hexagon-button border-primary/20 shadow-sm aspect-square w-8 p-0 flex items-center justify-center"
                        >
                          <Undo2 className="h-4 w-4" />
                          <span className="sr-only">Undo</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={redo}
                          disabled={historyIndex >= history.length - 1}
                          title="Redo"
                          className="relative hexagon-button border-primary/20 shadow-sm aspect-square w-8 p-0 flex items-center justify-center"
                        >
                          <Redo2 className="h-4 w-4" />
                          <span className="sr-only">Redo</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Drag hint */}
                  <AnimatePresence>
                    {showDragHint && (
                      <motion.div 
                        className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 hexagon-inner text-xs border border-blue-200 dark:border-blue-800 shadow-inner"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 mr-1 text-blue-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
                            />
                          </svg>
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                            Tip: Drag and drop to reorder your habits!
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
                        <AnimatePresence>
                          {habits.length === 0 ? (
                            <motion.div 
                              className="text-center py-8 text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <p>No habits added yet. Add your first habit to get started!</p>
                              <motion.div 
                                className="mt-4 opacity-30"
                                animate={{ 
                                  y: [0, -10, 0],
                                  opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  repeatType: "loop" 
                                }}
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className="h-8 w-8 mx-auto" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                                  />
                                </svg>
                              </motion.div>
                            </motion.div>
                          ) : (
                            habits.map((habit) => (
                              <SortableHabit
                                key={habit.id}
                                habit={habit}
                                onToggle={() => toggleHabit(habit.id)}
                                onDelete={() => deleteHabit(habit.id)}
                              />
                            ))
                          )}
                        </AnimatePresence>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </CardContent>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CardFooter className="pt-1 border-t border-primary/10 mt-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.div 
                      className="w-full" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full hexagon-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md">
                        <Plus className="mr-2 h-4 w-4" /> Add New Habit
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] hexagon-inner border-2 border-primary/10 shadow-xl bg-background/95 backdrop-blur-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-gradient">Add New Habit</DialogTitle>
                      <DialogDescription>
                        Add a new habit to track daily. What would you like to build consistency with?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="habit-name" className="text-sm font-medium">Habit name</Label>
                        <Input
                          id="habit-name"
                          placeholder="e.g., Drink water, Read for 20 minutes"
                          value={newHabitText}
                          onChange={(e) => setNewHabitText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addHabit()
                            }
                          }}
                          className="hexagon-inner border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        className="hexagon-button border-primary/20"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={addHabit} 
                        disabled={newHabitText.trim() === ""}
                        className="hexagon-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
                      >
                        Add Habit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </motion.div>
          </motion.div>
        </Card>
      </div>
    </motion.div>
  )
}
