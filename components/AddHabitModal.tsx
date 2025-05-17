import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusSquare, AlertTriangle } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description?: string) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Protocol Name is mandatory for system integration.');
      nameInputRef.current?.focus();
      return;
    }
    setNameError('');
    onAdd(name.trim(), description.trim() || undefined);
    // Resetting state is handled by useEffect [isOpen]
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setNameError('');
      // Delay focus to allow modal animation to complete
      setTimeout(() => nameInputRef.current?.focus(), 150);
    } 
  }, [isOpen]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50, filter: 'blur(8px)' },
    visible: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 250, damping: 30, delay: 0.05 } },
    exit: { opacity: 0, scale: 0.9, y: 30, filter: 'blur(5px)', transition: { duration: 0.25, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="glassmorphism-interactive w-full max-w-lg rounded-xl p-6 sm:p-8 shadow-2xl border-border/70 dark:border-primary/30"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-habit-modal-title"
          >
            <div className="relative">
              <motion.button
                onClick={onClose}
                className="absolute -right-3 -top-3 text-muted-foreground hover:text-primary p-1.5 rounded-full hover:bg-card/70 focus-visible:ring-2 focus-visible:ring-primary"
                whileHover={{ scale: 1.25, rotate: 135, transition: {type: 'spring', stiffness:300} }}
                whileTap={{ scale: 0.9 }}
                title="Terminate Process"
                aria-label="Close add habit modal"
              >
                <X size={26} strokeWidth={2.5} />
              </motion.button>

              <h2 id="add-habit-modal-title" className="mb-2 text-2xl sm:text-3xl font-semibold text-gradient-primary-secondary text-focus-in">
                Initiate New Protocol
              </h2>
              <p className="mb-6 sm:mb-8 text-sm text-muted-foreground">
                Define parameters for a new habit integration sequence.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label
                    htmlFor="habit-name-input"
                    className="mb-1.5 block text-sm font-medium text-foreground/80 tracking-wide"
                  >
                    Protocol Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="habit-name-input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setNameError('');
                    }}
                    className={`w-full rounded-md border-2 bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 
                               focus:outline-none focus:ring-2 focus:ring-primary/80 transition-all duration-200 shadow-sm 
                               hover:border-primary/70 focus:border-primary ${nameError ? 'border-red-500/70 focus:ring-red-500/50' : 'border-border'}`}
                    placeholder="e.g., 'Daily_Recon_Scan'"
                  />
                  {nameError && (
                    <motion.p 
                      initial={{opacity:0, y: -10}}
                      animate={{opacity:1, y:0}}
                      className="mt-2 flex items-center text-xs text-red-400">
                      <AlertTriangle size={14} className="mr-1.5"/> {nameError}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="habit-description-input"
                    className="mb-1.5 block text-sm font-medium text-foreground/80 tracking-wide"
                  >
                    Operational Briefing (Optional)
                  </label>
                  <textarea
                    id="habit-description-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border-2 border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 
                               focus:outline-none focus:ring-2 focus:ring-primary/80 transition-all duration-200 shadow-sm 
                               hover:border-primary/70 focus:border-primary min-h-[90px] resize-y"
                    placeholder="e.g., 'Execute 15-minute data assimilation cycle from Sector 7 archives.'"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-5">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="btn-futuristic btn-futuristic-secondary w-full sm:w-auto !bg-muted hover:!bg-muted/80 !text-muted-foreground hover:!border-border"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Abort Sequence
                  </motion.button>
                  <motion.button
                    type="submit"
                    className={`btn-futuristic w-full sm:w-auto ${!name.trim() ? 'opacity-60 cursor-not-allowed !shadow-none' : ''}`}
                    disabled={!name.trim()} 
                    whileHover={name.trim() ? { scale: 1.03, y: -3, transition: {type: 'spring', stiffness:300} } : {}}
                    whileTap={name.trim() ? { scale: 0.97, y: 0 } : {}}
                  >
                    <PlusSquare size={20} className="inline mr-2 -mt-0.5" />
                    Integrate Protocol
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 