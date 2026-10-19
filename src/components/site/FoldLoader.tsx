import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../../config/brand.config';

export const FoldLoader: React.FC = () => {
  const [show, setShow] = useState<boolean>(() => {
    return !sessionStorage.getItem('quillfold_loader_seen');
  });
  const [phase, setPhase] = useState<'wordmark' | 'hairline' | 'exit'>('wordmark');

  useEffect(() => {
    if (!show) return;

    sessionStorage.setItem('quillfold_loader_seen', 'true');

    // Skip on click or keypress per PRD §7
    const handleSkip = () => {
      setShow(false);
    };
    window.addEventListener('click', handleSkip);
    window.addEventListener('keydown', handleSkip);

    const t1 = setTimeout(() => setPhase('hairline'), 300);
    const t2 = setTimeout(() => setPhase('exit'), 1000);
    const t3 = setTimeout(() => setShow(false), 1500);

    return () => {
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('keydown', handleSkip);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          animate={phase === 'exit' ? { y: '-100%' } : { y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] bg-[#F6F3EE] flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <div className="relative flex flex-col items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase === 'exit' ? 0 : 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <svg
                className="w-8 h-8 text-[#24473B]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
              <span className="font-display text-3xl font-medium tracking-tight text-[#1F2421]">
                {BRAND.name}
              </span>
            </motion.div>

            {/* 1px hairline drawing left to right */}
            <div className="w-36 h-[1px] bg-[#E3DED5] overflow-hidden relative">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase === 'hairline' || phase === 'exit' ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full bg-[#24473B] origin-left"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-[11px] font-mono uppercase tracking-widest text-[#7A817B] mt-2"
            >
              Initializing pipeline sandbox
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
