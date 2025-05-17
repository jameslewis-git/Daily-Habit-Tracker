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
              className="terminal-input w-full bg-transparent border border-terminal-green/20 px-3 py-2 text-terminal-green focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/50 font-mono uppercase tracking-wider"
              placeholder="OPERATOR NAME"
              maxLength={20}
              autoFocus
              style={{
                caretColor: 'var(--terminal-green)',
                textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
              }}
            />
          </div>
          
          <motion.button
            type="submit"
            className="terminal-button w-full py-3 px-4 bg-terminal-green/10 border border-terminal-green/30 text-terminal-green font-mono tracking-widest text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!name.trim()}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-terminal-green/0 via-terminal-green/10 to-terminal-green/0 group-hover:via-terminal-green/20 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="terminal-cursor inline-block w-2 h-4 bg-terminal-green/70 animate-pulse" />
              INITIALIZE SEQUENCE
            </span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}; 