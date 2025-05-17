import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OperatorLoginProps {
  onComplete: (name: string) => void;
}

export const OperatorLogin: React.FC<OperatorLoginProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [typedText, setTypedText] = useState('');
  const welcomeText = '> INITIALIZING QUANTUM PROTOCOL\n> ENTER OPERATOR DESIGNATION_';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= welcomeText.length) {
        setTypedText(welcomeText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim().toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="terminal-window w-full max-w-lg p-8"
      >
        <pre className="terminal-text text-sm sm:text-base mb-8 whitespace-pre-line">
          {typedText}<span className="terminal-cursor"/>
        </pre>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="terminal-text text-sm">{`>`}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="terminal-input w-full bg-transparent border border-terminal-green/20 px-3 py-2 text-terminal-green focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/50"
              placeholder="OPERATOR NAME"
              maxLength={20}
              autoFocus
            />
          </div>
          
          <motion.button
            type="submit"
            className="terminal-button w-full"
            disabled={!name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            INITIALIZE SEQUENCE
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}; 